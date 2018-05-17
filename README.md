# VersionReaderTask
VSTS build task to read Version tag from project files

Reads the `<Version>` tag from new `csproj` and `vbproj` 2017 format files into environment variables.

This tool was created to fix an issue with the new project format: it does not support wildcard in the version and therefore auto-append of build suffix.

Optionally prefix the variable values so multiple projects can be read.


Adapted from [AssemblyInfoReaderTask](https://github.com/kyleherzog/AssemblyInfoReaderTask) with thanks to [kyleherzog](https://github.com/kyleherzog)
