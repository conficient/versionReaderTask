"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
/*
 *  VersionReader V2 devops build task
 *  ----------------------------------
 */
const tl = require("azure-pipelines-task-lib/task");
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // read input variables
            const searchPattern = tl.getInput('searchPattern', true);
            if (typeof searchPattern === "undefined") {
                tl.setResult(tl.TaskResult.Failed, "No searchPattern provided");
                return;
            }
            const variablesPrefix = tl.getInput('variablesPrefix', true);
            const buildPrefix = tl.getInput('buildPrefix', true);
            // report input variables
            console.log("VersionReader task V2.0");
            console.log("=======================");
            console.log("Search Pattern: " + searchPattern);
            console.log("Variables Prefix: " + variablesPrefix);
            console.log("Build Prefix: " + buildPrefix);
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
    });
}
// execute
run();
function LoadFiles(searchPattern) {
    return [];
}
function ReadVersion(filename) {
    throw "not implemented";
}
