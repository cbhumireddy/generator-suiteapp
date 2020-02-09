"use strict";
const Generator = require("yeoman-generator");
const chalk = require("chalk");
const yosay = require("yosay");
const mkdirp = require("mkdirp");


const whenOJETIsChosen = authChoises => props => authChoises.indexOf(props['ojet']) !== -1;

module.exports = class extends Generator {
  initializing() {}

  configuring() {}

  prompting() {
    this.log(
      yosay(
        `Welcome to the finest ${chalk.green("generator-suiteapp")} generator!`
      )
    );
    const prompts = [
      {
        type: "input",
        name: "projectname",
        message: "Would you like to root name to be called?",
        default: "com.netsuite.bundlename"
      },
      {
        type: "input",
        name: "projectversion",
        message: "please input your project version?",
        default: "1.0.0"
      },
      {
        type: "input",
        name: "author",
        message: "please input author name?",
        default: "SuiteApp Developer"
      },
      {
        type: "input",
        name: "clientscript",
        message: "Do you want to include client script. Enter Y/N",
        default: "Y"
      },
      {
        type: "input",
        name: "usereventscript",
        message: "Do you want to include user event script. Enter Y/N",
        default: "Y"
      },
      {
        type: "input",
        name: "scriptversion",
        message: "please provide script version to create suite apps?",
        default: "2.x"
      },
      {
        type: "input",
        name: "componentname",
        message: "please provide component/use case?",
        default: "SampleComponent"
      },
      {
        type: "list",
        name: "ojet",
        message: "Does this project include OJET as well?",
        default: "no",
        choices: ["Yes", "no"]
      },
      {
        type: "input",
        name: "ojet:version",
        message: "please input your ojet version?",
        default: "8.0.0",
        when: whenOJETIsChosen(['Yes'])
      },
      {
        type: "input",
        name: "simplepackage",
        message: "use simple package json (Y/N)?",
        when: whenOJETIsChosen(['no']),
        default : 'Y'
      },
    ];

    return this.prompt(prompts).then(props => {
      // To access props later use this.props.someAnswer;
      this.scripttype = props.scripttype;
      this.name = props.projectname;
      this.projectname = props.projectname;
      this.autor = props.author;
      this.projectversion = props.projectversion;
      this.ojetincluded = props.ojet,
      this.ojetversion = props['ojet:version'],
      this.clientscriptneeded = props.clientscript === 'Y',
      this.usereventscriptneeded = props.usereventscript === 'Y',
      this.componentname = props.componentname,
      this.includesimplepackage = props.simplepackage === 'Y'
    });
  }

  default() {
    if (this.clientscriptneeded) {
      this.composeWith("suiteapp:client", {
        name: this.name,
        type: "ts",
        componentname: this.componentname,
        scriptversion : this.scriptversion
      });
    }

    if (this.usereventscriptneeded) {
      this.composeWith("suiteapp:userevent", {
        name: this.name,
        type: "ts",
        componentname: this.componentname,
        scriptversion : this.scriptversion
      });
    }

    if(this.ojetincluded === 'Yes') {
      this.composeWith("suiteapp:JET", {
        ojetversion : this.ojetversion,
        ojetpath : this.name + "/JET"
      })
    }
  }
  writing() {
    if(this.ojetincluded === 'Yes'){
      this.fs.copyTpl(
        this.templatePath("_package_with_ojet.json"),
        this.destinationPath(this.name + "/package.json"),
        {
          projectname: this.projectname,
          author: this.autor,
          projectversion: this.projectversion
        }
      );
      this.fs.copyTpl(
        this.templatePath("_Gruntfile.js"),
        this.destinationPath(this.name + "/Gruntfile.js"),
        {
          projectname: this.projectname,
          author: this.autor,
          projectversion: this.projectversion
        }
      );

    } else {
      if(!this.includesimplepackage){
        this.fs.copyTpl(
          this.templatePath("_package_with_karma.json"),
          this.destinationPath(this.name + "/package.json"),
          {
            projectname: this.projectname,
            author: this.autor,
            projectversion: this.projectversion
          }
        );
      }
      else{
        this.fs.copyTpl(
          this.templatePath("_package.json"),
          this.destinationPath(this.name + "/package.json"),
          {
            projectname: this.projectname,
            author: this.autor,
            projectversion: this.projectversion
          }
        );
      }
      
    }    

    this.fs.copyTpl(
      this.templatePath("_deploy.xml"),
      this.destinationPath(this.name + "/deploy.xml"),
      {
        projectname: this.projectname
      }
    );

    this.fs.copyTpl(
      this.templatePath("_.eslintrc.js"),
      this.destinationPath(this.name + "/.eslintrc.js")
    );

    this.fs.copyTpl(
      this.templatePath("_.prettierrc"),
      this.destinationPath(this.name + "/.prettierrc")
    );

    this.fs.copyTpl(
      this.templatePath("_karma.conf.js"),
      this.destinationPath(this.name + "/karma.conf.js"),
      {
        projectname: this.projectname
      }
    );

    this.fs.copyTpl(
      this.templatePath("_wallaby.conf.js"),
      this.destinationPath(this.name + "/wallaby.conf.js"),
      {
        projectname: this.projectname
      }
    );

    this.fs.copyTpl(
      this.templatePath("_tsconfig.json"),
      this.destinationPath(this.name + "/tsconfig.json"),
      {
        projectname: this.projectname
      }
    );

    this.fs.copyTpl(
      this.templatePath("_tslint.json"),
      this.destinationPath(this.name + "/tslint.json")
    );

    if(this.ojetincluded=== 'Yes'){
      var ojetPath = this.name + "/JET";
      mkdirp.sync(ojetPath);
    }

    mkdirp.sync(this.name + "/FileCabinet/SuiteApps");
    mkdirp.sync(this.name + "/InstallationPreferences");
    mkdirp.sync(this.name + "/Objects");
    mkdirp.sync(this.name + "/Translations");    
  }

  // install() {
  //   this.log(`\n${chalk.bold.green('Running `webpack:build` to update client app\n')}`);
  //   this.npmInstall();
  // }
};
