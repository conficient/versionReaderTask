import * as path from 'path';
import * as assert from 'assert';
import ma = require('azure-pipelines-task-lib/mock-answer');
import tmrm = require('azure-pipelines-task-lib/mock-run');

let taskPath = path.join(__dirname, '..', 'index.js');
let tmr: tmrm.TaskMockRunner = new tmrm.TaskMockRunner(taskPath);

// no searchPattern set

tmr.run();

describe('Sample task tests', function () {

    before( function() {

    });

    after(() => {

    });

    it('should succeed with simple inputs', function(done: MochaDone) {
        // Add success test here
    });

    it('it should fail if tool returns 1', function(done: MochaDone) {
        // Add failure test here
        assert.fail("todo");
    });    
});