import { MarkerType } from "@vue-flow/core";
import { drawGraph } from "@/canvas/functions/drawGraph";
import { getTextWidth } from "@/canvas/functions/getTextWidth";

const executionOptionsNodeType = "input_ExecutionOptionsType";
const presetsNodeType = "input_PresetsType";
const otherNodeType = "input_OtherType";

export function createDAG(dslData, experimentData) {
  let graph = {
    nodes: [],
    edges: [],
    elevateEdgesOnSelect: true,
  };
  //Check if the entry point section exists in the file
  //If it doesn't  exist - it means this file is not an experiment
  //and just a collection of workflows and components
  if (dslData.entrypoint != undefined) {
    let entryWorkflow = addEntries(graph, dslData, experimentData);
    let entryWorkflowName = entryWorkflow.signature.name;
    //add all workflows/components inside the entry workflow
    addBlocks(graph, dslData, entryWorkflow, entryWorkflowName);
    //add edges/connections between the blocks
    addEdges(graph, dslData, entryWorkflow, entryWorkflowName);
    graph = { ...drawGraph(graph) };
  }

  return graph;
}

export function createWorkflowDAG(experimentData) {
  let graph = {
    nodes: [],
    edges: [],
    elevateEdgesOnSelect: true,
  };
  //Check if the entry point section exists in the file
  //If it doesn't  exist - it means this file is not an experiment
  //and just a collection of workflows and components
  if (
    experimentData.entrypoint != undefined &&
    experimentData["entrypoint"]["entry-instance"] != undefined
  ) {
    //get the definition of the entry workflow
    let entryWorkflow = experimentData.workflows.find(
      (o) =>
        o.signature.name === experimentData["entrypoint"]["entry-instance"],
    );
    if (entryWorkflow != undefined) {
      let entryWorkflowName = entryWorkflow.signature.name;

      var node = {
        id: entryWorkflowName,
        label: entryWorkflowName,
        type: "workflow",
        definition: entryWorkflow,
        parentNode: "",
        position: { x: 1, y: 100 },
        style: {
          width: getTextWidth(entryWorkflowName) + "px",
          height: "1px",
        },
        isEntry: true,
      };
      graph.nodes.push(node);
      let workflowInput = `${entryWorkflowName}/input`;
      addNode(
        graph,
        workflowInput,
        `${entryWorkflowName} inputs`,
        workflowInput,
        entryWorkflowName,
        "workflow-input",
        "",
      );
      //add all workflows/components inside the entry workflow
      addBlocks(graph, experimentData, entryWorkflow, entryWorkflowName);
      //add edges/connections between the blocks
      addEdges(graph, experimentData, entryWorkflow, entryWorkflowName);
      graph = { ...drawGraph(graph) };
    }
  }
  return graph;
}

