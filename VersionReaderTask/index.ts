/*
 *  VersionReader V2 devops build task
 *  ----------------------------------
**/
import path = require('path');
import tl = require('azure-pipelines-task-lib/task');
import * as utils from './Utils';

export class versionReader {

    // internal vars
    private searchPattern: string | undefined;
    private variablesPrefix: string | undefined;
    private buildPrefix: string | undefined;

    constructor() {

        this.searchPattern = tl.getPathInput("searchPattern", true);
        this.variablesPrefix = tl.getInput("variablesPrefix", false);
        this.buildPrefix = tl.getInput("buildPrefix", false);
    }

    public async execute() {
        try {
            // report input variables
            console.log("VersionReader task V2.0");
            console.log("=======================");
            console.log("Search Pattern: " + this.searchPattern)
            console.log("Variables Prefix: " + this.variablesPrefix)
            console.log("Build Prefix: " + this.buildPrefix)

            var projects = utils.getProjectFiles(this.searchPattern);

            console.log("Found " + projects.length + " project files");

            if (projects.length == 0) {
                tl.setResult(tl.TaskResult.Failed, "No projects");
                return;
            }

            projects.forEach(p => {
                console.log("Reading Project file: " + p);
                // read project file and extract version
            });

            tl.setResult(tl.TaskResult.SucceededWithIssues, "Not finished");
        }
        catch (err) {

        }
    }

}

// execute
var vr = new versionReader();
vr.execute();
