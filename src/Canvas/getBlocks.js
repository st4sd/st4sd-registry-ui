//This file functionality is to be replaced once a way
//to get all experiment blocks from the runtime service
//is established
export default function getBlocks(data) {
  let nodes = [];
  let workflows = data.workflows;
  let components = data.components;

  if (workflows != undefined) {
    for (let workflow of workflows) {
      let workflowName = workflow.signature.name;
      let dependencies = {
        workflows: [],
        components: [],
      };
      //This works because dependencies is a pointer that will get updated during recursion
      populateDependencies(workflow, data, dependencies);
      addNode(
        nodes,
        workflowName,
        workflowName,
        workflow,
        "workflow",
        dependencies,
      );
    }
  }
  if (components != undefined) {
    for (let component of components) {
      let componentName = component.signature.name;
      addNode(nodes, componentName, componentName, component, "component", []);
    }
  }
  return nodes;
}

//Function to get the definitions of all nested components/workflows
//inside a workflow, which are necessary to draw it
function populateDependencies(workflow, data, dependencies) {
  let steps = workflow.steps;
  for (var step in steps) {
    //Check if the step is referencing a component

    let componentMatch = data.components.find(
      (component) => component.signature.name == steps[step],
    );
    if (componentMatch != undefined) {
      dependencies.components.push(componentMatch);
    } else {
      //see if the step is a workflow
      let workflowMatch = data.workflows.find(
        (workflow) => workflow.signature.name == steps[step],
      );
      if (workflowMatch != undefined) {
        dependencies.workflows.push(workflowMatch);
        //if it is a workflow then get it's dependancies
        populateDependencies(workflowMatch, data, dependencies);
      }
    }
  }
  return dependencies;
}

function addNode(allNodes, id, label, definition, type, dependencies) {
  var node = {
    id: id,
    label: label,
    type: type,
    definition: definition,
    position: { x: 1, y: 1 },
    dependencies: dependencies,
  };
  allNodes.push(node);
}
