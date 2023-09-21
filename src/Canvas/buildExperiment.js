export default function buildExperiment(nodes, edges, entryNode) {
  let workflows = nodes.filter(
    (node) => node.type == "workflow" && typeof node.parentNode == "string",
  );

  let components = nodes.filter(
    (node) => node.type == "" && typeof node.parentNode === "string",
  );

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
    components.forEach((component) =>
      result.components.push(component.definition),
    );
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
            execution.args[argument] = edge.definition[argument].replace(
              edge.source,
              edge.sourceNode.stepReference,
            );
          }
        });
      } else {
        Object.keys(edge.definition).forEach((argument) => {
          execution.args[argument] = edge.definition[argument].replace(
            edge.sourceNode.id,
            edge.sourceNode.stepReference,
          );
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
