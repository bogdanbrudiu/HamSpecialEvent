$ErrorActionPreference = 'Stop'

$repoRoot = $PSScriptRoot
$mappedDrive = $null

try {
  if ($repoRoot.Contains('#')) {
    $usedDrives = (Get-PSDrive -PSProvider FileSystem).Name
    $candidate = @('Z', 'Y', 'X', 'W', 'V', 'U', 'T') | Where-Object { $_ -notin $usedDrives } | Select-Object -First 1

    if (-not $candidate) {
      throw 'No free drive letter available for temporary path mapping.'
    }

    $mappedDrive = "$candidate`:"
    & subst $mappedDrive $repoRoot
    if ($LASTEXITCODE -ne 0) {
      throw "Failed to map $mappedDrive to $repoRoot."
    }

    $projectPath = Join-Path $mappedDrive 'HamEvent\HamEvent.csproj'
  }
  else {
    $projectPath = Join-Path $repoRoot 'HamEvent\HamEvent.csproj'
  }

  dotnet run --project $projectPath
}
finally {
  if ($mappedDrive) {
    & subst $mappedDrive /d | Out-Null
  }
}
