"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tl = require("azure-pipelines-task-lib/task");
// Return list of project files for given pattern
function getProjectFiles(projectPattern) {
    if (typeof projectPattern === "undefined" || projectPattern == "") {
        console.log("No spec - return empty result");
        return [""];
    }
    var cwd = tl.getVariable("System.DefaultWorkingDirectory");
    console.log("cwd: " + cwd);
    var projectFiles = tl.findMatch(cwd || process.cwd(), projectPattern);
    if (!projectFiles || !projectFiles.length) {
        console.log("No results returned");
        return [];
    }
    // returning list of project files
    console.log(projectFiles);
    return projectFiles;
}
exports.getProjectFiles = getProjectFiles;
