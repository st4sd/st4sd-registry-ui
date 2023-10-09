export const validateCommand = (node) => {
  let nodeCommand = {};
  if (node.definition.command != undefined) {
    nodeCommand = {
      executable:
        node.definition.command.executable == undefined
          ? ""
          : node.definition.command.executable,
      arguments:
        node.definition.command.arguments == undefined
          ? ""
          : node.definition.command.arguments,
      expandArgument:
        node.definition.command.expandArgument == undefined
          ? ""
          : node.definition.command.expandArgument,
      environment:
        node.definition.command.environment == undefined
          ? ""
          : node.definition.command.environment,
    };
  } else {
    nodeCommand = {
      executable: "",
      arguments: "",
      expandArgument: "",
      environment: "",
    };
  }
  return nodeCommand;
};

export const validateStage = (node) => {
  let nodeStage = "";
  if (node.definition.stage != undefined) {
    nodeStage = node.definition.stage;
  }
  return nodeStage;
};

export const validateVariables = (node) => {
  let nodeVariables = "";
  if (node.definition.variables != undefined) {
    nodeVariables = node.definition.variables;
  }
  return nodeVariables;
};

export const validateReferences = (node) => {
  let nodeReferences = [""];
  if (node.definition.references != undefined) {
    nodeReferences = node.definition.references;
  }
  return nodeReferences;
};

export const validateWorkflowAttributes = (node) => {
  let nodeWorkflowAttributes = {};
  if (typeof node.definition.workflowAttributes !== "undefined") {
    nodeWorkflowAttributes = {
      replicate:
        node.definition.workflowAttributes.replicate == undefined
          ? ""
          : node.definition.workflowAttributes.replicate,
      aggregate:
        node.definition.workflowAttributes.aggregate == undefined
          ? ""
          : node.definition.workflowAttributes.aggregate,
      restartHookFile:
        node.definition.workflowAttributes.restartHookFile == undefined
          ? ""
          : node.definition.workflowAttributes.restartHookFile,
      restartHookOn:
        node.definition.workflowAttributes.restartHookOn == undefined
          ? ["ResourceExhausted"]
          : node.definition.workflowAttributes.restartHookOn,
      repeatInterval:
        node.definition.workflowAttributes.repeatInterval == undefined
          ? ""
          : node.definition.workflowAttributes.repeatInterval,
      repeatRetries:
        node.definition.workflowAttributes.repeatRetries == undefined
          ? ""
          : node.definition.workflowAttributes.repeatRetries,
      maxRestarts:
        node.definition.workflowAttributes.maxRestarts == undefined
          ? ""
          : node.definition.workflowAttributes.maxRestarts,
      shutdownOn:
        node.definition.workflowAttributes.shutdownOn == undefined
          ? [""]
          : node.definition.workflowAttributes.shutdownOn,
    };
  } else {
    nodeWorkflowAttributes = {
      replicate: "",
      aggregate: true,
      restartHookFile: "",
      restartHookOn: ["ResourceExhausted"],
      repeatInterval: "",
      repeatRetries: "",
      maxRestarts: "",
      shutdownOn: [""],
    };
  }
  return nodeWorkflowAttributes;
};

export const validateConfig = (node) => {
  let nodeConfig = {};
  if (typeof node.definition.resourceManager === "undefined") {
    nodeConfig = { backend: "", walltime: "" };
  } else {
    if (typeof node.definition.resourceManager.config !== "undefined") {
      Object.defineProperties(nodeConfig, {
        backend: {
          value:
            node.definition.resourceManager.config.backend == undefined
              ? ""
              : node.definition.resourceManager.config.backend,
        },
        walltime: {
          value:
            node.definition.resourceManager.config.walltime == undefined
              ? ""
              : node.definition.resourceManager.config.walltime,
        },
      });
    } else {
      nodeConfig = { backend: "", walltime: "" };
    }
  }
  return nodeConfig;
};

