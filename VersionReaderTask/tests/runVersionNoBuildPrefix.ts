import * as tmrm from 'azure-pipelines-task-lib/mock-run';
import * as path from 'node:path';

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

// set searchPattern — no buildPrefix (empty string means direct concatenation)
tmr.setInput("searchPattern", "Version.csproj");
tmr.setInput("buildPrefix", "");

tmr.run();
