"use strict";
const Generator = require("yeoman-generator");
const utility = require("./../generator-utility");

const userEventScriptGenerator = class extends Generator {
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
            mapreducescript: "_mr.ts",
            usecase: "_usecase.ts",
            gateway: "_gateway.ts",
            file_prefix: projectinitials === undefined ? "" : projectinitials + "_",
            scriptversion: scriptversion === undefined ? "2.x" : scriptversion,
            gatewayname:
                componentname === undefined ? "gateway" :  componentname + "gateway",
            usecasename:
                componentname === undefined ? "UEUsecase" : componentname + "UEUsecase"
        };
        
        const destinationPath = utility.scriptsDestinationPath(suiteappfoldername,componentname);

        this.fs.copyTpl(
            this.templatePath(`${templates.mapreducescript}`),
            this.destinationPath(
                destinationPath +
                "/main/" +
                templates.file_prefix +
                "MR_" +
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
                scriptversion: scriptversion
            }
        );

        // this.fs.copyTpl(
        //   this.templatePath(`${templates.gateway}`),
        //   this.destinationPath(
        //     name +
        //       "/src/" +
        //       componentname +
        //       "/gateway/" +
        //       templates.file_prefix +
        //       templates.gatewayname +
        //       ".ts"
        //   ),
        //   {
        //     name: name,
        //     version: version,
        //     prefix: prefix,
        //     filename: filename,
        //     gatewayname: templates.gatewayname
        //   }
        // );

        // this.fs.copyTpl(
        //     this.templatePath(`${templates.usecase}`),
        //     this.destinationPath(
        //         name +
        //         "/ts/" +
        //         suiteappfoldername+ "/" +
        //         componentname +
        //         "/usecase/" +
        //         templates.file_prefix +
        //         templates.usecasename +
        //         ".ts"
        //     ),
        //     {
        //         name: name,
        //         version: version,
        //         prefix: prefix,
        //         filename: filename,
        //         gatewayname: templates.file_prefix +templates.gatewayname,
        //         usecasename: templates.file_prefix +templates.usecasename
        //     }
        // );
    }
};

module.exports = userEventScriptGenerator;
