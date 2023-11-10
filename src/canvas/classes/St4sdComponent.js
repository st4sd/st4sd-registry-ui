export default class St4sdComponent {
  signature = {
    name: "",
    description: "",
    parameters: [],
  };
  command = {
    executable: "",
    arguments: "",
    expandArguments: "",
    environment: "",
  };
  variables = {};
  workflowAttributes = {
    replicate: "",
    aggregate: false,
    restartHookFile: "",
    restartHookOn: ["ResourceExhausted"],
    repeatInterval: "",
    repeatRetries: "",
    maxRestarts: "",
    shutdownOn: [""],
  };
  resourceRequest = {
    numberProcesses: "",
    numberThreads: "",
    ranksPerNode: "",
    threadsPerCore: "",
    memory: "",
    gpus: "",
  };
  resourceManager = {
    config: { backend: "", walltime: "" },
    lsf: {
      statusRequestInterval: "20",
      queue: "",
      reservation: "",
      resourceString: "",
      dockerImage: "",
      dockerProfileApp: "",
      dockerOption: "",
    },
    kubernetes: {
      image: "",
      imagePullSecret: "",
      gracePeriod: "",
      podSpec: "",
      apiKeyVar: "",
      host: "",
      namespace: "",
      cpuUnitsPerCore: "",
    },
  };
  constructor() {}
  getComponentDefintion() {
    return {
      signature: this.signature,
      command: this.command,
      variables: this.variables,
      workflowAttributes: this.workflowAttributes,
      resourceRequest: this.resourceRequest,
      resourceManager: this.resourceManager,
    };
  }
  setComponentDefintion(definition) {
    if (definition.signature != undefined) {
      this.setSignature(definition.signature);
    }
    if (definition.command != undefined) {
      this.setCommand(definition.command);
    }
    if (definition.variables != undefined) {
      this.setVariables(definition.variables);
    }
    if (definition.workflowAttributes != undefined) {
      this.setWorkflowAttributes(definition.workflowAttributes);
    }
    if (definition.resourceRequest != undefined) {
      this.setResourceRequest(definition.resourceRequest);
    }
    if (definition.resourceManager != undefined) {
      this.setResourceManager(definition.resourceManager);
    }
  }
  getSignature() {
    return this.signature;
  }
  setSignature(signature) {
    if (typeof signature === "object" && signature !== null) {
      this.signature = signature;
    }
  }
  getCommand() {
    return this.command;
  }
  setCommand(command) {
    if (typeof command === "object" && command !== null) {
      this.command = command;
    }
  }
  getVariables() {
    return this.variables;
  }
  setVariables(variables) {
    if (typeof variables === "string" || variables instanceof String) {
      this.variables = variables;
    }
  }
  addVariables(name, value) {
    if (typeof name === "string" || name instanceof String) {
      this.variables[name] = value;
    }
  }
  getWorkflowAttributes() {
    return this.workflowAttributes;
  }
  setWorkflowAttributes(workflowAttributes) {
    if (typeof workflowAttributes === "object" && workflowAttributes !== null) {
      this.workflowAttributes = workflowAttributes;
    }
  }
  getResourceRequest() {
    return this.resourceRequest;
  }
  setResourceRequest(resourceRequest) {
    if (typeof resourceRequest === "object" && resourceRequest !== null) {
      this.resourceRequest = resourceRequest;
    }
  }
  getResourceManager() {
    return this.resourceManager;
  }
  setResourceManager(resourceManager) {
    if (typeof resourceManager === "object" && resourceManager !== null) {
      this.resourceManager = resourceManager;
    }
  }
  setName(name) {
    this.signature.name = name;
  }
  getName() {
    return this.signature.name;
  }
  setDescription(description) {
    this.signature.description = description;
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
  addRestartHookOn() {
    this.workflowAttributes.restartHookOn.push("");
  }
  removeRestartHookOn(index) {
    this.workflowAttributes.restartHookOn.splice(index, 1);
  }
  addShutdownOn() {
    this.workflowAttributes.shutdownOn.push("");
  }
  removeShutdownOn(index) {
    this.workflowAttributes.shutdownOn.splice(index, 1);
  }
}
