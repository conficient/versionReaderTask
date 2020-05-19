"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tmrm = require("azure-pipelines-task-lib/mock-run");
const path = require("path");
let taskPath = path.join(__dirname, '..', 'index.js');
let tmr = new tmrm.TaskMockRunner(taskPath);
// set findMatch answer:
tmr.setAnswers({
    "findMatch": {
        "Version.csproj": ["./tests/Version.csproj"]
    }
});
// dummy build value
process.env.BUILD_BUILDID = "5678";
// set searchPattern 
tmr.setInput("searchPattern", "Version.csproj");
tmr.setInput("variablesPrefix", "TEST");
tmr.setInput("buildPrefix", ".");
tmr.run();