function addEntries(graph, dslData, experimentData) {
  //Get the name of the entry Workflow
  let entryWorkflowName = dslData["entrypoint"]["entry-instance"];
  //get the definition of the entry workflow
  let entryWorkflow = dslData.workflows.find(
    (o) => o.signature.name === entryWorkflowName,
  );

  //Get the inputs of the entry workflow
  let entrypointArguments = {};
  if (
    dslData.entrypoint !== undefined &&
    dslData.entrypoint.execute !== undefined &&
    dslData.entrypoint.execute.length == 1 &&
    dslData.entrypoint.execute[0].args !== undefined
  ) {
    entrypointArguments = dslData.entrypoint.execute[0].args;
  }

  let inputs = [];
  if (
    entryWorkflow.signature.parameters !== undefined &&
    entryWorkflow.signature.parameters.length > 0
  ) {
    inputs = entryWorkflow.signature.parameters;
  }

  // According to https://github.ibm.com/st4sd/overview/issues/485#issuecomment-57924085:
  // executionOptions are contents of:
  // - parameterisation.executionOptions.variables
  // - parameterisation.executionOptions.data
  // - metadata.registry.inputs
  let executionOptions = [];
  if (experimentData.parameterisation.executionOptions.variables) {
    executionOptions.push(
      ...experimentData.parameterisation.executionOptions.variables,
    );
  }

  if (experimentData.parameterisation.executionOptions.data) {
    let executionOptionsData =
      experimentData.parameterisation.executionOptions.data;
    executionOptionsData.map((n) => {
      n.name = "data." + n.name;
    });
    executionOptions.push(...executionOptionsData);
  }
  if (experimentData.metadata.registry.inputs) {
    let metadataInputs = experimentData.metadata.registry.inputs;
    metadataInputs.map((n) => {
      n.name = "input." + n.name;
    });
    executionOptions.push(...metadataInputs);
  }
  // presets are contents of:
  // - parameterisation.presets.variables
  // - parameterisation.presets.data
  let presets = [];
  if (experimentData.parameterisation.presets.variables) {
    presets.push(...experimentData.parameterisation.presets.variables);
  }
  if (experimentData.parameterisation.presets.data) {
    let presetsData = experimentData.parameterisation.presets.data;
    presetsData.map((n) => {
      n.name = "data." + n.name;
    });
    presets.push(...presetsData);
  }

  //Start compiling the node definitions
  let executionOptionsDefinition = {};
  let presetsDefinition = {};
  let otherDefinition = {};
  for (var input of inputs) {
    if (input.name != undefined) {
      let defaultDefinition = entrypointArguments[input.name];
      let match = executionOptions.find((a) => a.name == input.name);
      if (
        defaultDefinition == undefined &&
        input.default != undefined &&
        input.default != null
      ) {
        defaultDefinition = input.default;
      }
      if (match != undefined) {
        let definition = getExecutionOptionsDefaults(
          defaultDefinition,
          input.name,
          experimentData,
          entryWorkflow,
        );
        executionOptionsDefinition[input.name] = definition;
        continue;
      }

      match = presets.find((a) => a.name == input.name);
      if (match != undefined || input.name.startsWith("data.")) {
        let definition = getPresetsDefaults(
          defaultDefinition,
          input.name,
          experimentData,
          entryWorkflow,
        );
        presetsDefinition[input.name] = definition;
      } else {
        otherDefinition[input.name] = defaultDefinition;
      }
    }
  }

  // Execution Options
  if (Object.keys(executionOptionsDefinition).length != 0) {
    executionOptionsDefinition = sortObjectKeys(executionOptionsDefinition);
    addNode(
      graph,
      "executionOptions",
      "Execution options",
      executionOptionsDefinition,
      "",
      executionOptionsNodeType,
      "",
    );
    addEdge(
      graph,
      "executionOptions",
      entryWorkflowName,
      "executionOptions",
      executionOptionsDefinition,
      {},
    );
  }

  //Presets
  if (Object.keys(presetsDefinition).length != 0) {
    presetsDefinition = sortObjectKeys(presetsDefinition);
    addNode(
      graph,
      "presets",
      "Presets",
      presetsDefinition,
      "",
      presetsNodeType,
      "",
    );
    addEdge(
      graph,
      "presets",
      entryWorkflowName,
      "presets",
      presetsDefinition,
      {},
    );
  }

  //Other Parameters
  if (Object.keys(otherDefinition).length != 0) {
    otherDefinition = sortObjectKeys(otherDefinition);
    addNode(graph, "other", "Other", otherDefinition, "", otherNodeType, "");
    addEdge(graph, "other", entryWorkflowName, "other", otherDefinition, {});
  }

  //after adding all inputs, we add the entry workflow
  var node = {
    id: entryWorkflowName,
    label: entryWorkflowName,
    type: "workflow",
    definition: entryWorkflow,
    parentNode: "",
    position: { x: 1, y: 100 },
    style: {
      width: getTextWidth(entryWorkflowName) + "px",
      height: "1px",
    },
    isEntry: true,
  };
  graph.nodes.push(node);
  let workflowInput = `${entryWorkflowName}/input`;
  addNode(
    graph,
    workflowInput,
    `${entryWorkflowName} inputs`,
    workflowInput,
    entryWorkflowName,
    "workflow-input",
    "",
  );
  return entryWorkflow;
}

