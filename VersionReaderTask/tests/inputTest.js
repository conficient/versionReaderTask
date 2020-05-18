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
const tmrm = require("azure-pipelines-task-lib/mock-run");
let taskPath = path.join(__dirname, '..', 'index.js');
let tmr = new tmrm.TaskMockRunner(taskPath);
// no searchPattern set
tmr.run();
describe('Sample task tests', function () {
    before(function () {
    });
    after(() => {
    });
    it('should succeed with simple inputs', function (done) {
        // Add success test here
    });
    it('it should fail if tool returns 1', function (done) {
        // Add failure test here
        assert.fail("todo");
    });
});
