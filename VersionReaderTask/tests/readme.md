## Unit Test Info

The unit tests use [Mocha](https://mochajs.org/) to run tests and report results. The `describe` and `it` methods need to be imported. Each `describe` groups a set of tests (similar to a TestClass in MsTest). The `it` method is a single test.

The tests are run from the `_suite.js` file (compiled from `_suite.ts`). Each test loads one of the other files (modules) in the `/tests/` folder, e.g. `inputTest.js`.

These test different scenarios, importing the different module and running using the mock-test library from the pipeline sdk.