//This function adds nodes to DAG based on the steps of a given workflow
function addBlocks(graph, data, workflow, prevStepId) {
  let workflowSteps = workflow.steps;
  for (var step in workflowSteps) {
    let stepWorkflow = data.workflows.find(
      (o) => o.signature.name === workflowSteps[step],
    );
    let stepId = step;
    let id = `${prevStepId}/${step}`;

    //if the step is a workflow
    if (stepWorkflow != undefined) {
      addNode(
        graph,
        id,
        workflowSteps[step],
        stepWorkflow,
        prevStepId,
        "workflow",
        stepId,
      );
      addNode(
        graph,
        `${id}/input`,
        `${workflowSteps[step]} inputs`,
        `${id}/input`,
        id,
        "workflow-input",
        "",
      );
      //draw the blocks inside that workflow
      addBlocks(graph, data, stepWorkflow, id);
    } else {
      let componentDefinition = data.components.find(
        (o) => o.signature.name === workflowSteps[step],
      );
      addNode(
        graph,
        id,
        workflowSteps[step],
        componentDefinition,
        prevStepId,
        "component",
        stepId,
      );
    }
  }
}

//This function adds edges to the DAG based on the execute part of a given workflow
function addEdges(graph, data, workflow, workflowName) {
  let workflowExecution = workflow.execute;
  let inputNodes = graph.nodes.filter((n) => n.type == "input");
  for (var step in workflowExecution) {
    let args = workflowExecution[step].args;
    let targetStep = workflowExecution[step].target
      .replace("<", "")
      .replace(">", "");
    let target = `${workflowName}/${targetStep}`;

    for (var arg in args) {
      let fullSourcePath = args[arg];
      fullSourcePath = fullSourcePath.toString();
      let edgeDefinition = { [arg]: args[arg] };
      let actualValue = {};
      let fullSource = removeSymbolCharacters(fullSourcePath);
      let source = workflowName;
      // if the arg is in the form of %() then it is referencing a parameter input
      if (fullSourcePath.includes("%")) {
        source = `${workflowName}/input`;
        let value = getEdgeParameterValueFromInputNodes(fullSource, inputNodes);
        if (value != undefined) {
          actualValue = { [arg]: value };
        }
        addEdge(graph, source, target, arg, edgeDefinition, actualValue);
      }
      //if it's in the form on <> then its referencing a step or a step inside step .. etc
      else if (fullSourcePath.includes("<")) {
        source = `${workflowName}/${fullSource}`;
        addEdge(graph, source, target, arg, edgeDefinition, actualValue);
      }
      // otherwise it's a static input and not referencing anything
      else {
        let targetNode = graph.nodes.find((n) => n.id == target);
        if (targetNode != undefined) {
          let targetParameter = targetNode.definition.signature.parameters.find(
            (parameter) => parameter.name == arg,
          );
          if (targetParameter != undefined) {
            targetParameter.default = args[arg];
          }
        }
      }
    }
    //CHECK IF THE STEP IS REFERENCING A WORKFLOW
    //IF IT IS A WORKFLOW - DRAW ITS CONNECTIONS/EDGES.
    let innerWorkflow = data.workflows.find(
      (o) => o.signature.name === workflow.steps[targetStep],
    );
    if (innerWorkflow != undefined) {
      addEdges(graph, data, innerWorkflow, target);
    }
  }
}

function addNode(graph, id, label, definition, parent, type, stepId) {
  var node = {
    id: id,
    label: label,
    type: type,
    definition: definition,
    parentNode: parent,
    stepId: stepId,
    isEntry: false,
  };

  if (parent != "") {
    node.expandParent = true;
  }

  if (type == "workflow") {
    node.label = stepId;
    node.position = { x: 1, y: 100 };
    node.style = {
      width: getTextWidth(label) + "px",
      height: "1px",
    };
  } else {
    let X = 10;
    let Y = 1;
    //Input styles
    if (type == executionOptionsNodeType) {
      node.type = "input";
      node.style = {
        borderColor: "green",
      };
      X = 0;
    } else if (type == presetsNodeType) {
      node.type = "input";
      node.style = {
        borderColor: "red",
      };
      node.hidden = true;
      X = 200;
    } else if (type == otherNodeType) {
      node.type = "input";
      node.style = {
        borderColor: "grey",
      };
      node.hidden = true;
      X = 290;
    } else if (type == "workflow-input") {
      Y = 40;
    } else if (type == "component") {
      node.label = stepId;
    }
    // end of styles
    node.position = { x: X, y: Y };
    node.width = getTextWidth(label);
  }
  graph.nodes.push(node);
}

