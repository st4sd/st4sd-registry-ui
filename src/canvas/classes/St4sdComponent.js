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
    restartHookOn: [],
    repeatInterval: "",
    repeatRetries: "",
    maxRestarts: "",
    shutdownOn: [],
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
      statusRequestInterval: "",
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
  }
  getCommand() {
    return this.command;
  }
  setCommand(command) {
    if (typeof command === "object" && command !== null) {
      if (command.executable) {
        this.command.executable = command.executable;
      }
      if (command.arguments) {
        this.command.arguments = command.arguments;
      }
      if (command.expandArguments) {
        this.command.expandArguments = command.expandArguments;
      }
      if (command.environment) {
        this.command.environment = command.environment;
      }
    }
  }
  getVariables() {
    return this.variables;
  }
  setVariables(variables) {
    if (typeof variables === "object" && variables !== null) {
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
      if (workflowAttributes.replicate) {
        this.workflowAttributes.replicate = workflowAttributes.replicate;
      }
      if (workflowAttributes.aggregate) {
        this.workflowAttributes.aggregate = workflowAttributes.aggregate;
      }
      if (workflowAttributes.restartHookFile) {
        this.workflowAttributes.restartHookFile =
          workflowAttributes.restartHookFile;
      }
      if (
        workflowAttributes.restartHookOn &&
        Array.isArray(workflowAttributes.restartHookOn)
      ) {
        this.workflowAttributes.restartHookOn =
          workflowAttributes.restartHookOn;
      }
      if (workflowAttributes.repeatInterval) {
        this.workflowAttributes.repeatInterval =
          workflowAttributes.repeatInterval;
      }
      if (workflowAttributes.repeatRetries) {
        this.workflowAttributes.repeatRetries =
          workflowAttributes.repeatRetries;
      }
      if (workflowAttributes.maxRestarts) {
        this.workflowAttributes.maxRestarts = workflowAttributes.maxRestarts;
      }
      if (
        workflowAttributes.shutdownOn &&
        Array.isArray(workflowAttributes.shutdownOn)
      ) {
        this.workflowAttributes.shutdownOn = workflowAttributes.shutdownOn;
      }
    }
  }
  getResourceRequest() {
    return this.resourceRequest;
  }
  setResourceRequest(resourceRequest) {
    if (typeof resourceRequest === "object" && resourceRequest !== null) {
      if (resourceRequest.numberProcesses) {
        this.resourceRequest.numberProcesses = resourceRequest.numberProcesses;
      }
      if (resourceRequest.numberThreads) {
        this.resourceRequest.numberThreads = resourceRequest.numberThreads;
      }
      if (resourceRequest.ranksPerNode) {
        this.resourceRequest.ranksPerNode = resourceRequest.ranksPerNode;
      }
      if (resourceRequest.threadsPerCore) {
        this.resourceRequest.threadsPerCore = resourceRequest.threadsPerCore;
      }
      if (resourceRequest.memory) {
        this.resourceRequest.memory = resourceRequest.memory;
      }
      if (resourceRequest.gpus) {
        this.resourceRequest.gpus = resourceRequest.gpus;
      }
    }
  }
  getResourceManager() {
    return this.resourceManager;
  }
  setResourceManager(resourceManager) {
    if (typeof resourceManager === "object" && resourceManager !== null) {
      if (
        resourceManager.config &&
        typeof resourceManager.config === "object" &&
        resourceManager.config !== null
      ) {
        if (resourceManager.config.backend) {
          this.resourceManager.config.backend = resourceManager.config.backend;
        }
        if (resourceManager.config.walltime) {
          this.resourceManager.config.walltime =
            resourceManager.config.walltime;
        }
      }
      if (
        resourceManager.lsf &&
        typeof resourceManager.lsf === "object" &&
        resourceManager.lsf !== null
      ) {
        if (resourceManager.lsf.statusRequestInterval) {
          this.resourceManager.lsf.statusRequestInterval =
            resourceManager.lsf.statusRequestInterval;
        }
        if (resourceManager.lsf.queue) {
          this.resourceManager.lsf.queue = resourceManager.lsf.queue;
        }
        if (resourceManager.lsf.reservation) {
          this.resourceManager.lsf.reservation =
            resourceManager.lsf.reservation;
        }
        if (resourceManager.lsf.resourceString) {
          this.resourceManager.lsf.resourceString =
            resourceManager.lsf.resourceString;
        }
        if (resourceManager.lsf.dockerImage) {
          this.resourceManager.lsf.dockerImage =
            resourceManager.lsf.dockerImage;
        }
        if (resourceManager.lsf.dockerProfileApp) {
          this.resourceManager.lsf.dockerProfileApp =
            resourceManager.lsf.dockerProfileApp;
        }
        if (resourceManager.lsf.dockerOption) {
          this.resourceManager.lsf.dockerOption =
            resourceManager.lsf.dockerOption;
        }
      }
      if (
        resourceManager.kubernetes &&
        typeof resourceManager.kubernetes === "object" &&
        resourceManager.kubernetes !== null
      ) {
        if (resourceManager.kubernetes.image) {
          this.resourceManager.kubernetes.image =
            resourceManager.kubernetes.image;
        }
        if (resourceManager.kubernetes.imagePullSecret) {
          this.resourceManager.kubernetes.imagePullSecret =
            resourceManager.kubernetes.imagePullSecret;
        }
        if (resourceManager.kubernetes.gracePeriod) {
          this.resourceManager.kubernetes.gracePeriod =
            resourceManager.kubernetes.gracePeriod;
        }
        if (resourceManager.kubernetes.podSpec) {
          this.resourceManager.kubernetes.podSpec =
            resourceManager.kubernetes.podSpec;
        }
        if (resourceManager.kubernetes.apiKeyVar) {
          this.resourceManager.kubernetes.apiKeyVar =
            resourceManager.kubernetes.apiKeyVar;
        }
        if (resourceManager.kubernetes.host) {
          this.resourceManager.kubernetes.host =
            resourceManager.kubernetes.host;
        }
        if (resourceManager.kubernetes.namespace) {
          this.resourceManager.kubernetes.namespace =
            resourceManager.kubernetes.namespace;
        }
        if (resourceManager.kubernetes.cpuUnitsPerCore) {
          this.resourceManager.kubernetes.cpuUnitsPerCore =
            resourceManager.kubernetes.cpuUnitsPerCore;
        }
      }
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
  getParameters() {
    return this.signature.parameters;
  }
  setParameterName(index, parameterName) {
    this.signature.parameters[index].name = parameterName;
  }
  setParameterDefault(index, parameterDefault) {
    this.signature.parameters[index].default = parameterDefault;
  }
  setParameters(parameters) {
    if (Array.isArray(parameters)) {
      parameters.forEach((parameter) => {
        if (parameter.name.trim() != "") {
          this.signature.parameters.push({ ...parameter });
        }
      });
    }
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
