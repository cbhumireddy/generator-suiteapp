"use strict";
const Generator = require("yeoman-generator");
const chalk = require("chalk");

const ojetGenerator = class extends Generator {
  writing() {
    const {  projectname, testPath } = this.options;
    const templates = {
      testKarma: "_test-main.karma.js"
    };

    // this.fs.copyTpl(
    //   this.templatePath(`${templates.testKarma}`),
    //   this.destinationPath(testPath + "jasmine/test-main.karma.js"),
    //   {
    //     testPath: testPath
    //   }
    // );    

    this.fs.copyTpl(
      this.templatePath(`jasmine`),
      this.destinationPath(testPath + "/jasmine"),
      {
        testPath: testPath,
        projectname:  projectname
      }
    );    
  }
};

module.exports = ojetGenerator;
