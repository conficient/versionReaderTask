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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProjectFiles = getProjectFiles;
exports.readProjectFile = readProjectFile;
exports.getFirstMatch = getFirstMatch;
exports.setBuildVariable = setBuildVariable;
exports.setEnvVars = setEnvVars;
exports.setEnvVar = setEnvVar;
const tl = __importStar(require("azure-pipelines-task-lib/task"));
const xmldom_1 = __importDefault(require("xmldom"));
const xpath = __importStar(require("xpath"));
const fs = __importStar(require("node:fs"));
// used version - if no values are present
const DEFAULT_VERSION = "1.0.0";
/**
 * Return list of project files for given pattern
 *
 * @export
 * @param {(string | undefined)} projectPattern - project file spec pattern, e.g. \MyProject\MyProject.csproj or similar
 * @returns {string[]} - full path of the matching files
 */
function getProjectFiles(projectPattern) {
    if (typeof projectPattern === "undefined" || projectPattern == "") {
        console.log("No spec - return empty result");
        return [""];
    }
    var cwd = tl.getVariable("System.DefaultWorkingDirectory");
    // if no CWD set, use process dir
    if (!cwd) {
        console.log("no System.DefaultWorkingDirectory, using process.cwd()");
        cwd = process.cwd();
    }
    console.log("cwd: " + cwd);
    var projectFiles = tl.findMatch(cwd, projectPattern);
    if (!projectFiles || !projectFiles.length) {
        console.log("No results returned");
        return [];
    }
    // returning list of project files
    console.log(projectFiles);
    return projectFiles;
}
/**
 * read .??proj file as XML and parse values from _Version_ tags
 *
 * @export
 * @param {string} file - filename to read
 * @returns {versionValues} - value of various Version tags, if found
 */
function readProjectFile(file) {
    // read the file
    console.log("reading file " + file);
    var data = fs.readFileSync(file, "utf8");
    console.log("read.. len = " + data.length);
    // generate dom
    console.log("creating DOM");
    var d = new xmldom_1.default.DOMParser();
    var doc = d.parseFromString(data);
    // get result
    var result = {
        version: getElement("Version", doc),
        assemblyversion: getElement("AssemblyVersion", doc),
        versionprefix: getElement("VersionPrefix", doc),
        versionsuffix: getElement("VersionSuffix", doc),
        packageversion: getElement("PackageVersion", doc),
        fileversion: getElement("FileVersion", doc),
    };
    return result;
}
/**
 * read element name using xpath
 *
 * @param {string} name - name of the property to find, e.g. Version
 * @param {Document} doc - Document to read
 * @returns {(string | undefined)}
 */
function getElement(name, doc) {
    // use XPath to get string
    var path = "string(/Project/PropertyGroup/" + name + ")";
    var e = xpath.select(path, doc);
    return e; // xpath does return a string here
}
/**
 * gets first version value that is set
 *
 * @export
 * @param {versionValues} values - version values
 * @returns
 */
function getFirstMatch(values) {
    // find first entry that has a value
    if (values.version)
        return values.version;
    if (values.assemblyversion)
        return values.assemblyversion;
    if (values.versionprefix)
        return values.versionprefix;
    // if no version values are specified anywhere, revert to default version
    // a blank project template typically does not set a version but shows 1.0.0 in
    // the project properties
    console.log(`No version tags found, using ${DEFAULT_VERSION} as the default`);
    return DEFAULT_VERSION;
}
/**
 * set the VERSION_BUILD value (with prefix if set)
 *
 * @export
 * @param {string} value - version value to use, e.g. 1.2.3
 * @param {(string | undefined)} varPrefix - variable prefix to add before, e.g. 'DEMO' will output DEMO_VERSION_BUILD
 * @param {(string | undefined)} buildPrefix - inserted between the version value and build ID, usually '.'
 * @returns
 */
function setBuildVariable(value, varPrefix, buildPrefix) {
    // version tag
    const VERSION = "VERSION";
    // get build number
    var buildId = process.env.BUILD_BUILDID;
    if (!buildId) {
        console.warn("No build number was found in the environment (BUILD_BUILDID) - unable to set VERSION_BUILD");
        return;
    }
    var varName;
    if (varPrefix)
        varName = `${varPrefix}_${VERSION}_BUILD`;
    else
        varName = `${VERSION}_BUILD`;
    var verValue = `${value}${buildPrefix !== null && buildPrefix !== void 0 ? buildPrefix : ""}${buildId}`;
    // set ENV var
    console.log(`Setting build variable ${varName} to '${verValue}'`);
    tl.setVariable(varName, verValue);
}
/**
 * set individual vars (does not append build num)
 *
 * @export
 * @param {versionValues} values - the version values to set
 * @param {(string | undefined)} prefix - prefix to add to start of each value
 */
function setEnvVars(values, prefix) {
    // if no version or versionPrefix set, set VersionPrefix to DEFAULT_VERSION
    if (!values.version && !values.versionprefix) {
        values.versionprefix = DEFAULT_VERSION;
    }
    setEnvVar("Version", values.version, prefix);
    setEnvVar("AssemblyVersion", values.assemblyversion, prefix);
    setEnvVar("VersionPrefix", values.versionprefix, prefix);
    setEnvVar("VersionSuffix", values.versionsuffix, prefix);
    setEnvVar("PackageVersion", values.packageversion, prefix);
    setEnvVar("FileVersion", values.fileversion, prefix);
}
/**
 * set individual vars, e.g. VERSION, VERSIONPREFIX etc. (with prefix if set)
 *
 * @export
 * @param {string} name - name of the variable to set, e.g. Version
 * @param {(string | undefined)} value - value to set, e.g. 1.2.3
 * @param {(string | undefined)} prefix - variable prefix, e.g. DEMO would result in DEMO_VERSION
 * @returns
 */
function setEnvVar(name, value, prefix) {
    // if blank, report and skip
    if (!value) {
        console.warn(`No value found for '${name}'`);
        return;
    }
    // create env-var name with prefix if set
    var varName;
    if (prefix)
        varName = `${prefix}_${name}`;
    else
        varName = name;
    console.log(`Variable ${varName} set to '${value}'`);
    tl.setVariable(varName, value);
}
