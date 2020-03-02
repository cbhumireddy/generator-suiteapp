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
        name: "projectid",
        message: "Enter bundle name?",
        default: "bundlename"
      },
      {
        type: "input",
        name: "projectname",
        message: "Enter Project name?",
        default: "Sometestapplication"
      },
      // {
      //   type: "input",
      //   name: "componentname",
      //   message: "please provide component/use case?",
      //   default: "SampleComponent"
      // },
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
      }
    ];

    return this.prompt(prompts).then(props => {
      // To access props later use this.props.someAnswer;
      this.scripttype = props.scripttype;
      this.name = "com.netsuite" + '.' + props.projectid;
      this.projectname = props.projectname;
      this.autor = props.author;
      this.projectversion = "1.0.0";
      this.ojetincluded = props.ojet,
      this.ojetversion = props['ojet:version'],
      this.clientscriptneeded = true,
      this.usereventscriptneeded = true,
      this.suiteletscriptneeded = true,
      this.mapreducerscriptneeded = true,
      this.componentname = "DeleteMe",//props.componentname,
      this.includesimplepackage = false,
      this.publisherid = "com.netsuite",
      this.projectid = props.projectid,
      this.scriptversion = "2.x"
      //this.projectinitials = props.projectinitials
    });
  }

  default() {
    if (this.clientscriptneeded) {
      this.composeWith("suiteapp:client", {
        name: this.projectname,
        type: "ts",
        componentname: this.componentname,
        scriptversion : this.scriptversion,
        projectinitials : this.projectinitials,
        suiteappfoldername: this.name
      });
    }

    if (this.usereventscriptneeded) {
      this.composeWith("suiteapp:userevent", {
        name: this.projectname,
        type: "ts",
        componentname: this.componentname,
        scriptversion : this.scriptversion,
        projectinitials: this.projectinitials,
        suiteappfoldername : this.name
      });
    }

    if (this.suiteletscriptneeded) {
      this.composeWith("suiteapp:suitelet", {
        name: this.projectname,
        type: "ts",
        componentname: this.componentname,
        scriptversion : this.scriptversion,
        projectinitials: this.projectinitials,
        suiteappfoldername : this.name
      });
    }

    if (this.mapreducerscriptneeded) {
      this.composeWith("suiteapp:mapreduce", {
        name: this.projectname,
        type: "ts",
        componentname: this.componentname,
        scriptversion : this.scriptversion,
        projectinitials: this.projectinitials,
        suiteappfoldername : this.name
      });
    }

    if(this.ojetincluded === 'Yes') {
      this.composeWith("suiteapp:JET", {
        ojetversion : this.ojetversion,
        ojetpath : this.projectname + "/JET"
      })
    }
  }
  writing() {
    if(this.ojetincluded === 'Yes'){
      this.fs.copyTpl(
        this.templatePath("_package_with_ojet.json"),
        this.destinationPath(this.projectname + "/package.json"),
        {
          projectname: this.name,
          author: this.autor,
          projectversion: this.projectversion
        }
      );
      this.fs.copyTpl(
        this.templatePath("_Gruntfile.js"),
        this.destinationPath(this.projectname + "/Gruntfile.js"),
        {
          projectname: this.name,
          author: this.autor,
          projectversion: this.projectversion
        }
      );

    } else {
      if(!this.includesimplepackage){
        this.fs.copyTpl(
          this.templatePath("_package_with_karma.json"),
          this.destinationPath(this.projectname + "/package.json"),
          {
            projectname: this.name,
            author: this.autor,
            projectversion: this.projectversion
          }
        );
      }
      else{
        this.fs.copyTpl(
          this.templatePath("_package.json"),
          this.destinationPath(this.projectname + "/package.json"),
          {
            projectname: this.name,
            author: this.autor,
            projectversion: this.projectversion
          }
        );
      }
      
    }    

    // this.fs.copyTpl(
    //   this.templatePath("_deploy.xml"),
    //   this.destinationPath(this.projectname + "/deploy.xml"),
    //   {
    //     projectname: this.name
    //   }
    // );

    this.fs.copyTpl(
      this.templatePath("_.gitignore"),
      this.destinationPath(this.projectname + "/.gitignore"),
      {
        projectname: this.name
      }
    );

    this.fs.copyTpl(
      this.templatePath("_manifest.xml"),
      this.destinationPath(this.projectname + "/manifest.xml"),
      {
        projectname: this.projectname,
        publisherid: this.publisherid,
        projectid: this.projectid
      }
    );

    this.fs.copyTpl(
      this.templatePath("_.project"),
      this.destinationPath(this.projectname + "/.project"),
      {
        projectname: this.name
      }
    );

    this.fs.copyTpl(
      this.templatePath("_.eslintrc.js"),
      this.destinationPath(this.projectname + "/.eslintrc.js")
    );

    this.fs.copyTpl(
      this.templatePath("_.prettierrc"),
      this.destinationPath(this.projectname + "/.prettierrc")
    );

    this.fs.copyTpl(
      this.templatePath("_karma.conf.js"),
      this.destinationPath(this.projectname + "/karma.conf.js"),
      {
        projectname: this.name
      }
    );    

    this.fs.copyTpl(
      this.templatePath("_tsconfig.json"),
      this.destinationPath(this.projectname + "/tsconfig.json"),
      {
        projectname: this.name
      }
    );

    this.fs.copyTpl(
      this.templatePath("_tslint.json"),
      this.destinationPath(this.projectname + "/tslint.json")
    );

    if(this.ojetincluded=== 'Yes'){
      var ojetPath = this.projectname + "/JET";
      mkdirp.sync(ojetPath);
    }

    mkdirp.sync(this.projectname + "/FileCabinet/SuiteApps");
    mkdirp.sync(this.projectname + "/InstallationPreferences");
    mkdirp.sync(this.projectname + "/Objects");
    mkdirp.sync(this.projectname + "/Translations");    
  }

  // install() {
  //   this.log(`\n${chalk.bold.green('Running `webpack:build` to update client app\n')}`);
  //   this.npmInstall();
  // }
};
