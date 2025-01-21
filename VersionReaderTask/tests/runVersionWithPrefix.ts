import * as ma  from 'azure-pipelines-task-lib/mock-answer';
import * as tmrm  from 'azure-pipelines-task-lib/mock-run';
import * as path  from 'node:path';

let taskPath = path.join(__dirname, '..', 'index.js');
let tmr: tmrm.TaskMockRunner = new tmrm.TaskMockRunner(taskPath);

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