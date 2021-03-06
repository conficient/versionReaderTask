import ma = require('azure-pipelines-task-lib/mock-answer');
import tmrm = require('azure-pipelines-task-lib/mock-run');
import path = require('path');
import { tmpdir } from 'os';

let taskPath = path.join(__dirname, '..', 'index.js');
let tmr: tmrm.TaskMockRunner = new tmrm.TaskMockRunner(taskPath);

// set findMatch answer:
tmr.setAnswers({
    "findMatch": {
        "VersionMissing.csproj": ["./tests/VersionMissing.csproj"]
    }
});

// dummy build value
process.env.BUILD_BUILDID = "5678";

// set searchPattern + build prefix
tmr.setInput("searchPattern", "VersionMissing.csproj");
tmr.setInput("buildPrefix", ".");

tmr.run();