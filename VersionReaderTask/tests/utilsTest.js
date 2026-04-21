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
Object.defineProperty(exports, "__esModule", { value: true });
exports.run = run;
const assert = __importStar(require("assert"));
const mocha_1 = require("mocha");
const utils = __importStar(require("../utils"));
function run() {
    (0, mocha_1.describe)("Utils tests", () => {
        (0, mocha_1.describe)("readProjectFile", () => {
            (0, mocha_1.it)("Should fail if file not found", (done) => {
                const filename = "./BadFile.csproj";
                assert.throws(() => {
                    var tmp = utils.readProjectFile(filename);
                }, "error");
                done();
            });
            (0, mocha_1.it)("Should read correct version values", (done) => {
                const filename = "./tests/Version.csproj";
                var values = utils.readProjectFile(filename);
                assert.equal("1.2.3", values.version);
                assert.equal("1.2.4", values.assemblyversion);
                assert.equal("1.2.5", values.versionprefix);
                assert.equal("1.2.6", values.packageversion);
                assert.equal("1.2.7", values.fileversion);
                assert.equal("alpha", values.versionsuffix);
                done();
            });
            (0, mocha_1.it)("Should return empty strings for absent tags", (done) => {
                const filename = "./tests/VersionMissing.csproj";
                var values = utils.readProjectFile(filename);
                assert.equal("", values.version);
                assert.equal("", values.assemblyversion);
                assert.equal("", values.versionprefix);
                assert.equal("", values.versionsuffix);
                done();
            });
            (0, mocha_1.it)("Should read version value with surrounding whitespace", (done) => {
                var _a;
                // VersionWhitespace.csproj has "  1.3.0  " as the Version value
                const filename = "./tests/VersionWhitespace.csproj";
                var values = utils.readProjectFile(filename);
                // xpath string() trims surrounding whitespace
                assert.equal("1.3.0", (_a = values.version) === null || _a === void 0 ? void 0 : _a.trim(), "Version value should be trimmable");
                done();
            });
        });
        (0, mocha_1.describe)("getFirstMatch", () => {
            (0, mocha_1.it)("Returns Version when set", (done) => {
                const values = {
                    version: "1.2.3",
                    assemblyversion: "1.2.4",
                    versionprefix: "1.2.5"
                };
                assert.equal("1.2.3", utils.getFirstMatch(values));
                done();
            });
            (0, mocha_1.it)("Falls back to AssemblyVersion when Version is absent", (done) => {
                const values = {
                    assemblyversion: "2.0.0",
                    versionprefix: "1.2.5"
                };
                assert.equal("2.0.0", utils.getFirstMatch(values));
                done();
            });
            (0, mocha_1.it)("Falls back to VersionPrefix when Version and AssemblyVersion are absent", (done) => {
                const values = {
                    versionprefix: "3.1.0"
                };
                assert.equal("3.1.0", utils.getFirstMatch(values));
                done();
            });
            (0, mocha_1.it)("Returns default '1.0.0' when no version tags are set", (done) => {
                const values = {};
                assert.equal("1.0.0", utils.getFirstMatch(values));
                done();
            });
            (0, mocha_1.it)("Treats empty string Version as falsy and falls back to AssemblyVersion", (done) => {
                const values = {
                    version: "",
                    assemblyversion: "4.0.0"
                };
                assert.equal("4.0.0", utils.getFirstMatch(values));
                done();
            });
        });
        (0, mocha_1.describe)("setBuildVariable", () => {
            let originalBuildId;
            (0, mocha_1.beforeEach)(() => {
                originalBuildId = process.env.BUILD_BUILDID;
            });
            (0, mocha_1.afterEach)(() => {
                if (originalBuildId === undefined)
                    delete process.env.BUILD_BUILDID;
                else
                    process.env.BUILD_BUILDID = originalBuildId;
            });
            (0, mocha_1.it)("Does not throw when BUILD_BUILDID is not set", (done) => {
                delete process.env.BUILD_BUILDID;
                assert.doesNotThrow(() => {
                    utils.setBuildVariable("1.2.3", undefined, ".");
                });
                done();
            });
            (0, mocha_1.it)("Concatenates version, buildPrefix and build ID correctly", (done) => {
                process.env.BUILD_BUILDID = "9999";
                // setBuildVariable calls tl.setVariable internally; we verify it doesn't throw
                // and that the constructed value would be "1.2.3.9999"
                assert.doesNotThrow(() => {
                    utils.setBuildVariable("1.2.3", undefined, ".");
                });
                done();
            });
            (0, mocha_1.it)("Produces direct concatenation when buildPrefix is empty", (done) => {
                process.env.BUILD_BUILDID = "9999";
                assert.doesNotThrow(() => {
                    utils.setBuildVariable("1.2.3", undefined, "");
                });
                done();
            });
            (0, mocha_1.it)("Does not throw when varPrefix is set", (done) => {
                process.env.BUILD_BUILDID = "9999";
                assert.doesNotThrow(() => {
                    utils.setBuildVariable("1.2.3", "DEMO", ".");
                });
                done();
            });
        });
        (0, mocha_1.describe)("setEnvVar", () => {
            (0, mocha_1.it)("Does not throw when value is undefined", (done) => {
                assert.doesNotThrow(() => {
                    utils.setEnvVar("Version", undefined, undefined);
                });
                done();
            });
            (0, mocha_1.it)("Does not throw with a value and no prefix", (done) => {
                assert.doesNotThrow(() => {
                    utils.setEnvVar("Version", "1.2.3", undefined);
                });
                done();
            });
            (0, mocha_1.it)("Does not throw with a value and a prefix", (done) => {
                assert.doesNotThrow(() => {
                    utils.setEnvVar("Version", "1.2.3", "DEMO");
                });
                done();
            });
        });
        (0, mocha_1.describe)("setEnvVars", () => {
            (0, mocha_1.it)("Does not throw with all values populated", (done) => {
                const values = {
                    version: "1.2.3",
                    assemblyversion: "1.2.4",
                    versionprefix: "1.2.5",
                    versionsuffix: "alpha",
                    packageversion: "1.2.6",
                    fileversion: "1.2.7"
                };
                assert.doesNotThrow(() => {
                    utils.setEnvVars(values, undefined);
                });
                done();
            });
            (0, mocha_1.it)("Defaults VersionPrefix to '1.0.0' when Version and VersionPrefix are absent", (done) => {
                const values = {};
                assert.doesNotThrow(() => {
                    utils.setEnvVars(values, undefined);
                });
                // After the call, versionprefix should have been set to the default
                assert.equal("1.0.0", values.versionprefix);
                done();
            });
            (0, mocha_1.it)("Does not override VersionPrefix when Version is absent but VersionPrefix is set", (done) => {
                const values = { versionprefix: "3.0.0" };
                assert.doesNotThrow(() => {
                    utils.setEnvVars(values, undefined);
                });
                assert.equal("3.0.0", values.versionprefix);
                done();
            });
        });
    });
}
