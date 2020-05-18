"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const path = __importStar(require("path"));
const assert = __importStar(require("assert"));
const ttm = __importStar(require("azure-pipelines-task-lib/mock-test"));
describe('VersionReaderTask v2 tests', function () {
    before(function () {
        console.log("before-tests");
    });
    after(() => {
        console.log("after-tests");
    });
    // test that task fails 
    it('Fails if no project spec is given', function (done) {
        let tp = path.join(__dirname, 'inputTest.js');
        let tr = new ttm.MockTestRunner(tp);
        tr.run();
        console.log(tr.succeeded);
        assert.equal(tr.succeeded, false, 'should have failed');
        assert.equal(tr.errorIssues.length, 1, "should have 1 error");
        assert.equal(tr.errorIssues[0], 'Unhandled: Input required: searchPattern', 'Should fail if no searchPattern provided');
        console.log(tr.stdout);
        done();
    });
    // task runs with file specified
    it('Should succeed with Project input', function (done) {
        let tp = path.join(__dirname, 'runVersion.js');
        let tr = new ttm.MockTestRunner(tp);
        tr.run();
        console.log(tr.succeeded);
        assert.equal(tr.succeeded, true, 'should have succeeded');
        assert.equal(tr.errorIssues.length, 0, "should have 0 errors");
        console.log(tr.stdout);
        done();
    });
    it('Should read Version', function (done) {
        // reads the Version.csproj file with no prefix
        let tp = path.join(__dirname, 'runVersion.js');
        let tr = new ttm.MockTestRunner(tp);
        tr.run();
        console.log(tr.succeeded);
        assert.equal(tr.succeeded, true, 'should have succeeded');
        assert.equal(tr.errorIssues.length, 0, "should have 0 errors");
        console.log(tr.stdout);
        assert_env("Version", "1.2.3");
        assert_env("AssemblyVersion", "1.2.4");
        assert_env("VersionPrefix", "1.2.5");
        assert_env("VersionSuffix", "alpha");
        assert_env("PackageVersion", "1.2.6");
        assert_env("FileVersion", "1.2.7");
        done();
    });
    it('Should set vars with Prefix', function (done) {
        // reads the Version.csproj file with TEST prefix
        let tp = path.join(__dirname, 'runVersionWithPrefix.js');
        let tr = new ttm.MockTestRunner(tp);
        tr.run();
        console.log(tr.succeeded);
        assert.equal(tr.succeeded, true, 'should have succeeded');
        assert.equal(tr.errorIssues.length, 0, "should have 0 errors");
        console.log(tr.stdout);
        assert_env("TEST_Version", "1.2.3");
        assert_env("TEST_AssemblyVersion", "1.2.4");
        assert_env("TEST_VersionPrefix", "1.2.5");
        assert_env("TEST_VersionSuffix", "alpha");
        assert_env("TEST_PackageVersion", "1.2.6");
        assert_env("TEST_FileVersion", "1.2.7");
        done();
    });
});
// check an environment var
function assert_env(envVar, expected) {
    var actual = process.env[envVar];
    console.log(`${envVar}: ${actual} [expected: ${expected}]`);
    assert.equal(actual, expected);
}
