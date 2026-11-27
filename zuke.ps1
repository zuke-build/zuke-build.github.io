#!/usr/bin/env pwsh
# Copyright (c) 2026 the Zuke contributors
# SPDX-License-Identifier: MIT
#
# Zuke launcher (PowerShell) for a build that runs on Node.
#
#   .\zuke.ps1               # run the default target
#   .\zuke.ps1 <target>      # run one target and its prerequisites
#   .\zuke.ps1 --list        # list every target
#
# Uses the node on PATH when it is Node 26 or newer, else a pinned,
# checksum-verified Node it downloads once, then installs the project's
# dependencies and runs zuke.ts.
#
# Honoured environment variables:
#   ZUKE_NODE_HOME  where Node is kept (default: ~/.zuke/node), one directory
#                   per release
#   NODE_VERSION    which Node to download, an exact release (e.g. 26.13.1).
#                   Defaults to the pinned, verified 26.13.1.
#   NODE_SHA256     required alongside a NODE_VERSION override: the SHA-256 of
#                   the release asset for the current platform. This launcher
#                   never downloads an unverified binary.

$ErrorActionPreference = "Stop"

$DefaultNodeVersion = "26.13.1"
$MinNodeMajor = 26

# SHA-256 of each `node-v<version>-<platform>.zip` asset, from
# https://nodejs.org/dist/v26.13.1/SHASUMS256.txt. Generated from @zuke/cli's
# node_pin.ts: change the pin there.
$NodeChecksums = @{
  "win-arm64" = "181ebe431b90787113a9e4fc80d38ce86d37888a353a0386de44d2872e48cb97"
  "win-x64"   = "e2edda75bfb089654705cf65a13b58933bfd5f57148e8ebda916f58a2474f1f7"
}

$dir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $dir

$nodeVersion = if ($env:NODE_VERSION) { $env:NODE_VERSION } else { $DefaultNodeVersion }
$nodeVersion = $nodeVersion.TrimStart("v")
$nodeRoot = if ($env:ZUKE_NODE_HOME) { $env:ZUKE_NODE_HOME } else { Join-Path $HOME ".zuke\node" }
$nodeHome = Join-Path $nodeRoot "v$nodeVersion"

function Resolve-Node {
  $onPath = Get-Command node -CommandType Application -ErrorAction SilentlyContinue
  if ($onPath) {
    # A shim that cannot report a version is treated as no node at all.
    $reported = ""
    try { $reported = & $onPath.Source --version 2>$null } catch { }
    if ($reported -match '^v(\d+)\.' -and [int]$Matches[1] -ge $MinNodeMajor) {
      return $onPath.Source
    }
  }
  $local = Join-Path $nodeHome "node.exe"
  if (Test-Path $local) { return $local }
  return $null
}

$node = Resolve-Node
if (-not $node) {
  Write-Host "zuke: Node $MinNodeMajor or newer not found - installing $nodeVersion now..."

  $arch = [System.Runtime.InteropServices.RuntimeInformation]::OSArchitecture.ToString()
  $platform = switch ($arch) {
    "X64" { "win-x64" }
    "Arm64" { "win-arm64" }
    default {
      throw "zuke: unsupported architecture for the checksum-verified Node download: $arch."
    }
  }

  if ($nodeVersion -eq $DefaultNodeVersion -and $NodeChecksums.ContainsKey($platform)) {
    $expectedSha256 = $NodeChecksums[$platform]
  } elseif ($env:NODE_SHA256) {
    $expectedSha256 = $env:NODE_SHA256
  } else {
    throw "zuke: NODE_VERSION=$nodeVersion overrides the pinned $DefaultNodeVersion, " +
      "but no checksum is pinned for it. Set NODE_SHA256 to the expected SHA-256 " +
      "of node-v$nodeVersion-$platform.zip, or unset NODE_VERSION."
  }

  $asset = "node-v$nodeVersion-$platform.zip"
  $downloadUrl = "https://nodejs.org/dist/v$nodeVersion/$asset"
  $workDir = Join-Path ([System.IO.Path]::GetTempPath()) ([System.Guid]::NewGuid())
  New-Item -ItemType Directory -Path $workDir | Out-Null
  $archive = Join-Path $workDir $asset
  $staging = $null
  try {
    # The download fetches over the network, which is occasionally flaky (e.g.
    # a transient 5xx from the CDN). Retry a few times with backoff so a blip
    # doesn't fail the whole run.
    $maxAttempts = 4
    for ($attempt = 1; $attempt -le $maxAttempts; $attempt++) {
      try {
        Invoke-WebRequest -Uri $downloadUrl -OutFile $archive
        break
      } catch {
        if ($attempt -ge $maxAttempts) {
          throw "zuke: failed to download Node after $maxAttempts attempts: $_"
        }
        $delay = $attempt * 3
        Write-Host "zuke: Node download failed (attempt $attempt/$maxAttempts); retrying in ${delay}s..."
        Start-Sleep -Seconds $delay
      }
    }

    $actualSha256 = (Get-FileHash -Path $archive -Algorithm SHA256).Hash.ToLowerInvariant()
    if ($actualSha256 -ne $expectedSha256.ToLowerInvariant()) {
      throw "zuke: checksum mismatch for ${asset}: expected $expectedSha256, got $actualSha256"
    }

    # Unpack into a sibling of the final directory, on the same volume, then
    # move the release folder into place: the move is a rename there, so an
    # interrupted run never leaves a half-extracted Node that looks installed.
    New-Item -ItemType Directory -Force -Path $nodeRoot | Out-Null
    $staging = Join-Path $nodeRoot ".v$nodeVersion.$([System.Guid]::NewGuid())"
    Expand-Archive -Path $archive -DestinationPath $staging -Force
    $release = Get-ChildItem -Path $staging -Directory | Select-Object -First 1
    # A name of its own, so a nested copy below is only ever this run's.
    $release = Rename-Item -Path $release.FullName -NewName ([System.Guid]::NewGuid()) -PassThru
    # The move publishes ours; if a concurrent launcher published first, ours
    # is refused or nested inside theirs, and we drop it and use theirs.
    # Nothing already at $nodeHome is ever deleted: it may be another run's Node.
    try {
      Move-Item -Path $release.FullName -Destination $nodeHome
    } catch {
      if (-not (Test-Path $nodeHome)) { throw }
    }
    $nested = Join-Path $nodeHome $release.Name
    Remove-Item -Recurse -Force $nested -ErrorAction SilentlyContinue
    if (-not (Test-Path (Join-Path $nodeHome "node.exe"))) {
      throw "zuke: $nodeHome exists but holds no node.exe; remove it and run again."
    }
  } finally {
    Remove-Item -Recurse -Force $workDir -ErrorAction SilentlyContinue
    if ($staging) { Remove-Item -Recurse -Force $staging -ErrorAction SilentlyContinue }
  }

  $node = Join-Path $nodeHome "node.exe"
}

