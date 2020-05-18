"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tmrm = require("azure-pipelines-task-lib/mock-run");
const path = require("path");
let taskPath = path.join(__dirname, '..', 'index.js');
let tmr = new tmrm.TaskMockRunner(taskPath);
// set searchPattern 
tmr.setInput("searchPattern", "Version.csproj");
tmr.setInput("buildPrefix", ".");
tmr.run();
