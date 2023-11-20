import getDSLDefinition from "@/canvas/functions/removeEmptyValues";

export default function buildExperiment(nodes, edges, entryNode) {
  let workflows = nodes.filter((node) => node.type == "workflow");
  let components = nodes.filter((node) => node.type == "component");
  let inputs = nodes.filter((node) => node.type == "input");

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
    if (inputs.length > 0) {
      initialiseEntrypoint(result, inputs);
    }
    if (Object.keys(result.entrypoint.execute[0].args).length == 0) {
      delete result.entrypoint.execute[0].args;
    }
    workflows.forEach((workflow) => {
      //before adding the workflows to the experiment dsl, the definition needs
      //to be updated to reflect the edges
      //information in edges will form the execute part of a workflow definition
      createExecutionConfig(workflow, nodes, edges);
      result.workflows.push(getDSLDefinition(workflow.definition));
    });
    //Component
    components.forEach((component) => {
      result.components.push(getDSLDefinition(component.definition));
    });
  }

  return result;
}

function initialiseEntrypoint(result, inputNodes) {
  for (var inputNode of inputNodes) {
    result.entrypoint.execute[0].args = {
      ...result.entrypoint.execute[0].args,
      ...inputNode.definition,
    };
  }
  return result;
}

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
    if (Object.keys(execution.args).length == 0) {
      delete execution.args;
    }
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
      node.stepReference = `${stepReference}/${node.stepId}`;
    }
    if (node.type == "workflow") {
      setStepReferences(node, node.stepReference, nodes);
    }
  });
}
