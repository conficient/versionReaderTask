import * as path from 'path';
import * as assert from 'assert';
import * as ttm from 'azure-pipelines-task-lib/mock-test';
import { clearScreenDown } from 'readline';

describe('VersionReaderTask v2 tests', function () {

    before( function() {
        // console.log("before-todo");
    });
    
    after(() => {
        // console.log("after-todo");
    });

    it('Fails if no project spec is given', function(done: MochaDone){
        let tp = path.join(__dirname, 'inputTest.js');
        let tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp);
    
        tr.run();
        console.log(tr.succeeded);
        assert.equal(tr.succeeded, false, 'should have failed');
        assert.equal(tr.errorIssues.length, 1, "should have 1 error");
        assert.equal(tr.errorIssues[0], 'Unhandled: Input required: searchPattern', 'Should fail if no searchPattern provided');
        console.log(tr.stdout);
        //assert.equal(tr.stdout.indexOf('Hello human') >= 0, true, "should display Hello human");
        done();
    });

    it('Should succeed with Project input', function(done: MochaDone) {
        let tp = path.join(__dirname, 'readTest.js');
        let tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp);
    
        tr.run();
        console.log(tr.succeeded);
        assert.equal(tr.succeeded, true, 'should have succeeded');
        assert.equal(tr.errorIssues.length, 0, "should have 0 errors");
        console.log(tr.stdout);
        done();
    });
 
});