export default class St4sdWorkflow {
  signature = {
    name: "",
    description: "",
    parameters: [{ name: "", default: "" }],
  };
  steps = [];

  constructor() {}
  getWorkflowDefinition() {
    return {
      signature: this.getSignature(),
      steps: this.getSteps(),
    };
  }
  setWorkflowDefinition(definition) {
    if (definition.signature != undefined) {
      this.setSignature(definition.signature);
    }
    if (definition.steps != undefined) {
      this.setSteps(definition.steps);
    }
  }
  getSignature() {
    return this.signature;
  }
  setSignature(signature) {
    if (signature.name != undefined) {
      this.setName(signature.name);
    }
    if (signature.description != undefined) {
      this.setDescription(signature.description);
    }
    if (signature.parameters != undefined) {
      this.setParameters(signature.parameters);
    }
  }
  getName() {
    return this.signature.name;
  }
  setName(name) {
    this.signature.name = name;
  }
  getDescription() {
    return this.signature.description;
  }
  setDescription(description) {
    this.signature.description = description;
  }
  getParameters() {
    return this.signature.parameters;
  }
  setParameters(parameters) {
    if (Array.isArray(parameters)) {
      this.signature.parameters = parameters;
    }
  }
  addParameter() {
    this.signature.parameters.push({ name: "", default: "" });
  }
  removeParameter(index) {
    this.signature.parameters.splice(index, 1);
  }
  //Steps are being converted into arrays and then back into Dictionaries
  //to enable the editing of step names
  //if steps stay as dictionary and we want to edit a step name
  //we will have to delete the original key-value pair of a step
  //and add a new key-value pair as dictionaries keys can't be changed
  setSteps(steps) {
    this.steps = this.toStepArray(steps);
  }
  getSteps() {
    return this.toStepDict(this.steps);
  }
  getStepsArray() {
    return this.steps;
  }
  getNumberOfSteps() {
    return this.steps.length;
  }
  getStep(index) {
    return this.steps[index];
  }
  getStepByReference(reference) {
    return this.steps.find((step) => step.stepReference == reference);
  }
  setStep(index, newStep) {
    this.steps[index].step = newStep;
  }
  setStepReference(index, newStepReference) {
    this.steps[index].stepReference = newStepReference;
  }
  addStep(name, reference) {
    this.steps.push({ step: name, stepReference: reference });
  }
  removeStep(index) {
    this.steps.splice(index, 1);
  }
  toStepDict(stepsArray) {
    let stepDict = {};
    stepsArray.forEach((item) => {
      stepDict[item.step] = item.stepReference;
    });
    return stepDict;
  }
  toStepArray(stepsObject) {
    let stepArray = [];
    Object.keys(stepsObject).forEach((step) => {
      stepArray.push({ step: step, stepReference: stepsObject[step] });
    });
    return stepArray;
  }
  areStepsUnique() {
    //make sure the steps are unique by adding them to
    //a Set which can only contain unique values
    let arraySteps = this.steps.map((item) => item.step);
    let uniqueSteps = new Set(arraySteps);
    if (arraySteps.length != uniqueSteps.size) {
      return false;
    } else {
      return true;
    }
  }
}
