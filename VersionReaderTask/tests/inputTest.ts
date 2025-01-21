import * as path from 'path';
//import * as ma from 'azure-pipelines-task-lib/mock-answer';
import* as tmrm from 'azure-pipelines-task-lib/mock-run';

let taskPath = path.join(__dirname, '..', 'index.js');
let tmr: tmrm.TaskMockRunner = new tmrm.TaskMockRunner(taskPath);

// no searchPattern set

tmr.run();
