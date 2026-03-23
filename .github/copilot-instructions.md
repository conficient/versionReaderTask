# Copilot Instructions — VersionReaderTask

## What this project is

An Azure DevOps pipeline extension (VSIX) that reads version tags (`<Version>`, `<AssemblyVersion>`, `<VersionPrefix>`, etc.) from SDK-format `.csproj`/`.vbproj` files and exposes them as pipeline build variables. The task is written in TypeScript targeting Node 20.

## Repository layout

- `vss-extension.json` — Extension manifest (publisher, version, contribution metadata)
- `VersionReaderTask/` — The actual pipeline task (self-contained Node package)
  - `index.ts` / `index.js` — Task entry point; instantiates `versionReader` and calls `execute()`
  - `utils.ts` / `utils.js` — All business logic: file matching, XML parsing, variable setting
  - `task.json` — Azure Pipelines task definition (inputs, execution runtime)
  - `tests/` — Mocha test suite; uses `azure-pipelines-task-lib/mock-run` and `mock-test`
- `package.cmd` — Packages the VSIX using `tfx extension create`

Note: the `.csproj` files are test files and should not be confused with actual project files for the task.

## Build, test, and lint

All commands run inside `VersionReaderTask/`:

```bash
cd VersionReaderTask

# Compile TypeScript (output .js files sit alongside .ts sources — checked in)
npx tsc

# Run full test suite
npm test
# equivalent: npx mocha ./tests/_suite.js

# Run a single test file directly
npx mocha --require ./tests/_suite.js   # all tests loaded via _suite.js
```

> **Important:** The compiled `.js` files are committed alongside `.ts` sources. After editing any `.ts` file, recompile with `npx tsc` before running tests or packaging.

## Key conventions

### Two-package structure
The root `package.json` is minimal (extension tooling only). The task's own `package.json` and `node_modules` live inside `VersionReaderTask/`. Install dependencies with `npm install` inside `VersionReaderTask/`, not the root.

### Version tag priority
`getFirstMatch()` in `utils.ts` resolves the version in this order:
1. `<Version>`
2. `<AssemblyVersion>`
3. `<VersionPrefix>`
4. Falls back to `"1.0.0"` if none are found

### Output variables
The task sets these Azure Pipelines variables:
- `VERSION_BUILD` — version + build separator + `BUILD_BUILDID` (e.g. `1.2.3.5678`)
- `Version`, `AssemblyVersion`, `VersionPrefix`, `VersionSuffix`, `PackageVersion`, `FileVersion` — raw values from the project file

If `variablesPrefix` is set (e.g. `DEMO`), all variable names are prefixed: `DEMO_VERSION_BUILD`, `DEMO_Version`, etc.

### Testing pattern
Each integration test has a dedicated mock runner file in `tests/` (e.g. `runVersion.ts`). These use `TaskMockRunner` to mock `findMatch` answers and task inputs. The `_suite.ts` file imports `utilsTest` directly (unit tests) then registers integration tests via `MockTestRunner`. Tests assert against `##vso[task.setvariable ...]` lines in stdout using `assertSet()`.

Test fixture `.csproj` files live in `VersionReaderTask/tests/` (`Version.csproj`, `VersionMissing.csproj`, `VersionPrefix.csproj`).

### Extension packaging
```cmd
package.cmd
```
This deletes a conflicting markdown file from `xpath/docs/`, then runs `tfx extension create --manifest-globs vss-extension.json`. Requires `tfx-cli` installed globally.

### TypeScript config
Targets ES6, `module: NodeNext`, strict mode enabled. `esModuleInterop: true` is required for the `xmldom` default import (`import xdom from 'xmldom'`).
