import tl = require('azure-pipelines-task-lib/task');

// Return list of project files for given pattern

export function getProjectFiles(projectPattern: string | undefined): string[] {
    if (typeof projectPattern === "undefined" || projectPattern=="") {
        console.log("No spec - return empty result");
        return [""];
    }
    var cwd = tl.getVariable("System.DefaultWorkingDirectory");
    console.log("cwd: " + cwd);
    
    var projectFiles: string[] = tl.findMatch(cwd || process.cwd(), projectPattern);
    
    if (!projectFiles || !projectFiles.length) {
        console.log("No results returned");
        return [];
    }

    // returning list of project files
    console.log(projectFiles);

    return projectFiles;
}
