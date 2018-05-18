Param (
    [string]$searchPattern = "**\*.??proj",
	[string]$variablesPrefix
)

# Write all params to the console.
Write-Host "VersionReader v1.5"
Write-Host "=================="
Write-Host ("Search Pattern: " + $searchPattern)
Write-Host ("Variables Prefix: " + $variablesPrefix)

function SetBuildVariable([string]$varName, [string]$varValue)
{
	Write-Host ("Setting variable " + $variablesPrefix + $varName + " to '" + $varValue + "' and build is " + $Env:BUILD_BUILDID)
    Write-Output ("##vso[task.setvariable variable=" + $variablesPrefix + $varName + ";]" +  $varValue )
    Write-Output ("##vso[task.setvariable variable=" + $variablesPrefix + $varName + "_Build;]" +  $varValue + "." + $Env:BUILD_BUILDID )
}

function SetVersionVariables([xml]$xml)
{
    $version = $xml.Project.PropertyGroup.Version
	SetBuildVariable "Version" $version
}

$filesFound = Get-ChildItem -Path $searchPattern -Recurse

if ($filesFound.Count -eq 0)
{
    Write-Warning ("No files matching pattern found.")
}

if ($filesFound.Count -gt 1)
{
   Write-Warning ("Multiple assemblyinfo files found.")
}

foreach ($fileFound in $filesFound)
{
    Write-Host ("Reading file: " + $fileFound)
    [xml]$XmlDocument = Get-Content -Path $fileFound
    SetVersionVariables($XmlDocument)
}
