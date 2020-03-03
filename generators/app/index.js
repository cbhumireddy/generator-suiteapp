"use strict";
const Generator = require("yeoman-generator");
const chalk = require("chalk");
const yosay = require("yosay");
const mkdirp = require("mkdirp");
const constants = require('./../generator-constants');
const utility = require('./../generator-utility');

const whenOJETIsChosen = authChoises => props => authChoises.indexOf(props['ojet']) !== -1;

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);  
    this.option('--ojet', {
      desc: 'Indicates the command is run from JHipster CLI',
      type: Boolean,
      defaults: false
  });

    this.option("--i", {
      description : 'Run generation in series so that questions can be interacted with',
      default : false
    });

    this.option("--skip-install", {
      description : 'Do not automatically install dependencies',
      default : false
    });

    try{
      // This makes `projectname` a required argument.
       this.argument("projectname", { type: String, required: !this.options['i'] });

       // This makes `projectname` a required argument.
        this.argument("projectid", { type: String, required: !this.options['i'] });       

    } catch(ex){
      this.log(ex.message);
      this.error = true;
    }
    
  }

  initializing() {
  //   this.prepareDefaults();
  //   this.spawnCommandSync('suitecloud',['createproject', 
  //   '--type=' +constants.PROJECT_TYPE,
  //   '--projectname=' +  this.projectname,
  //   '--publisherid=' + constants.PUBLISHER_ID,
  //   '--projectid='  + this.projectid,
  //   '--projectversion=' + constants.PROJECT_VERSION
  //  ],
  //  {
  //    // cwd: this.projectname
  //  });
  }

  configuring() {}

  prompting() {
    if(this.error) return;
    if(!this.options['i'] && this.args.length > 0) {
      this.log('going');
      return;
    }

    this.log(
      yosay(
        `Welcome to the finest ${chalk.green("generator-suiteapp")} generator!`
      )
    );
    const prompts = [      
      {
        type: "input",
        name: "projectid",
        message: "Enter the project ID."
      },
      {
        type: "input",
        name: "projectname",
        message: "Enter the project name."
      },      
      {
        type: "list",
        name: "ojet",
        message: "Does this project include OJET as well.",
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
      this.name = constants.PUBLISHER_ID + '.' + props.projectid;
      this.projectname = props.projectname;
      this.autor = props.author;
      this.projectversion = constants.PROJECT_VERSION;
      this.ojetincluded = props.ojet,
      this.ojetversion = props['ojet:version'],
      this.clientscriptneeded = true,
      this.usereventscriptneeded = true,
      this.suiteletscriptneeded = true,
      this.mapreducerscriptneeded = true,
      this.componentname = constants.DUMMY_COMPONENT,//props.componentname,
      this.includesimplepackage = false,
      this.publisherid = constants.PUBLISHER_ID,
      this.projectid = props.projectid,
      this.scriptversion = constants.SUITE_SCRIPT_VERSION
      //this.projectinitials = props.projectinitials
    });
  }

  default() {
    if(this.error) return;
    this.prepareDefaults();
    this.spawnCommandSync('suitecloud',['createproject', 
    '--type=' +constants.PROJECT_TYPE,
    '--projectname=' +  this.projectname,
    '--publisherid=' + constants.PUBLISHER_ID,
    '--projectid='  + this.projectid,
    '--projectversion=' + constants.PROJECT_VERSION
   ],
   {
     // cwd: this.projectname
   });
     if(this.name === undefined){
      this.log(
        `${chalk.red("There are validation errors: \r\n'projectid' is mandatory \r\n")}!`
        `${chalk.blue("you can use the interactive mode by running 'yo suiteapp'")}!`
      );
      return;
     }    
     
    //if (this.clientscriptneeded) 
    //{      
      this.composeWith("suiteapp:client", {
        name: this.projectname,
        type: "ts",
        componentname: this.componentname,
        scriptversion : this.scriptversion,
        projectinitials : this.projectinitials,
        suiteappfoldername: this.name
      });
    //}
    

    //if (this.usereventscriptneeded) 
    {
      this.composeWith("suiteapp:userevent", {
        name: this.projectname,
        type: "ts",
        componentname: this.componentname,
        scriptversion : this.scriptversion,
        projectinitials: this.projectinitials,
        suiteappfoldername : this.name
      });
    }

    //if (this.suiteletscriptneeded) 
    {
      this.composeWith("suiteapp:suitelet", {
        name: this.projectname,
        type: "ts",
        componentname: this.componentname,
        scriptversion : this.scriptversion,
        projectinitials: this.projectinitials,
        suiteappfoldername : this.name
      });
    }

    //if (this.mapreducerscriptneeded) 
    {
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
        ojetpath : utility.scriptsDestinationPath(this.name) + "/JET"
      })
    }
  }

  prepareDefaults() {
    this.projectname = utility.extractProperty(this.options['projectname']) || this.projectname;
    this.componentname = this.componentname || constants.DUMMY_COMPONENT;
    this.scriptversion = this.scriptversion || constants.SUITE_SCRIPT_VERSION;
    const projectIdFromArgs = utility.extractProperty(this.options['projectid']);
    const bundlename = projectIdFromArgs ? constants.PUBLISHER_ID + '.' + projectIdFromArgs : undefined;
    this.name = this.args.length > 0 ? bundlename : this.name;
    if(this.args.length > 1){
      this.projectid = projectIdFromArgs;
    }
    const includeOjet = this.options['ojet'];
    if(includeOjet){
      this.ojetincluded = 'Yes'
    }
    if(!this.ojetversion){
        this.ojetversion = '8.0.0';
    }
    this.scriptversion = utility.extractProperty(this.args[3]) || this.projectversion;
    if(this.scriptversion === undefined){
      this.scriptversion = '2.x';
    }
  }
  
  writing() {
    if(this.error) return;
    if(this.name === undefined){
      return;
    }
    if(this.ojetincluded === 'Yes'){
      this.fs.copyTpl(
        this.templatePath("_package_with_ojet.json"),
        this.destinationPath(utility.scriptsDestinationPath(this.name) + "/package.json"),
        {
          projectname: this.name,
          author: this.autor,
          projectversion: this.projectversion
        }
      );
      this.fs.copyTpl(
        this.templatePath("_Gruntfile.js"),
        this.destinationPath(utility.scriptsDestinationPath(this.name) + "/Gruntfile.js"),
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
          this.destinationPath(utility.scriptsDestinationPath(this.name) + "/package.json"),
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
          this.destinationPath(utility.scriptsDestinationPath(this.name) + "/package.json"),
          {
            projectname: this.name,
            author: this.autor,
            projectversion: this.projectversion
          }
        );
      }
      
    }

    this.fs.copyTpl(
      this.templatePath("_.gitignore"),
      this.destinationPath(utility.scriptsDestinationPath(this.name) + "/.gitignore"),
      {
        projectname: this.name
      }
    );   

    this.fs.copyTpl(
      this.templatePath("_.project"),
      this.destinationPath(utility.scriptsDestinationPath(this.name) + "/.project"),
      {
        projectname: this.name
      }
    );

    this.fs.copyTpl(
      this.templatePath("_.eslintrc.js"),
      this.destinationPath(utility.scriptsDestinationPath(this.name) + "/.eslintrc.js")
    );

    this.fs.copyTpl(
      this.templatePath("_.prettierrc"),
      this.destinationPath(utility.scriptsDestinationPath(this.name) + "/.prettierrc")
    );

    this.fs.copyTpl(
      this.templatePath("_karma.conf.js"),
      this.destinationPath(utility.scriptsDestinationPath(this.name) + "/karma.conf.js"),
      {
        projectname: this.name
      }
    );    

    this.fs.copyTpl(
      this.templatePath("_tsconfig.json"),
      this.destinationPath(utility.scriptsDestinationPath(this.name) + "/tsconfig.json"),
      {
        projectname: this.name
      }
    );

    this.fs.copyTpl(
      this.templatePath("_tslint.json"),
      this.destinationPath(utility.scriptsDestinationPath(this.name) + "/tslint.json")
    );

    if(this.ojetincluded=== 'Yes'){
      var ojetPath = utility.scriptsDestinationPath(this.name) + "/JET";
      mkdirp.sync(ojetPath);
    }       
  }

  end() {
    if(this.error) return;    
   this.log(`${chalk.bold.yellow('Proceed with entering your netsuite credentials to setup account')}`);

  //  this.spawnCommandSync('suitecloud',['setupaccount'],
  //  {
  //     cwd: this.name
  //  });  

   if(!this.options['skip-install']){
    this.log(`\n${chalk.bold.green('Running `npm install` to install dependencies\n')}`);
  
    this.spawnCommandSync('npm', ['install'], {
      cwd : utility.scriptsDestinationPath(this.name)
    });
 
    this.log(`\n${chalk.bold.green('Running `npm install` in JET to install dependencies\n')}`);
 
    if(this.options['ojet']){
     this.spawnCommandSync('npm', ['install'], {
       cwd : utility.scriptsDestinationPath(this.name) + 'JET'
     });
    }
   }   
  }
};
