export default class St4sdWorkflow {
  signature = {
    name: "",
    description: "",
    parameters: [{ name: "", default: "" }],
  };
  steps = {};
  execute = [];

  constructor() {}
  getWorkflowDefinition() {
    return {
      signature: this.signature,
      steps: this.steps,
      execute: this.execute,
    };
  }
  setName(name) {
    this.signature.name = name;
  }
  setDescription(description) {
    this.signature.description = description;
  }
  setParameters(parameters) {
    if (Array.isArray(parameters)) {
      this.parameters = parameters;
    }
  }
  setParameterName(index, parameterName) {
    this.signature.parameters[index].name = parameterName;
  }
  setParameterDefault(index, parameterDefault) {
    this.signature.parameters[index].default = parameterDefault;
  }
  addParameter() {
    this.signature.parameters.push({ name: "", default: "" });
  }
  removeParameter(index) {
    this.signature.parameters.splice(index, 1);
  }
  setSteps(steps) {
    this.steps = steps;
  }
  addStep(name, reference) {
    this.steps[name] = reference;
  }
  removeStep(step) {
    delete this.steps[step];
  }
  setExecute(execute) {
    this.execute = execute;
  }
  addExecute(execute) {
    this.execute.push(execute);
  }
  addExecuteArgument(target, argument, argumentDefinition) {
    this.execute.find((e) => e.target == target).args[argument] =
      argumentDefinition;
  }
  removeExecute(target, argument) {
    delete this.execute.find((e) => e.target == target).args[argument];
  }
}
