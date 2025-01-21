import * as assert from 'assert';
import { describe, it } from 'mocha';
import * as utils from '../utils';

export function run() {

   describe("Utils tests", () => {

      describe("readProjectFile", () => {

         it("Should fail if file not found", (done: Mocha.Done) => {
            // file does not exist
            const filename = "./BadFile.csproj";
            assert.throws(() => {
               var tmp = utils.readProjectFile(filename);
            }, "error");
            done();
         });

         it("Should read correct version values", (done: Mocha.Done) => {
            // file does exist
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

      });

   });
}