export const validateLsf = (node) => {
  let nodeLsf = {};
  if (typeof node.definition.resourceManager === "undefined") {
    nodeLsf = {
      statusRequestInterval: "20",
      queue: "",
      reservation: "",
      resourceString: "",
      dockerImage: "",
      dockerProfileApp: "",
      dockerOption: "",
    };
  } else {
    if (typeof node.definition.resourceManager.lsf !== "undefined") {
      Object.defineProperties(nodeLsf, {
        statusRequestInterval: {
          value: node.definition.resourceManager.lsf.statusRequestInterval,
        },
        queue: { value: node.definition.resourceManager.lsf.queue },
        reservation: {
          value: node.definition.resourceManager.lsf.reservation,
        },
        resourceString: {
          value: node.definition.resourceManager.lsf.resourceString,
        },
        dockerImage: {
          value: node.definition.resourceManager.lsf.dockerImage,
        },
        dockerProfileApp: {
          value: node.definition.resourceManager.lsf.dockerProfileApp,
        },
        dockerOption: {
          value: node.definition.resourceManager.lsf.dockerOption,
        },
      });
    } else {
      nodeLsf = {
        statusRequestInterval: "20",
        queue: "",
        reservation: "",
        resourceString: "",
        dockerImage: "",
        dockerProfileApp: "",
        dockerOption: "",
      };
    }
  }
  return nodeLsf;
};

export const validateKubernetes = (node) => {
  let nodeKubernetes = {};
  if (typeof node.definition.resourceManager === "undefined") {
    nodeKubernetes = {
      image: "",
      imagePullSecret: "",
      gracePeriod: "",
      podSpec: "",
      apiKeyVar: "",
      host: "",
      namespace: "",
      cpuUnitsPerCore: "",
    };
  } else {
    if (typeof node.definition.resourceManager.kubernetes !== "undefined") {
      Object.defineProperties(nodeKubernetes, {
        image: {
          value: node.definition.resourceManager.kubernetes.image,
        },
        imagePullSecret: {
          value: node.definition.resourceManager.kubernetes.imagePullSecret,
        },
        gracePeriod: {
          value: node.definition.resourceManager.kubernetes.gracePeriod,
        },
        podSpec: {
          value: node.definition.resourceManager.kubernetes.podSpec,
        },
        apiKeyVar: {
          value: node.definition.resourceManager.kubernetes.apiKeyVar,
        },
        host: {
          value: node.definition.resourceManager.kubernetes.host,
        },
        namespace: {
          value: node.definition.resourceManager.kubernetes.namespace,
        },
        cpuUnitsPerCore: {
          value: node.definition.resourceManager.kubernetes.cpuUnitsPerCore,
        },
      });
    } else {
      nodeKubernetes = {
        image: "",
        imagePullSecret: "",
        gracePeriod: "",
        podSpec: "",
        apiKeyVar: "",
        host: "",
        namespace: "",
        cpuUnitsPerCore: "",
      };
    }
  }
  return nodeKubernetes;
};

export const validateResourceRequest = (node) => {
  let nodeResourceRequest = {};
  if (node.definition.resourceRequest != undefined) {
    nodeResourceRequest = {
      numberProcesses: node.definition.resourceRequest.numberProcesses,
      numberThreads: node.definition.resourceRequest.numberThreads,
      ranksPerNode: node.definition.resourceRequest.ranksPerNode,
      threadsPerCore: node.definition.resourceRequest.threadsPerCore,
      memory: node.definition.resourceRequest.memory,
      gpus: node.definition.resourceRequest.gpus,
    };
  } else {
    nodeResourceRequest = {
      numberProcesses: "",
      numberThreads: "",
      ranksPerNode: "",
      threadsPerCore: "",
      memory: "",
      gpus: "",
    };
  }
  return nodeResourceRequest;
};

export const validateSignature = (node) => {
  let nodeSignature = {};
  if (node.definition.signature != undefined) {
    nodeSignature = {
      name: node.definition.signature.name,
      description: node.definition.signature.description,
      parameters: node.definition.signature.parameters,
    };
  } else {
    nodeSignature = {
      name: "",
      description: "",
      parameters: [{ name: "", default: "" }],
    };
  }
  return nodeSignature;
};
