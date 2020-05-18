"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const tl = require("azure-pipelines-task-lib/task");
const utils = __importStar(require("./Utils"));
/**
 * versionReader class to read version tags from 2017+ .??proj files
 *
 * @export
 * @class versionReader
 */
class versionReader {
    constructor() {
        this.searchPattern = tl.getPathInput("searchPattern", true);
        this.variablesPrefix = tl.getInput("variablesPrefix", false);
        this.buildPrefix = tl.getInput("buildPrefix", false);
    }
    execute() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // report input variables
                console.log("VersionReader task V2.0");
                console.log("=======================");
                console.log(`Search Pattern  : ${this.searchPattern}`);
                console.log(`Variables Prefix: ${this.variablesPrefix}`);
                console.log(`Build Prefix    : ${this.buildPrefix}`);
                var projects = utils.getProjectFiles(this.searchPattern);
                console.log(`Found ${projects.length} project files`);
                if (projects.length == 0) {
                    tl.setResult(tl.TaskResult.Failed, "No projects");
                    return;
                }
                if (projects.length == 0) {
                    tl.setResult(tl.TaskResult.Failed, "No projects found/matched");
                    return;
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
                var versionValue = utils.getFirstMatch(versions);
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
        });
    }
}
exports.versionReader = versionReader;
// execute
var vr = new versionReader();
vr.execute();
