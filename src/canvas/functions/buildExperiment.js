import getDSLComponentDefinition from "@/canvas/functions/removeEmptyValues";

export default function buildExperiment(nodes, edges, entryNode) {
  let workflows = nodes.filter((node) => node.type == "workflow");

  let components = nodes.filter((node) => node.type == "component");

  let result = {};
  if (entryNode != undefined) {
    result = {
      entrypoint: {
        "entry-instance": entryNode.label,
        execute: [
          {
            target: "<entry-instance>",
            args: {},
          },
        ],
      },
      workflows: [],
      components: [],
    };
    //initialiseEntrypoint(result, nodes);
    workflows.forEach((workflow) => {
      //before adding the workflows to the experiment dsl, the definition needs
      //to be updated to reflect the edges
      //information in edges will form the execute part of a workflow definition
      createExecutionConfig(workflow, nodes, edges);
      result.workflows.push(workflow.definition);
    });
    //Component
    components.forEach((component) => {
      let defintion = getDSLComponentDefinition(component.definition);
      result.components.push(defintion);
    });
  }

  return result;
}

//To be revised now that how we handle experiment inputs have changed
// function initialiseEntrypoint(result, nodes) {
//   let inputs = nodes.filter((node) => node.type === "input");
//   if (inputs != undefined) {
//     for (var input in inputs) {
//       result.entrypoint.execute[0].args[inputs[input].label] =
//         inputs[input].definition;
//     }
//   }
//   return result;
// }

function createExecutionConfig(workflow, nodes, edges) {
  let newExecute = [];
  workflow.stepReference = "";
  setStepReferences(workflow, workflow.stepReference, nodes);
  let workflowStepsNodes = nodes.filter(
    (node) => node.parentNode == workflow.id && node.type != "workflow-input",
  );
  workflowStepsNodes.forEach((stepNode) => {
    let execution = {
      target: `<${stepNode.stepId}>`,
      args: {},
    };
    let incomingEdges = edges.filter((edge) => edge.target == stepNode.id);
    incomingEdges.forEach((edge) => {
      //To account for nodes coming into the canvas using the
      //export to build canvas button on the view canvas
      //Will be removed once that function is finalised
      if (edge.sourceNode.id.includes("dnd")) {
        Object.keys(edge.definition).forEach((argument) => {
          if (edge.sourceNode.stepId == "") {
            execution.args[argument] = edge.definition[argument];
          } else {
            //adding .toString() to account for any non string values like numbers
            execution.args[argument] = edge.definition[argument]
              .toString()
              .replace(edge.source, edge.sourceNode.stepReference);
          }
        });
      } else {
        Object.keys(edge.definition).forEach((argument) => {
          //adding .toString() to account for any non string values like numbers
          execution.args[argument] = edge.definition[argument]
            .toString()
            .replace(edge.sourceNode.id, edge.sourceNode.stepReference);
        });
      }
    });
    newExecute.push(execution);
  });
  workflow.definition.execute = newExecute;
}

function setStepReferences(workflow, stepReference, nodes) {
  let workflowStepsNodes = nodes.filter(
    (node) => node.parentNode == workflow.id && node.type != "workflow-input",
  );
  workflowStepsNodes.forEach((node) => {
    if (stepReference == "") {
      node.stepReference = node.stepId;
    } else {
      node.stepReference = `${stepReference}.${node.stepId}`;
    }
    if (node.type == "workflow") {
      setStepReferences(node, node.stepReference, nodes);
    }
  });
}
