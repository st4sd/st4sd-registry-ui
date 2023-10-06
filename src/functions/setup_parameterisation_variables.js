export function setVariables(pvep) {
  let presetsVariables = [];
  let executionOptionsVariables = [];
  let defaultVariables = [];
  pvep.parameterisation.presets.variables.forEach((variable) => {
    if (variable.value == undefined) {
      presetsVariables.push({
        name: variable.name,
        type: "presets",
      });
    } else {
      presetsVariables.push({
        name: variable.name,
        value: variable.value,
        type: "presets",
      });
    }
  });
  pvep.parameterisation.executionOptions.variables.forEach((variable) => {
    if (variable.value == undefined && variable.valueFrom == undefined) {
      // Execution option with 0 choices
      executionOptionsVariables.push({
        name: variable.name,
        value: "",
        type: "executionOptions",
      });
      variable.value = "";
    } else if (variable.valueFrom != undefined) {
      // Execution option with n choices
      executionOptionsVariables.push({
        name: variable.name,
        valueFrom: variable.valueFrom,
        type: "executionOptions",
      });
    } else {
      executionOptionsVariables.push({
        // Execution option with 1 choice
        name: variable.name,
        value: variable.value,
        type: "executionOptions",
      });
    }
  });
  let setVariables = presetsVariables.concat(executionOptionsVariables);
  let setVariableNames = setVariables.map((variable) => variable.name);
  let allVariableOptions =
    pvep.metadata.registry.executionOptionsDefaults.variables.map(
      (variable) => variable.name,
    );
  let defaultVariableNames = allVariableOptions.filter((variable) => {
    return setVariableNames.indexOf(variable) == -1;
  });
  defaultVariableNames.forEach((variable) =>
    defaultVariables.push({ name: variable, type: "default" }),
  );
  let variables = presetsVariables.concat(
    executionOptionsVariables,
    defaultVariables,
  );
  variables.sort(function (a, b) {
    return a.name[0].localeCompare(b.name[0]);
  });
  return variables;
}

export function setRuntimeArgs(pvep) {
  return pvep.parameterisation.presets.runtime.args.concat(
    pvep.parameterisation.executionOptions.runtime.args,
  );
}

export function setRuntimeArgsInvalid(runtimeArgs) {
  let runtimeArgsInvalid = [];
  runtimeArgs.forEach((arg) => {
    if (arg != "") {
      runtimeArgsInvalid.push(false);
    } else {
      runtimeArgsInvalid.push(true);
    }
  });
  return runtimeArgsInvalid;
}

export function setOrchestratorResources(pvep) {
  let orchestratorResources;
  if (
    pvep.parameterisation.presets.runtime.resources != undefined &&
    Object.keys(pvep.parameterisation.presets.runtime.resources).length != 0
  ) {
    orchestratorResources = pvep.parameterisation.presets.runtime.resources;
  } else if (
    pvep.parameterisation.executionOptions.runtime.resources != undefined &&
    Object.keys(pvep.parameterisation.executionOptions.runtime.resources)
      .length != 0
  ) {
    orchestratorResources =
      pvep.parameterisation.executionOptions.runtime.resources;
  } else {
    orchestratorResources = {};
  }
  return orchestratorResources;
}

export function setOrchestratorResourcesInvalid(orchestratorResources) {
  let orchestratorResourcesInvalid = [false, false];
  if (orchestratorResources.cpu == "") {
    orchestratorResourcesInvalid[0] = true;
  } else {
    orchestratorResourcesInvalid[0] = false;
  }
  if (orchestratorResources.memory == "") {
    orchestratorResourcesInvalid[1] = true;
  } else {
    orchestratorResourcesInvalid[1] = false;
  }
  return orchestratorResourcesInvalid;
}