# This node first on PATH, so the npm and npx the build runs are its own.
$env:PATH = (Split-Path -Parent $node) + [IO.Path]::PathSeparator + $env:PATH

# Written only after npm succeeds, so a failed install is retried next run.
$installed = Join-Path "node_modules" ".zuke-installed"

# The npm command this checkout needs, or $null when its install is current.
function Get-InstallNeeded {
  if (Test-Path "package-lock.json") {
    if (-not (Test-Path $installed) -or
      (Get-Item "package-lock.json").LastWriteTime -gt (Get-Item $installed).LastWriteTime) {
      return "ci"
    }
  } elseif ((Test-Path "package.json") -and -not (Test-Path $installed)) {
    return "install"
  }
  return $null
}

if (Get-InstallNeeded) {
  # One install at a time per checkout: a second launcher waits for the lock,
  # then finds the first one's install current. The lock is created with
  # CreateNew, which fails when it exists, and holds its owner's process id. A
  # lock whose owner is gone is reported, never removed: deciding that for
  # another run is a guess two waiting runs could both act on.
  New-Item -ItemType Directory -Force -Path (Join-Path $dir ".zuke") | Out-Null
  $lock = Join-Path $dir ".zuke/install.lock"
  $waited = 0
  while ($true) {
    try {
      $stream = [System.IO.File]::Open($lock, [System.IO.FileMode]::CreateNew, [System.IO.FileAccess]::Write)
      $bytes = [System.Text.Encoding]::ASCII.GetBytes("$PID")
      $stream.Write($bytes, 0, $bytes.Length)
      $stream.Close()
      break
    } catch {
      $holder = 0
      $text = Get-Content -Path $lock -Raw -ErrorAction SilentlyContinue
      if ([int]::TryParse("$text".Trim(), [ref]$holder) -and
        -not (Get-Process -Id $holder -ErrorAction SilentlyContinue)) {
        throw "zuke: $lock was left by an install that did not finish (process $holder); remove it and run again."
      }
      if ($waited -ge 600) {
        throw "zuke: another launcher has held $lock for 10 minutes; if none is running, remove it and run again."
      }
      Start-Sleep -Seconds 1
      $waited++
    }
  }
  try {
    $install = Get-InstallNeeded
    if ($install -eq "install") {
      Write-Warning "zuke: no package-lock.json here yet - running npm install so one can be written."
    }
    if ($install) {
      if (Test-Path $installed) { Remove-Item -Force $installed }
      & npm $install --ignore-scripts
      if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
      New-Item -ItemType File -Force -Path $installed | Out-Null
    }
  } finally {
    Remove-Item -Force $lock -ErrorAction SilentlyContinue
  }
}

& $node (Join-Path $dir "zuke.ts") @args
exit $LASTEXITCODE
