/*
 *  VersionReader V2 devops build task
 *  ----------------------------------
 */
import tl = require('azure-pipelines-task-lib/task');

async function run() {
    try {
        // read input variables
        const searchPattern: string | undefined = tl.getInput('searchPattern', true);
        if (typeof searchPattern === "undefined") {
            tl.setResult(tl.TaskResult.Failed, "No searchPattern provided");
            return;
        }
        const variablesPrefix: string | undefined = tl.getInput('variablesPrefix', true);
        const buildPrefix: string | undefined = tl.getInput('buildPrefix', true);

        // report input variables
        console.log("VersionReader task V2.0");
        console.log("=======================");
        console.log("Search Pattern: " + searchPattern)
        console.log("Variables Prefix: " + variablesPrefix)
        console.log("Build Prefix: " + buildPrefix)

        var files = LoadFiles(searchPattern);
        if (files.length == 0) {
            tl.setResult(tl.TaskResult.Failed, "No matching files found");
            return;
        }

        files.forEach(file => {
            console.log("Reading Project file: " + file);
            // read version from 
        });
    }
    catch (err) {
        // Handle exceptions
        console.log("TASK FAILED: " + err.message);
        tl.setResult(tl.TaskResult.Failed, err.message);
    }

}

// execute
run();

function LoadFiles(searchPattern: string): string[] {
    return [];
}

function ReadVersion(filename:string) : string {
    throw "not implemented";
}
