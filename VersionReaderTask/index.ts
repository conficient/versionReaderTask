/*
 *  VersionReader V2.1 devops build task
 *  ------------------------------------
**/
import path = require('path');
import tl = require('azure-pipelines-task-lib/task');
import * as utils from './utils';

/**
 * versionReader class to read version tags from 2017+ .??proj files
 *
 * @export
 * @class versionReader
 */
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
            console.log("VersionReader task V2.2");
            console.log("=======================");
            console.log(`Search Pattern  : ${this.searchPattern}`)
            console.log(`Variables Prefix: ${this.variablesPrefix}`)
            console.log(`Build Prefix    : ${this.buildPrefix}`)

            var projects = utils.getProjectFiles(this.searchPattern);
            console.log(`Found ${projects.length} project files`);

            if (projects.length == 0) {
                throw "No project matched";
            }

            // get first project
            var proj = projects[0];

            if (projects.length > 1) {
                tl.warning(`Matched more than one project, first will be used: ${proj}`);
            }
            console.log("Reading Project file: " + proj);
            // read project file and extract version
            var versions = utils.readProjectFile(proj);

            // Get version to use for VERSION_BUILD and set it
            var versionValue = utils.getFirstMatch(versions)
            utils.setBuildVariable(versionValue, this.variablesPrefix, this.buildPrefix);

            // Set other variables (Version, AssemblyVersion, VersionPrefix, VersionSuffix)
            utils.setEnvVars(versions, this.variablesPrefix);

            // report success
            tl.setResult(tl.TaskResult.Succeeded, "Variables set");
        }
        catch (err) {
            tl.error(err);
            tl.setResult(tl.TaskResult.Failed, err);
        }
    }

}

// execute
var vr = new versionReader();
vr.execute();
