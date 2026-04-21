@echo off
cd VersionReaderTask
npx mocha --timeout 30000 --exit ./tests/_suite.js
