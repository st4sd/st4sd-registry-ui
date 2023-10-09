import { createWorkflowDAG } from "@/canvas/functions/createDAG";
import { MarkerType } from "@vue-flow/core";
import { ref } from "vue";

//This function will make sure the canvas always starts with 3 input Nodes
//The nodes will be hidden by default and can be accessed/updated using
//the "config experiment" button
export function setUpCanvas(graph) {
  //Make sure the graph exists
  if (graph != undefined) {
    //If canvas nodes do not exist or the canvas has no nodes we initilise it
    if (graph.nodes == undefined || graph.nodes.length == 0) {
      graph.nodes = [];
      addExecutionOptionsInputNode(graph);
      addPresetsInputNode(graph);
      addOtherInputNode(graph);
    }
    //Otherwise we check if any of the 3 input nodes exist and add in the rest
    else {
      //look if any exist if not add it
      let match = graph.nodes.find((a) => a.id == "executionOptions");
      if (match == undefined) {
        addExecutionOptionsInputNode(graph);
      }
      match = graph.nodes.find((a) => a.id == "presets");
      if (match == undefined) {
        addPresetsInputNode(graph);
      }
      match = graph.nodes.find((a) => a.id == "other");
      if (match == undefined) {
        addOtherInputNode(graph);
      }
    }
  }
  return graph;
}

//Adds Execution Options input node to the graph
function addExecutionOptionsInputNode(graph) {
  return graph.nodes.push({
    id: "executionOptions",
    label: "Execution options",
    definition: {},
    parentNode: "",
    type: "input",
    hidden: true,
    style: {
      borderColor: "green",
    },
    position: { x: 0, y: 0 },
    width: "executionOptions".length * 11,
  });
}

//Adds Presets input node to the graph
function addPresetsInputNode(graph) {
  return graph.nodes.push({
    id: "presets",
    label: "Presets",
    definition: {},
    parentNode: "",
    type: "input",
    hidden: true,
    style: {
      borderColor: "red",
    },
    position: { x: 200, y: 0 },
    width: "presets".length * 11,
  });
}

//Adds "Other" input node to the graph
function addOtherInputNode(graph) {
  return graph.nodes.push({
    id: "other",
    label: "Other",
    definition: {},
    parentNode: "",
    type: "input",
    hidden: true,
    style: {
      borderColor: "grey",
    },
    position: { x: 290, y: 0 },
    width: "other".length * 11,
  });
}

//Used in createWorkflowModal
//This function takes the details collected from the modal and creates a workflow node
export function createWorkflowNode(
  workflowName,
  workflowDescription,
  parameters,
) {
  //We calculate the workflow's width based on it's name so we are sure the name/label doesn't overflow
  let workflowWidth = `${workflowName} inputs`.length * 11;
  //Create the workflow node
  let workflowNode = {
    id: "",
    label: workflowName,
    type: "workflow",
    definition: {
      signature: {
        name: workflowName,
        description: workflowDescription,
        parameters: [],
      },
      steps: {},
      execute: [{}],
    },
    style: {
      backgroundColor: "rgba(16, 185, 129, 0.5)",
      width: workflowWidth + "px",
      height: "100px",
    },
    position: {
      x: 300,
      y: 300,
    },
  };
  //Create the workflow input node (the type is param and not input)
  var inputNode = {
    id: "",
    label: `${workflowName} inputs`,
    type: "workflow-input",
    parentNode: "",
    position: {
      x: 30,
      y: 50,
    },
  };
  //add the workflow parameters to the node definition
  for (var parameter of parameters) {
    if (parameter.name != "") {
      workflowNode.definition.signature.parameters.push(parameter);
    }
  }
  return { workflowNode, inputNode };
}

//This functions takes the newly created workflow node and adds it to canvas
export function addWorkflowNode(
  workflow,
  input,
  workflowDimensions,
  getId,
  addNodes,
) {
  //Changes the nodes ids to match the canvas system of ids
  workflow.id = getId();
  input.id = getId();
  input.parentNode = workflow.id;
  addNodes([workflow, input]);
  //add details to the array used for the collapse/expand feature of a workflow
  workflowDimensions[workflow.id] = {
    width: workflow.style.width,
    height: workflow.style.height,
  };
}

