Param (
    [string]$searchPattern = "**\*.??proj",
    [string]$variablesPrefix,
    [string]$buildPrefix = "."
)

# Write all params to the console.
Write-Host "VersionReader v1.8"
Write-Host "=================="
Write-Host ("Search Pattern: " + $searchPattern)
Write-Host ("Variables Prefix: " + $variablesPrefix)
Write-Host ("Build Prefix: " + $buildPrefix)

function SetBuildVariable([string]$varName, [string]$varValue)
{
    $varName = $variablesPrefix + $varName
	Write-Host ("Setting variable " + $varName + " to '" + $varValue + "' and build is " + $Env:BUILD_BUILDID)
    Write-Output ("##vso[task.setvariable variable=" + $varName + ";]" +  $varValue )
    Write-Output ("##vso[task.setvariable variable=" + $varName + "_Build;]" +  $varValue + $buildPrefix + $Env:BUILD_BUILDID )
}

function SetVersionVariables([xml]$xml)
{
    $version = $xml.Project.PropertyGroup.Version
    if ($version -eq "")
    {
        Write-Host ("No Version property value found, checking AssemblyVersion instead")
        $version = $xml.Project.PropertyGroup.AssemblyVersion
        if ($version -eq "")
        {
            # FAIL
            Throw "No usable version found"
        }
    }
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
