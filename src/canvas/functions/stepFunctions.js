//This function checks if the node supplied is
//completly enclosed inside one workflow or more
//(excluding parent workflow if it exists - as the node is naturally inside the parent workflow)
//using the intersections data provided by vue flow library and passed to the function
export function isNestingValid(node, intersections, allNodes) {
  // variable to store workflows the node is completly enclosed in (except parent workflow)
  let nestingWorkflows = [];
  let isNesting = false;
  //Get all nodes that are nesting and sub nesting inside (node)
  let children = getChildren(node, allNodes);
  //Filter the intersections to only include the workflows
  //as nesting a node inside a component or input node is not valid
  let workflowIntersections = intersections.filter(
    (intersection) => intersection.type == "workflow",
  );
  //If there are no workflows intersecting then the nesting is not valid
  if (workflowIntersections.length == 0) {
    return { isNesting, nestingWorkflows };
  }

  let validIntersectingWorkflows = [];
  for (var intersection of workflowIntersections) {
    let isChild = children.some((n) => n.id == intersection.id);
    if (
      isEnclosed(node, intersection) &&
      !isChild &&
      //If the node doen't have a parent node
      //or the node is not intersecting with it's own parent
      //all nodes are intersecting with the parent by nature as they fall inside it
      (intersection.id != node.parentNode || node.parentNode == undefined)
    ) {
      validIntersectingWorkflows.push(intersection);
    }
  }
  if (
    validIntersectingWorkflows.length > 0 &&
    (node.parentNode == undefined || node.parentNode == "")
  ) {
    nestingWorkflows = validIntersectingWorkflows;
    isNesting = true;
  }

  return { isNesting, nestingWorkflows };
}

//Get all nodes that are nesting and sub nesting inside (node)
export function getChildren(parent, allNodes) {
  let childrenArray = [];
  //const Nodes = allNodes;
  let children = allNodes.filter((n) => n.parentNode == parent.id);
  if (children.length > 0) {
    children.forEach((childNode) => {
      childrenArray.push(childNode);
      //if the childNode is a workflow
      if (childNode.type == "workflow") {
        //get all it's children
        childrenArray.push(...getChildren(childNode, allNodes));
      }
    });
  }
  return childrenArray;
}

//Function that tests if (node) falls completly inside (parent)
export function isEnclosed(node, parent) {
  let result = false;
  //node
  let nodeCoordinates = {
    x: [node.computedPosition.x, 0],
    y: [node.computedPosition.y, 0],
  };

  //parent
  let parentCoordinates = {
    x: [parent.computedPosition.x, 0],
    y: [parent.computedPosition.y, 0],
  };
  //Height for workflow is set inside the style attribute and is set like this = "35px"
  //while for the input and component is set in a height attribute directly as a number = 35
  //https://github.ibm.com/st4sd/st4sd-registry-ui/issues/214
  if (parent.type == "workflow") {
    parentCoordinates["x"][1] =
      parentCoordinates["x"][0] + parseInt(parent.style.width.split("px")[0]);
    parentCoordinates["y"][1] =
      parentCoordinates["y"][0] + parseInt(parent.style.height.split("px")[0]);
    if (node.type == "workflow") {
      nodeCoordinates["x"][1] =
        nodeCoordinates["x"][0] + parseInt(node.style.width.split("px")[0]);
      nodeCoordinates["y"][1] =
        nodeCoordinates["y"][0] + parseInt(node.style.height.split("px")[0]);
    } else {
      if (isNaN(node.width)) {
        nodeCoordinates["x"][1] =
          nodeCoordinates["x"][0] + node.dimensions.width;
      } else {
        nodeCoordinates["x"][1] = nodeCoordinates["x"][0] + node.width;
      }

      if (isNaN(node.height)) {
        nodeCoordinates["y"][1] = nodeCoordinates["y"][0] + 35;
      } else {
        nodeCoordinates["y"][1] = nodeCoordinates["y"][0] + node.height;
      }
    }
    if (
      nodeCoordinates["x"][0] > parentCoordinates["x"][0] &&
      nodeCoordinates["x"][0] < parentCoordinates["x"][1] &&
      nodeCoordinates["x"][1] > parentCoordinates["x"][0] &&
      nodeCoordinates["x"][1] < parentCoordinates["x"][1] &&
      nodeCoordinates["y"][0] > parentCoordinates["y"][0] &&
      nodeCoordinates["y"][0] < parentCoordinates["y"][1] &&
      nodeCoordinates["y"][1] > parentCoordinates["y"][0] &&
      nodeCoordinates["y"][1] < parentCoordinates["y"][1]
    ) {
      result = true;
    }
  }
  return result;
}

//Function called when a step is removed from a workflow definition
//When a step is removed, it's associated part in the execute section
//of the definition needs to be removed as well
export function removeStep(workflow, removedNode) {
  let stepName;
  for (var a in workflow.definition.steps) {
    if (a == removedNode.stepId) {
      stepName = a;
    }
  }
  delete workflow.definition.steps[stepName];
}

//Function that deletes a node from the canvas and if it is a workflow will also
//remove it's children nodes (nodes nested inside it)
export function removeNodeAndStepReference(
  selectedNode,
  findNode,
  removeNodes,
) {
  //remove the node from the step definition of it's parent node if any
  if (selectedNode.parentNode != undefined || selectedNode.parentNode != "") {
    let parent = findNode(selectedNode.parentNode);
    if (parent != undefined && parent.type == "workflow") {
      removeStep(parent, selectedNode);
    }
  }
  //1st true for deleting all edges
  //2nd true for recursively deleting all child nodes
  removeNodes([selectedNode], true, true);
}