function addEdge(graph, source, target, label, definition, actualValue) {
  //Check if there is already another edge that starts and ends at
  //the same points. if there is we just add on that same edge instead of drawing a new one
  //Drawing two edges starting and ending at the same point will not be visible enough for the users - they will only see one
  let path = String(`edge:${source}>${target}`);
  let siblingEdge = graph.edges.find((o) => String(o.id).includes(path));
  if (siblingEdge != undefined) {
    siblingEdge.id = siblingEdge.id + "&" + label;
    let argName = Object.keys(definition)[0];
    siblingEdge.argName.push(argName);
    siblingEdge.definition[argName] = definition[argName];
    if (siblingEdge.actualValue) {
      siblingEdge.actualValue[argName] = actualValue[argName];
    } else {
      siblingEdge.actualValue = actualValue;
    }
  } else {
    var edge = {
      id: `edge:${source}>${target}::${label}`,
      source: source,
      target: target,
      argName: [],
      definition: {},
      markerEnd: MarkerType.ArrowClosed,
    };
    if (Object.keys(definition).length > 1) {
      edge.argName = Object.keys(definition);
      edge.definition = definition;
    } else {
      edge.argName = [Object.keys(definition)[0]];
      edge.definition[edge.argName] = definition[edge.argName];
    }

    if (source == "executionOptions") {
      edge.style = { stroke: "green" };
    } else if (source == "presets") {
      edge.style = { stroke: "red" };
    } else if (source == "other") {
      edge.style = { stroke: "grey" };
    }

    if (Object.keys(actualValue).length > 0) {
      edge.actualValue = actualValue;
    }
    graph.edges.push(edge);
  }
}

export function removeSymbolCharacters(stringWithSymbols) {
  let cleanedString = "";
  if (stringWithSymbols.includes("%")) {
    if (
      stringWithSymbols.includes(":ref") ||
      stringWithSymbols.includes(":copy") ||
      stringWithSymbols.includes(":output") ||
      stringWithSymbols.includes(":link")
    ) {
      cleanedString = stringWithSymbols;
    } else {
      cleanedString = stringWithSymbols.substring(
        2,
        stringWithSymbols.length - 2,
      );
    }
  } else if (stringWithSymbols.includes("<")) {
    cleanedString = stringWithSymbols.split("<")[1].split(">")[0];
  } else {
    cleanedString = stringWithSymbols;
  }
  return cleanedString;
}

function getExecutionOptionsDefaults(
  defaultDefinition,
  input,
  inputClassificationData,
  entryWorkflow,
) {
  let definition = defaultDefinition;
  if (input.startsWith("data.") || input.startsWith("input.")) {
    return definition;
  } else {
    let variable =
      inputClassificationData.parameterisation.executionOptions.variables.find(
        (a) => a.name == input,
      );
    if (variable != undefined) {
      if (variable.value != "None") {
        definition = variable.value;
      }
      if (variable.valueFrom != undefined && variable.valueFrom.length > 0) {
        definition = variable.valueFrom[0].value;
      }
    }
  }
  if (definition == undefined) {
    let defaultValueFromDSL = entryWorkflow.signature.parameters.find(
      (p) => p.name == input,
    );
    if (defaultValueFromDSL != undefined) {
      definition = defaultValueFromDSL.default;
    }
  }
  return definition;
}

function getPresetsDefaults(
  defaultDefinition,
  input,
  inputClassificationData,
  entryWorkflow,
) {
  let definition = defaultDefinition;
  if (!input.startsWith("data.")) {
    definition =
      inputClassificationData.parameterisation.presets.variables.find(
        (a) => a.name == input,
      ).value;
  }
  if (definition == undefined) {
    let defaultValueFromDSL = entryWorkflow.signature.parameters.find(
      (p) => p.name == input,
    );
    if (defaultValueFromDSL != undefined) {
      definition = defaultValueFromDSL.default;
    }
  }
  return definition;
}

function getEdgeParameterValueFromInputNodes(parameterName, inputNodes) {
  for (var iNode of inputNodes) {
    if (parameterName in iNode.definition) {
      return iNode.definition[parameterName];
    }
  }
}

function sortObjectKeys(obj) {
  let sortedObject = {};
  Object.keys(obj)
    .sort()
    .forEach((item) => {
      sortedObject[item] = obj[item];
    });
  return sortedObject;
}
