import { MarkerType } from "@vue-flow/core";
import { drawGraph } from "./drawGraph";

//To store the number of inputs of the entry workflow
//has to be a global variable as it's used to track how many
//inputs has been added/drawn and calculate position of the
//other input nodes based on that
let inputCounter;
export async function createDAG(Api) {
  let graph = {
    nodes: [],
    edges: [],
    elevateEdgesOnSelect: true,
  };
  //API call and response
  const response = await fetch(Api);
  var res = await response.json();

  if (res != null) {
    const data = res;
    //Check if the entry point section exists in the file
    //If it doesn't  exist - it means this file is not an experiment
    //and just a collection of workflows and components
    if (data["entrypoint"] != undefined) {
      //Add the inputs and entry point workframe
      inputCounter = 0;
      let entryWorkflow = addEntries(graph, data);
      let entryWorkflowName = entryWorkflow.signature.name;
      //add all workflows/components inside the entry workflow
      addBlocks(graph, data, entryWorkflow, entryWorkflowName, "");
      //add edges/connections between the blocks
      addConnection(graph, data, entryWorkflow, entryWorkflowName);
      graph = { ...drawGraph(graph) };
    }
  }
  return graph;
}

function addEntries(graph, data) {
  //Get the name of the entry Workflow
  let entryWorkflowName = data["entrypoint"]["entry-instance"];
  //get the definition of the entry workflow
  let entryWorkflow = data.workflows.find(
    (o) => o.signature.name === entryWorkflowName
  );
  //add the inputs of that workflow
  let inputs = data["entrypoint"]["execute"][0].args;
  for (var input in inputs) {
    let nodeDefinition = inputs[input];
    let edgeDefinition = {};
    edgeDefinition[input] = inputs[input];
    addNode(graph, input, input, nodeDefinition, "", "input", "");
    addEdge(graph, input, entryWorkflowName, input, edgeDefinition);
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
      backgroundColor: "rgba(16, 185, 129, 0.5)",
      width: entryWorkflowName.length * 11 + "px",
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
    "param",
    ""
  );
  return entryWorkflow;
}

//This function adds nodes to DAG based on the steps of a given workflow
function addBlocks(graph, data, workflow, prevStepId, stepParent) {
  let workflowSteps = workflow.steps;
  for (var step in workflowSteps) {
    let stepWorkflow = data.workflows.find(
      (o) => o.signature.name === workflowSteps[step]
    );
    let stepId;
    if (stepParent == "") {
      stepId = step;
    } else {
      stepId = `${stepParent}.${step}`;
    }
    let id = `${prevStepId}.${step}`;

    //if the step is a workflow
    if (stepWorkflow != undefined) {
      addNode(
        graph,
        id,
        workflowSteps[step],
        workflow,
        prevStepId,
        "workflow",
        stepId
      );
      addNode(
        graph,
        `${id}/input`,
        `${workflowSteps[step]} inputs`,
        `${id}/input`,
        id,
        "param",
        ""
      );
      //draw the blocks inside that workflow
      addBlocks(graph, data, stepWorkflow, id, stepId);
    } else {
      let componentDefinition = data.components.find(
        (o) => o.signature.name === workflowSteps[step]
      );
      addNode(
        graph,
        id,
        workflowSteps[step],
        componentDefinition,
        prevStepId,
        "",
        stepId
      );
    }
  }
}

//This function adds edges to the DAG based on the execute part of a given workflow
function addConnection(graph, data, workflow, workflowName) {
  let workflowExecution = workflow.execute;
  for (var step in workflowExecution) {
    let args = workflowExecution[step].args;
    let targetStep = workflowExecution[step].target
      .replace("<", "")
      .replace(">", "");
    let target = `${workflowName}.${targetStep}`;
    for (var arg in args) {
      let fullSourcePath = args[arg];
      let edgeDefinition = { arg: args[arg] };
      let fullSource = removeSymbolCharacters(fullSourcePath);
      let source = workflowName;
      // if the arg is in the form of %() then it is referencing a parameter input
      if (fullSourcePath.includes("%")) {
        source = `${workflowName}/input`;
      }
      //if it's in the form on <> then its referencing a step or a step inside step .. etc
      else if (fullSourcePath.includes("<")) {
        source = `${workflowName}.${fullSource}`;
      }
      // otherwise it's a static input and not referencing anything
      else {
        addNode(
          graph,
          `${workflowName}.${arg}`,
          arg,
          edgeDefinition,
          source,
          "param",
          ""
        );
        source = `${workflowName}.${arg}`;
      }
      addEdge(graph, source, target, arg, edgeDefinition);
    }
    //CHECK IF THE STEP IS REFERENCING A WORKFLOW
    //IF IT IS A WORKFLOW - DRAW ITS CONNECTIONS.
    let innerWorkflow = data.workflows.find(
      (o) => o.signature.name === workflow.steps[targetStep]
    );
    if (innerWorkflow != undefined) {
      addConnection(graph, data, innerWorkflow, target);
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
  };

  if (parent != "") {
    node.expandParent = true;
  }

  if (type == "workflow") {
    node.position = { x: 1, y: 100 };
    node.style = {
      backgroundColor: "rgba(16, 185, 129, 0.5)",
      width: label.length * 11 + "px",
      height: "1px",
    };
  } else {
    let X = 10;
    let Y = 1;
    if (type == "input") {
      X = inputCounter * 200;
      inputCounter = inputCounter + 1;
    } else if (type == "param") {
      Y = 40;
    }
    node.position = { x: X, y: Y };
    node.width = label.length * 11;
  }
  graph.nodes.push(node);
}

function addEdge(graph, source, target, label, definition) {
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
  } else {
    let argName = Object.keys(definition)[0];
    var edge = {
      id: `edge:${source}>${target}::${label}`,
      source: source,
      target: target,
      argName: [argName],
      definition: {},
      markerEnd: MarkerType.ArrowClosed,
    };
    edge.definition[argName] = definition[argName];
    graph.edges.push(edge);
  }
}

function removeSymbolCharacters(stringWithSymbols) {
  let cleanedString = "";
  if (stringWithSymbols.includes("%")) {
    cleanedString = stringWithSymbols.substring(
      2,
      stringWithSymbols.length - 2
    );
  } else if (stringWithSymbols.includes("<")) {
    cleanedString = stringWithSymbols.split("<")[1].split(">")[0].split("/")[0];
  } else {
    cleanedString = stringWithSymbols;
  }
  return cleanedString;
}