//This functions takes a workflow node and using that node's definition and dependancies
//creates an experiment dsl from it and passes it to createWorkflowDAG (in createDAG.js) function
//to convert it to a graph/DAG to be used in the canvas
export function addWorkflowNodesToCanvas(
  workflowNode,
  workflowDimensions,
  getId,
  addNodes,
  addEdges,
) {
  const idsDict = ref({});
  //Create an experiment definition to pass it to createWorkflowDAG function
  let WFexp = {
    entrypoint: {
      "entry-instance": workflowNode.label,
      execute: [
        {
          target: "<entry-instance>",
          args: {},
        },
      ],
    },
    workflows: workflowNode.dependencies.workflows,
    components: workflowNode.dependencies.components,
  };
  //add the workflow definition to the relevant part of the experiment
  WFexp.workflows.push(workflowNode.definition);
  //get DAG
  let experimentGraph = createWorkflowDAG(WFexp);
  //get the workflow node from the resulted DAG
  let entryNode = experimentGraph.nodes.find(
    (node) => node.id == workflowNode.label,
  );
  //replace IDs to the canvas ID system
  idsDict[entryNode.id] = workflowNode.id;
  workflowNode.definition = entryNode.definition;
  workflowNode.style = { ...entryNode.style };
  addNodes([workflowNode]);
  for (var experimentNode of experimentGraph.nodes) {
    if (experimentNode.id != entryNode.id) {
      let ID = getId();
      idsDict[experimentNode.id] = ID;
      experimentNode.id = ID;
      experimentNode.parentNode = idsDict[experimentNode.parentNode];
      addNodes([experimentNode]);
      if (experimentNode.type == "workflow") {
        workflowDimensions[experimentNode.id] = {
          width: experimentNode.style.width,
          height: experimentNode.style.height,
        };
      }
    }
  }
  for (var experimentEdge of experimentGraph.edges) {
    experimentEdge.source = idsDict[experimentEdge.source];
    experimentEdge.target = idsDict[experimentEdge.target];
    experimentEdge.id = experimentEdge.id + "[" + getId() + "]";
    //fix the edges
    let edgeSourceNode = experimentGraph.nodes.find(
      (node) => node.id == experimentEdge.source,
    );
    if (edgeSourceNode.type != "workflow-input") {
      Object.keys(experimentEdge.definition).forEach((argument) => {
        let sourceReference = experimentEdge.definition[argument]
          .split(">:")[0]
          .split("<")[1]
          .split("/")[0];
        experimentEdge.definition[argument] = experimentEdge.definition[
          argument
        ].replace(sourceReference, experimentEdge.source);
      });
    }
    addEdges([experimentEdge]);
  }
  //add to the array used for the collapse/expand functionality
  workflowDimensions[workflowNode.id] = {
    width: workflowNode.style.width,
    height: workflowNode.style.height,
  };
}

//This functions checks if an attempt to connect two nodes in valid
//according to experiment DSL rules
export function isConnectionValid(newEdge, findNode) {
  let sourceNode = findNode(newEdge.source);
  let targetNode = findNode(newEdge.target);
  //Check if both nodes have a parent node (which is a workflow)
  if (sourceNode.parentNode && targetNode.parentNode) {
    //If the source node is a workflow input node
    //the source and target nodes has to have the same parent node
    if (
      sourceNode.type == "workflow-input" &&
      sourceNode.parentNode != targetNode.parentNode
    ) {
      alert("Please only connect a direct child to the inputs of a workflow");
    }
    //Check if the source and target nodes belong to one workflow at any level
    //as a direct parent or grandparent node or higher
    //if not, show alert
    else if (!doesShareParent(sourceNode, targetNode, findNode)) {
      alert("Both source and target have to share a Workflow");
    } else {
      newEdge.markerEnd = MarkerType.ArrowClosed;
      return true;
    }
  } else {
    alert(
      "Please make sure the target and source are inside a workflow as steps",
    );
  }
}

//This function checks if node1 and node2 share any parent
//meaning: if they both belong to the one workflow (at any level)
function doesShareParent(node1, node2, findNode) {
  let node1Parents = [];
  //set the starting node
  let loopNode = { ...node1 };
  let areSharing = false;

  //get a list of all node1 parents
  while (!(loopNode.parentNode == undefined || loopNode.parentNode == "")) {
    node1Parents.push(loopNode.parentNode);
    let parentNode = findNode(loopNode.parentNode);
    loopNode = { ...parentNode };
  }

  //change the loopNode to node2
  loopNode = { ...node2 };
  //loop through node2 parents and test if any of them are included
  //in node1 parents
  while (!(loopNode.parentNode == undefined || loopNode.parentNode == "")) {
    if (node1Parents.includes(loopNode.parentNode)) {
      //if included stop the loop and returns true
      areSharing = true;
      break;
    } else {
      //otherwise keep looping
      let parentNode = findNode(loopNode.parentNode);
      loopNode = { ...parentNode };
    }
  }
  return areSharing;
}
