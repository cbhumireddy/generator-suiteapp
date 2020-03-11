const whenOJETIsChosen = authChoises => props => authChoises.indexOf(props['ojet']) !== -1;

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
        name: "isTypeScriptApplication",
        message: "generate suiteapp using typescript.",
        default: "no",
        choices: ["Yes", "no"]
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

  module.exports = prompts;