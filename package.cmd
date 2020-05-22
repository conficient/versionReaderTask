@rem remove bad file
@del ".\VersionReaderTask\node_modules\xpath\docs\*.md"
tfx extension create --manifest-globs vss-extension.json

pause
