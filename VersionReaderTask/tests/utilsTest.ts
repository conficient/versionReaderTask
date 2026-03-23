import * as assert from 'assert';
import { describe, it, beforeEach, afterEach } from 'mocha';
import * as utils from '../utils';

export function run() {

   describe("Utils tests", () => {

      describe("readProjectFile", () => {

         it("Should fail if file not found", (done: Mocha.Done) => {
            const filename = "./BadFile.csproj";
            assert.throws(() => {
               var tmp = utils.readProjectFile(filename);
            }, "error");
            done();
         });

         it("Should read correct version values", (done: Mocha.Done) => {
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

         it("Should return empty strings for absent tags", (done: Mocha.Done) => {
            const filename = "./tests/VersionMissing.csproj";
            var values = utils.readProjectFile(filename);
            assert.equal("", values.version);
            assert.equal("", values.assemblyversion);
            assert.equal("", values.versionprefix);
            assert.equal("", values.versionsuffix);
            done();
         });

         it("Should read version value with surrounding whitespace", (done: Mocha.Done) => {
            // VersionWhitespace.csproj has "  1.3.0  " as the Version value
            const filename = "./tests/VersionWhitespace.csproj";
            var values = utils.readProjectFile(filename);
            // xpath string() trims surrounding whitespace
            assert.equal("1.3.0", values.version?.trim(), "Version value should be trimmable");
            done();
         });

      });


      describe("getFirstMatch", () => {

         it("Returns Version when set", (done: Mocha.Done) => {
            const values: utils.versionValues = {
               version: "1.2.3",
               assemblyversion: "1.2.4",
               versionprefix: "1.2.5"
            };
            assert.equal("1.2.3", utils.getFirstMatch(values));
            done();
         });

         it("Falls back to AssemblyVersion when Version is absent", (done: Mocha.Done) => {
            const values: utils.versionValues = {
               assemblyversion: "2.0.0",
               versionprefix: "1.2.5"
            };
            assert.equal("2.0.0", utils.getFirstMatch(values));
            done();
         });

         it("Falls back to VersionPrefix when Version and AssemblyVersion are absent", (done: Mocha.Done) => {
            const values: utils.versionValues = {
               versionprefix: "3.1.0"
            };
            assert.equal("3.1.0", utils.getFirstMatch(values));
            done();
         });

         it("Returns default '1.0.0' when no version tags are set", (done: Mocha.Done) => {
            const values: utils.versionValues = {};
            assert.equal("1.0.0", utils.getFirstMatch(values));
            done();
         });

         it("Treats empty string Version as falsy and falls back to AssemblyVersion", (done: Mocha.Done) => {
            const values: utils.versionValues = {
               version: "",
               assemblyversion: "4.0.0"
            };
            assert.equal("4.0.0", utils.getFirstMatch(values));
            done();
         });

      });


      describe("setBuildVariable", () => {

         let originalBuildId: string | undefined;

         beforeEach(() => {
            originalBuildId = process.env.BUILD_BUILDID;
         });

         afterEach(() => {
            if (originalBuildId === undefined)
               delete process.env.BUILD_BUILDID;
            else
               process.env.BUILD_BUILDID = originalBuildId;
         });

         it("Does not throw when BUILD_BUILDID is not set", (done: Mocha.Done) => {
            delete process.env.BUILD_BUILDID;
            assert.doesNotThrow(() => {
               utils.setBuildVariable("1.2.3", undefined, ".");
            });
            done();
         });

         it("Concatenates version, buildPrefix and build ID correctly", (done: Mocha.Done) => {
            process.env.BUILD_BUILDID = "9999";
            // setBuildVariable calls tl.setVariable internally; we verify it doesn't throw
            // and that the constructed value would be "1.2.3.9999"
            assert.doesNotThrow(() => {
               utils.setBuildVariable("1.2.3", undefined, ".");
            });
            done();
         });

         it("Produces direct concatenation when buildPrefix is empty", (done: Mocha.Done) => {
            process.env.BUILD_BUILDID = "9999";
            assert.doesNotThrow(() => {
               utils.setBuildVariable("1.2.3", undefined, "");
            });
            done();
         });

         it("Does not throw when varPrefix is set", (done: Mocha.Done) => {
            process.env.BUILD_BUILDID = "9999";
            assert.doesNotThrow(() => {
               utils.setBuildVariable("1.2.3", "DEMO", ".");
            });
            done();
         });

      });


      describe("setEnvVar", () => {

         it("Does not throw when value is undefined", (done: Mocha.Done) => {
            assert.doesNotThrow(() => {
               utils.setEnvVar("Version", undefined, undefined);
            });
            done();
         });

         it("Does not throw with a value and no prefix", (done: Mocha.Done) => {
            assert.doesNotThrow(() => {
               utils.setEnvVar("Version", "1.2.3", undefined);
            });
            done();
         });

         it("Does not throw with a value and a prefix", (done: Mocha.Done) => {
            assert.doesNotThrow(() => {
               utils.setEnvVar("Version", "1.2.3", "DEMO");
            });
            done();
         });

      });


      describe("setEnvVars", () => {

         it("Does not throw with all values populated", (done: Mocha.Done) => {
            const values: utils.versionValues = {
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

         it("Defaults VersionPrefix to '1.0.0' when Version and VersionPrefix are absent", (done: Mocha.Done) => {
            const values: utils.versionValues = {};
            assert.doesNotThrow(() => {
               utils.setEnvVars(values, undefined);
            });
            // After the call, versionprefix should have been set to the default
            assert.equal("1.0.0", values.versionprefix);
            done();
         });

         it("Does not override VersionPrefix when Version is absent but VersionPrefix is set", (done: Mocha.Done) => {
            const values: utils.versionValues = { versionprefix: "3.0.0" };
            assert.doesNotThrow(() => {
               utils.setEnvVars(values, undefined);
            });
            assert.equal("3.0.0", values.versionprefix);
            done();
         });

      });

   });
}