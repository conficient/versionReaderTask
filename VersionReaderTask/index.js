"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.versionReader = void 0;
/*
 *  VersionReader V3.0 devops build task
 *  ------------------------------------
**/
const tl = __importStar(require("azure-pipelines-task-lib"));
const utils = __importStar(require("./utils"));
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
                console.log("VersionReader task V3.0");
                console.log("=======================");
                console.log(`Search Pattern  : ${this.searchPattern}`);
                console.log(`Variables Prefix: ${this.variablesPrefix}`);
                console.log(`Build Prefix    : ${this.buildPrefix}`);
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
