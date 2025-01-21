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
                // file does not exist
                const filename = "./BadFile.csproj";
                assert.throws(() => {
                    var tmp = utils.readProjectFile(filename);
                }, "error");
                done();
            });
            (0, mocha_1.it)("Should read correct version values", (done) => {
                // file does exist
                const filename = "./test/Version.csproj";
                var values = utils.readProjectFile(filename);
                assert.equal("1.2.3", values.version);
                assert.equal("1.2.4", values.assemblyversion);
                assert.equal("1.2.5", values.versionprefix);
                assert.equal("1.2.6", values.packageversion);
                assert.equal("1.2.7", values.fileversion);
                assert.equal("alpha", values.versionsuffix);
                done();
            });
        });
    });
}
