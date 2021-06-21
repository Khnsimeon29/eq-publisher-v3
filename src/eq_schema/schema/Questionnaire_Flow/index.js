const { filter } = require("lodash");
class Questionnaire_Flow {
  constructor(questionnaireJson) {
    this.type = questionnaireJson.hub ? "Hub" : "Linear";
    this.options = this.build_options(questionnaireJson);
  }

  build_options(questionnaireJson) {
    const options = {}
    if(questionnaireJson.hub) {
      options.required_completed_sections = this.build_required_sections(questionnaireJson);
      return options;
    };
    if(questionnaireJson.summary) {
        options.summary = {
          collapsible: questionnaireJson.collapsibleSummary
      };
    };
    return options;
  }

  build_required_sections(questionnaireJson){
    const sections = filter(questionnaireJson.sections, {"required": true});
    const required_sections = sections.map((section) => section.id);
    return required_sections;
  }
}

module.exports = Questionnaire_Flow;
