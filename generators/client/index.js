"use strict";
const Generator = require("yeoman-generator");
const utility = require("./../generator-utility");

const clientscriptGenerator = class extends Generator {
  writing() {
    const {
      prefix,
      name,
      version,
      filename,
      componentname,
      scriptversion,
      projectinitials,
      suiteappfoldername
    } = this.options;
    const templates = {
      clientscript: "_cs.ts",
      usecase: "_usecase.ts",
      gateway: "_gateway.ts",
      file_prefix: projectinitials === undefined ? "" : projectinitials + "_",
      scriptversion: scriptversion === undefined ? "2.x" : scriptversion,
      gatewayname:
        componentname === undefined ? "gateway" :  componentname + "gateway",
      usecasename:
        componentname === undefined ? "CSUsecase" :  componentname + "CSUsecase"
    };

    const destinationPath = utility.scriptsDestinationPath(suiteappfoldername,componentname);

    this.fs.copyTpl(
      this.templatePath(`${templates.clientscript}`),
      this.destinationPath(
          destinationPath +"/" +           
          "/main/" +
          templates.file_prefix +
          "CS_" +
          componentname +
          ".ts"
      ),
      {
        name: name,
        version: version,
        prefix: prefix,
        filename: filename,
        usecasename: templates.file_prefix + templates.usecasename,
        gatewayname: templates.file_prefix + templates.gatewayname,
        scriptversion: scriptversion,
        suiteappfoldername: suiteappfoldername
      }
    );

    this.fs.copyTpl(
      this.templatePath(`${templates.gateway}`),
      this.destinationPath(
          destinationPath +"/" +         
          "/gateway/" +
          templates.file_prefix +
          templates.gatewayname +
          ".ts"
      ),
      {
        name: name,
        version: version,
        prefix: prefix,
        filename: filename,
        gatewayname: templates.file_prefix + templates.gatewayname,
        suiteappfoldername: suiteappfoldername
      }
    );

    this.fs.copyTpl(
      this.templatePath(`${templates.usecase}`),
      this.destinationPath(
         destinationPath +"/" +         
          "/usecase/" +
          templates.file_prefix +
          templates.usecasename +
          ".ts"
      ),
      {
        name: name,
        version: version,
        prefix: prefix,
        filename: filename,
        gatewayname: templates.file_prefix + templates.gatewayname,
        usecasename: templates.file_prefix + templates.usecasename,
        suiteappfoldername: suiteappfoldername
      }
    );
  }
};

module.exports = clientscriptGenerator;
