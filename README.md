# VersionReaderTask
VSTS build task to read Version tag from project files

Reads the `<Version>` tag from new `csproj` and `vbproj` 2017 format files into environment variables.

This tool was created to fix an issue with the new `.xxproj` project format. The new format does not support wildcard in the version and therefore auto-append of build suffix, which was previously supported.

Optionally prefix the variable values so multiple projects can be read.


Adapted from [AssemblyInfoReaderTask](https://github.com/kyleherzog/AssemblyInfoReaderTask) with thanks to [kyleherzog](https://github.com/kyleherzog)

### Version 1.8

Added fix for blank Version. Sometimes in simple projects the `Version` tag is absent because the value is the same as the `AssemblyVersion`. Added a check for a blank version being returned and attempts to use the `AssemblyVersion` value instead.
