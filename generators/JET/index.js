"use strict";
const Generator = require("yeoman-generator");
const chalk = require("chalk");

const ojetGenerator = class extends Generator {
  writing() {
    const { ojetpath, ojetversion } = this.options;
    const templates = {
      package: "_package.json",
      gitignore: "_.gitignore",
      indexhtml: "_index.html"
    };

    this.fs.copyTpl(
      this.templatePath(`${templates.package}`),
      this.destinationPath(ojetpath + "/package.json"),
      {
        ojetpath: ojetpath,
        ojetversion: ojetversion
      }
    );

    this.fs.copyTpl(
      this.templatePath(`${templates.gitignore}`),
      this.destinationPath(ojetpath + "/.gitignore"),
      {
        ojetpath: ojetpath
      }
    );

    this.fs.copyTpl(
      this.templatePath(`netsuite`),
      this.destinationPath(ojetpath + "/src/netsuite"),
      {
        ojetpath: ojetpath
      }
    );

    this.fs.copyTpl(
      this.templatePath(`images`),
      this.destinationPath(ojetpath + "/src/images"),
      {
        ojetpath: ojetpath
      }
    );

    this.fs.copyTpl(
      this.templatePath(`uirefresh`),
      this.destinationPath(ojetpath + "/src/uirefresh"),
      {
        ojetpath: ojetpath
      }
    );
    // Below is failing for some reason, need to recheck
    // this.fs.copyTpl(
    //   this.templatePath(`css`),
    //   this.destinationPath(ojetpath + "/src/css"),
    //   {
    //     ojetpath: ojetpath
    //   }
    // );
    
    this.fs.copyTpl(
      this.templatePath(`${templates.indexhtml}`),
      this.destinationPath(ojetpath + "/src/index.html"),
      {
        ojetpath: ojetpath
      }
    );
  }

  // install() {
  //   this.log(`\n${chalk.bold.green('Running `webpack:build` to update client app\n')}`);
  //   this.installDependencies();
  // }
};

module.exports = ojetGenerator;
