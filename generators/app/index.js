"use strict";
const Generator = require("yeoman-generator");
const chalk = require("chalk");
const mkdirp = require("mkdirp");
const constants = require("./../generator-constants");
const utility = require("./../generator-utility");
const prompts = require("./../generator-prompts");

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);
    this.option("--ojet", {
      desc: "Indicates that this project includes JET folder structure",
      type: Boolean,
      defaults: false
    });

    this.option("--i", {
      description:
        "Run generation in series so that questions can be interacted with",
      default: false
    });

    this.option("--ts", {
      description:
        "generates suiteapp with typescript adaption. Default is false which generates js suiteapp",
      default: false
    });

    this.option("--install", {
      description: "Do not automatically install dependencies",
      default: false
    });

    try {
      // This makes `projectname` a required argument.
      this.argument("projectname", {
        type: String,
        required: !this.options["i"]
      });

      // This makes `projectid` a required argument.
      this.argument("projectid", {
        type: String,
        required: !this.options["i"]
      });
    } catch (ex) {
      this.log(ex.message);
      this.log(`You can use the interactive mode by running "yo suiteapp -i"`);
      this.error = true;
    }
  }

  initializing() {}

  configuring() {}

  prompting() {
    if (this.error) return;
    if (!this.options["i"] && this.args.length > 0) {
      return;
    }
    return this.prompt(prompts).then(props => {
      this.scripttype = props.scripttype;
      this.name = constants.PUBLISHER_ID + "." + props.projectid;
      this.projectname = props.projectname;
      this.autor = props.author;
      this.projectversion = constants.PROJECT_VERSION;
      (this.ojetincluded = props.ojet),
        (this.ojetversion = props["ojet:version"]),
        (this.clientscriptneeded = true),
        (this.usereventscriptneeded = true),
        (this.suiteletscriptneeded = true),
        (this.mapreducerscriptneeded = true),
        (this.componentname = constants.DUMMY_COMPONENT), //props.componentname,
        (this.includesimplepackage = false),
        (this.publisherid = constants.PUBLISHER_ID),
        (this.projectid = props.projectid),
        (this.scriptversion = constants.SUITE_SCRIPT_VERSION),
        (this.tsApplication = props.isTypeScriptApplication === "Yes");
      //this.projectinitials = props.projectinitials
    });
  }

  default() {
    if (this.error) return;
    this.prepareDefaults();
    this.spawnCommandSync(
      "suitecloud",
      [
        "createproject",
        "--type=" + constants.PROJECT_TYPE,
        "--projectname=" + this.projectname,
        "--publisherid=" + constants.PUBLISHER_ID,
        "--projectid=" + this.projectid,
        "--projectversion=" + constants.PROJECT_VERSION
      ],
      {
        // cwd: this.projectname
      }
    );
    if (this.name === undefined) {
      this.log(
        `${chalk.red(
          "There are validation errors: \r\n'projectid' is mandatory \r\n"
        )}!``${chalk.blue(
          "you can use the interactive mode by running 'yo suiteapp'"
        )}!`
      );
      return;
    }

    this.generateTypeScriptTemplates();

    if (this.ojetincluded === "Yes") {
      this.composeWith("suiteapp:JET", {
        ojetversion: this.ojetversion,
        ojetpath: utility.scriptsDestinationPath(this.name) + "/JET"
      });
    }
  }

  generateTypeScriptTemplates() {
    if (this.isTypeScriptApplication || this.tsApplication) {
      this.composeWith("suiteapp:client", {
        name: this.projectname,
        type: "ts",
        componentname: this.componentname,
        scriptversion: this.scriptversion,
        projectinitials: this.projectinitials,
        suiteappfoldername: this.name
      });
      this.composeWith("suiteapp:userevent", {
        name: this.projectname,
        type: "ts",
        componentname: this.componentname,
        scriptversion: this.scriptversion,
        projectinitials: this.projectinitials,
        suiteappfoldername: this.name
      });
      this.composeWith("suiteapp:suitelet", {
        name: this.projectname,
        type: "ts",
        componentname: this.componentname,
        scriptversion: this.scriptversion,
        projectinitials: this.projectinitials,
        suiteappfoldername: this.name
      });
      this.composeWith("suiteapp:mapreduce", {
        name: this.projectname,
        type: "ts",
        componentname: this.componentname,
        scriptversion: this.scriptversion,
        projectinitials: this.projectinitials,
        suiteappfoldername: this.name
      });
    }
  }

  prepareDefaults() {
    this.projectname =
      utility.extractProperty(this.options["projectname"]) || this.projectname;
    this.componentname = this.componentname || constants.DUMMY_COMPONENT;
    this.scriptversion = this.scriptversion || constants.SUITE_SCRIPT_VERSION;
    const projectIdFromArgs = utility.extractProperty(
      this.options["projectid"]
    );
    const bundlename = projectIdFromArgs
      ? constants.PUBLISHER_ID + "." + projectIdFromArgs
      : undefined;
    this.name = this.args.length > 0 ? bundlename : this.name;
    if (this.args.length > 1) {
      this.projectid = projectIdFromArgs;
    }
    const includeOjet = this.options["ojet"];
    if (includeOjet) {
      this.ojetincluded = "Yes";
    }
    if (!this.ojetversion) {
      this.ojetversion = "8.0.0";
    }
    this.scriptversion =
      utility.extractProperty(this.args[3]) || this.projectversion;
    if (this.scriptversion === undefined) {
      this.scriptversion = "2.x";
    }
    this.isTypeScriptApplication =
      this.options["ts"] || this.tsApplication === "Yes";
  }

  writing() {
    if (this.error) return;
    if (this.name === undefined) {
      return;
    }
    if (this.ojetincluded === "Yes") {
      this.copyOjetConfiguration();
    } else {
      if (!this.includesimplepackage) {
        this.copypackageconfig();
      }
    }

    this.copygitignore();

    this.copyprojecttemplate();

    this.copyeslintconfig();

    this.copyprettier();

    // TODO : Need to prepare seperate karma conf for type script
    this.copykarmaconfig();

    this.copytypescriptconfig();

    this.prepareJet();
  }

  copypackageconfig() {
    const template = this.isTypeScriptApplication
      ? "_package_with_karma_ts.json"
      : "_package_with_karma.json";
    this.fs.copyTpl(
      this.templatePath(template),
      this.destinationPath(
        utility.scriptsDestinationPath(this.name) + "/package.json"
      ),
      {
        projectname: this.name,
        author: this.autor,
        projectversion: this.projectversion
      }
    );
  }

  copyOjetConfiguration() {
    const template = this.isTypeScriptApplication
      ? "_package_with_ojet_ts.json"
      : "_package_with_ojet.json";
    this.fs.copyTpl(
      this.templatePath(template),
      this.destinationPath(
        utility.scriptsDestinationPath(this.name) + "/package.json"
      ),
      {
        projectname: this.name,
        author: this.autor,
        projectversion: this.projectversion
      }
    );
    this.fs.copyTpl(
      this.templatePath("_Gruntfile.js"),
      this.destinationPath(
        utility.scriptsDestinationPath(this.name) + "/Gruntfile.js"
      ),
      {
        projectname: this.name,
        author: this.autor,
        projectversion: this.projectversion
      }
    );
  }

  prepareJet() {
    if (this.ojetincluded === "Yes") {
      var ojetPath = utility.scriptsDestinationPath(this.name) + "/JET";
      mkdirp.sync(ojetPath);
    }
  }

  copytypescriptconfig() {
    if (this.isTypeScriptApplication) {
      this.fs.copyTpl(
        this.templatePath("_tsconfig.json"),
        this.destinationPath(
          utility.scriptsDestinationPath(this.name) + "/tsconfig.json"
        ),
        {
          projectname: this.name
        }
      );
      this.fs.copyTpl(
        this.templatePath("_tslint.json"),
        this.destinationPath(
          utility.scriptsDestinationPath(this.name) + "/tslint.json"
        )
      );
    }
  }

  copykarmaconfig() {
    this.fs.copyTpl(
      this.templatePath("_karma.conf.js"),
      this.destinationPath(
        utility.scriptsDestinationPath(this.name) + "/karma.conf.js"
      ),
      {
        projectname: this.name
      }
    );
  }

  copyprettier() {
    this.fs.copyTpl(
      this.templatePath("_.prettierrc"),
      this.destinationPath(
        utility.scriptsDestinationPath(this.name) + "/.prettierrc"
      )
    );
  }

  copyeslintconfig() {
    this.fs.copyTpl(
      this.templatePath("_.eslintrc.js"),
      this.destinationPath(
        utility.scriptsDestinationPath(this.name) + "/.eslintrc.js"
      )
    );
  }

  copyprojecttemplate() {
    this.fs.copyTpl(
      this.templatePath("_.project"),
      this.destinationPath(
        utility.scriptsDestinationPath(this.name) + "/.project"
      ),
      {
        projectname: this.name
      }
    );
  }

  copygitignore() {
    this.fs.copyTpl(
      this.templatePath("_.gitignore"),
      this.destinationPath(
        utility.scriptsDestinationPath(this.name) + "/.gitignore"
      ),
      {
        projectname: this.name
      }
    );
  }

  end() {
    if (this.error) return;
    this.log(
      `${chalk.bold.yellow(
        "Proceed with entering your netsuite credentials to setup account"
      )}`
    );

    this.spawnCommandSync("suitecloud", ["setupaccount"], {
      cwd: this.name
    });

    this.log("install", this.options["install"]);

    if (this.options["install"]) {
      this.log(
        `\n${chalk.bold.green(
          "Running `npm install` to install dependencies\n"
        )}`
      );

      this.spawnCommandSync("npm", ["install"], {
        cwd: utility.scriptsDestinationPath(this.name)
      });

      if (this.options["ojet"] || this.ojetincluded === "Yes") {
        this.log(
          `\n${chalk.bold.green(
            "Running `npm install` in JET to install dependencies\n"
          )}`
        );
        this.spawnCommandSync("npm", ["install"], {
          cwd: utility.scriptsDestinationPath(this.name) + "JET"
        });
      }
    }
  }
};
