//measurments variables - Components
const componentVerticalSpacing = 20;
const componentHorizontalSpacing = 20;
const componentDefaultHeight = 35;
//measurments variables - Workflows
const workflowHorizontalIndent = 10;
const workflowVerticalIndent = 80;
const workflowHorizontalSpacing = 20;
const workflowVerticalSpacing = 80;
//measurments variables - General
const generalVerticalSpacing = 80;

export function drawGraph(graph) {
  let drawn = {
    nodes: [],
    edges: graph.edges,
    elevateEdgesOnSelect: true,
  };
  let startWorkflow = graph.nodes.find((node) => node.isEntry == true);
  initialiseGraph(startWorkflow, graph, drawn);
  draw(startWorkflow, graph, drawn);
  fixInputPositions(drawn);
  fixIntersections(startWorkflow, drawn);
  return drawn;
}

//This function adds the main/entry workflow and it's inputs
//as those nodes are already in the right position and
//we will be drawing all the other nodes
//based on those nodes positions
function initialiseGraph(startWorkflow, graph, drawn) {
  addToDrawnArray(startWorkflow, drawn);
  let inputs = graph.nodes.filter((node) => node.type == "input");
  for (var input of inputs) {
    addToDrawnArray(input, drawn);
  }
}

function draw(startWorkflow, graph, drawn) {
  let startWorkflowID = startWorkflow.id;
  let startWorkflowInputID = `${startWorkflowID}/input`;
  let startWorkflowInputNode = graph.nodes.find(
    (node) => node.id == startWorkflowInputID,
  );
  addToDrawnArray(startWorkflowInputNode, drawn);
  let children = graph.nodes.filter(
    (node) =>
      node.parentNode == startWorkflowID && node.id != startWorkflowInputID,
  );
  // https://github.ibm.com/st4sd/st4sd-registry-ui/pull/165#discussion_r7632114
  let childrenCounter = children.length;
  // graph.nodes.filter((node) =>
  //     node.parentNode == startWorkflowID && node.id != startWorkflowInputID
  // );

  while (childrenCounter > 0) {
    for (var child of children) {
      if (!isDrawn(drawn, child)) {
        let childSources = getSources(graph, child);
        if (areAllDrawn(drawn, childSources)) {
          //We will use this variable to store the calculated position of
          //this node (child) according to it's sources -dependency nodes-
          let calculatedPosition;
          calculatedPosition = calculatePosition(childSources);
          calculatedPosition = getNonOverlappingPosition(
            drawn,
            child,
            calculatedPosition,
          );
          child.position = calculatedPosition;
          if (child.type == "workflow") {
            child.style.width = "1px";
            addToDrawnArray(child, drawn);
            childrenCounter--;
            //removeItem(childrenCounter, child);
            draw(graph, drawn, child);
          } else {
            addToDrawnArray(child, drawn);
            childrenCounter--;
            //removeItem(childrenCounter, child);
          }
        }
      }
    }
  }
  fixWorkflowsWidth(drawn, startWorkflow);
  fixWorkflowsHeight(drawn, startWorkflow);
  centreSingletons(drawn, startWorkflow);
  return drawn;
}

function areAllDrawn(drawn, nodeArray) {
  for (var node of nodeArray) {
    if (!isDrawn(drawn, node)) {
      return false;
    }
  }
  return true;
}

function isDrawn(drawn, node) {
  return drawn.nodes.some((n) => n.id == node.id);
}

//This function collects the graph nodes that are feeding (node)
//as in (node) dependancies / sources,
// any node that has an edge targeting or feeding into (node)
function getSources(graph, node) {
  let sourceNodes = [];
  let edgesTargetingNode = graph.edges.filter((edge) => edge.target == node.id);
  for (var edge of edgesTargetingNode) {
    //We are only interested in source nodes that are on the same level
    //of (node). As in, share the same parent node
    let candidateSourceNode = graph.nodes.find((n) => n.id == edge.source);
    while (
      candidateSourceNode != undefined &&
      node.parentNode != candidateSourceNode.parentNode
    ) {
      // we walk up the graph
      // we can't do this first because there is no property
      // connecting the source node that on the same level
      // of the node we are checking to that node
      candidateSourceNode = graph.nodes.find(
        (n) => n.id == candidateSourceNode.parentNode,
      );
    }
    if (candidateSourceNode != undefined) {
      sourceNodes.push(candidateSourceNode);
    }
  }
  return sourceNodes;
}

function addToDrawnArray(node, drawnArray) {
  if (!drawnArray.nodes.some((n) => n.id == node.id)) {
    drawnArray.nodes.push(node);
  }
}

//calculates the position of a node in relation to
//it's dependency nodes or sources
function calculatePosition(existingParents) {
  let x = 0;
  let y = 0;
  //If the nodes has 1 parent/dependancy then the new node will
  //have the same X position and (VerticalSpacing) + parent Y position (downward)
  //depending if workflow or component
  if (existingParents.length == 1) {
    if (existingParents[0].type == "workflow") {
      x = existingParents[0].position.x;
      y =
        existingParents[0].position.y +
        parseInt(existingParents[0].style.height.split("px")[0]) +
        componentVerticalSpacing;
    } else {
      x = existingParents[0].position.x;
      y = existingParents[0].position.y + workflowVerticalSpacing;
    }
  }
  //If the nodes has multiple parents/dependancies
  //then the new node will have the
  //averege of the parents X positions as it's X position and the
  //averege of the parents Y positions + generalVerticalSpacing
  //downwards as it's Y position
  else if (existingParents.length > 1) {
    let sumX = 0;
    let highestY = 0;
    let yPosition = 0;
    existingParents.forEach((p) => {
      sumX = sumX + p.position.x;
      if (p.type == "workflow") {
        yPosition = p.position.y + parseInt(p.style.height.split("px")[0]);
      } else {
        yPosition = p.position.y;
      }
      if (yPosition > highestY) {
        highestY = yPosition;
      }
    });
    x = sumX / existingParents.length;
    y = highestY + generalVerticalSpacing;
  }
  return {
    x: x,
    y: y,
  };
}

function fixWorkflowsWidth(drawn, workflow) {
  let insideNodes = drawn.nodes.filter((n) => n.parentNode == workflow.id);
  let maxX = 0;
  for (var node of insideNodes) {
    let x;
    if (node.type == "workflow") {
      x = node.position.x + parseInt(node.style.width.split("px")[0]);
    } else {
      x = node.position.x + node.width;
    }
    if (x > maxX) {
      maxX = x;
    }
  }
  let total = maxX + workflowHorizontalIndent;
  workflow.style.width = total + "px";
  return total;
}

function fixWorkflowsHeight(drawn, workflow) {
  let insideNodes = drawn.nodes.filter((n) => n.parentNode == workflow.id);
  let maxY = 0;
  for (var node of insideNodes) {
    let y;
    if (node.type == "workflow") {
      y = node.position.y + parseInt(node.style.height.split("px")[0]);
    } else {
      y = node.position.y + componentDefaultHeight;
    }
    if (y > maxY) {
      maxY = y;
    }
  }
  let total = maxY + workflowVerticalIndent;
  workflow.style.height = total + "px";
  return total;
}

function fixInputPositions(drawn) {
  for (var node of drawn.nodes) {
    if (node.type == "param") {
      let nodeParent = drawn.nodes.find((n) => n.id == node.parentNode);
      let parentWidth = parseInt(nodeParent.style.width.split("px")[0]);
      let parentCentre = parentWidth / 2;
      let nodeCentre = node.width / 2;
      node.position.x = parentCentre - nodeCentre;
    }
  }
  return drawn;
}

//This function will test if any 2 nodes are intersecting - overlapping
//and fix it's positioning
function fixIntersections(startWorkflow, drawn) {
  let children = drawn.nodes.filter(
    (node) => node.parentNode == startWorkflow.id,
  );
  //will compare all array elements with each others
  for (var i = 0; i < children.length; i++) {
    for (var j = i + 1; j < children.length; j++) {
      let interResult = getIntersectingDimensions(children[i], children[j]);
      if (interResult.isIntersecting) {
        if (interResult.intersectionDimension == "x") {
          children[j].position.x =
            children[j].position.x +
            interResult.intersectionValue +
            componentHorizontalSpacing;
        } else if (interResult.intersectionDimension == "y") {
          children[j].position.y =
            children[j].position.y +
            interResult.intersectionValue +
            componentVerticalSpacing;
        }
      }
    }
  }
  return drawn;
}

//This function test if the two nodes are intersecting and
//finds the dimension with the lowest intersecting value x or y
//and the intersecting value itself
function getIntersectingDimensions(blockA, blockB) {
  //Block A
  let blockACoordinates = {
    x: [blockA.position.x, 0],
    y: [blockA.position.y, 0],
  };

  //Block B
  let blockBCoordinates = {
    x: [blockB.position.x, 0],
    y: [blockB.position.y, 0],
  };

  // Calculate the ending coordinates for block A and B
  if (blockA.type == "workflow") {
    blockACoordinates["x"][1] =
      blockA.position.x + parseInt(blockA.style.width.split("px")[0]);
    blockACoordinates["y"][1] =
      blockA.position.y + parseInt(blockA.style.height.split("px")[0]);
  } else {
    blockACoordinates["x"][1] = blockA.position.x + blockA.width;
    blockACoordinates["y"][1] = blockA.position.y + componentDefaultHeight;
  }
  if (blockB.type == "workflow") {
    blockBCoordinates["x"][1] =
      blockB.position.x + parseInt(blockB.style.width.split("px")[0]);
    blockBCoordinates["y"][1] =
      blockB.position.y + parseInt(blockB.style.height.split("px")[0]);
  } else {
    blockBCoordinates["x"][1] = blockB.position.x + blockB.width;
    blockBCoordinates["y"][1] = blockB.position.y + componentDefaultHeight;
  }

  let intersecting = false;
  let xInter = 0;
  let yInter = 0;
  let lowestIntersectionValue = 0;
  let lowestIntersectingDimension = "";
  if (
    !(
      blockACoordinates["x"][0] < blockBCoordinates["x"][1] &&
      blockACoordinates["x"][1] > blockBCoordinates["x"][0] &&
      blockACoordinates["y"][0] < blockBCoordinates["y"][1] &&
      blockACoordinates["y"][1] > blockBCoordinates["y"][0]
    )
  ) {
    return {
      isIntersecting: intersecting,
      intersectionDimension: "",
      intersectionValue: 0,
    };
  }
  intersecting = true;
  if (
    (blockBCoordinates["x"][0] > blockACoordinates["x"][0] &&
      blockBCoordinates["x"][0] < blockACoordinates["x"][1]) ||
    (blockBCoordinates["x"][1] > blockACoordinates["x"][0] &&
      blockBCoordinates["x"][1] < blockACoordinates["x"][1])
  ) {
    if (blockACoordinates["x"][1] > blockBCoordinates["x"][1]) {
      xInter = blockBCoordinates["x"][1] - blockBCoordinates["x"][0];
    } else {
      xInter = blockACoordinates["x"][1] - blockBCoordinates["x"][0];
    }
  }
  if (
    (blockBCoordinates["y"][0] > blockACoordinates["y"][0] &&
      blockBCoordinates["y"][0] < blockACoordinates["y"][1]) ||
    (blockBCoordinates["y"][1] > blockACoordinates["y"][0] &&
      blockBCoordinates["y"][1] < blockACoordinates["y"][1])
  ) {
    if (blockACoordinates["y"][1] > blockBCoordinates["y"][1]) {
      yInter = blockBCoordinates["y"][1] - blockBCoordinates["y"][0];
    } else {
      yInter = blockACoordinates["y"][1] - blockBCoordinates["y"][0];
    }
  }

  lowestIntersectionValue = xInter;
  lowestIntersectingDimension = "x";
  if (yInter < lowestIntersectionValue) {
    lowestIntersectionValue = yInter;
    lowestIntersectingDimension = "y";
  }
  //this means that one node is completly contained in the other
  //the function needs more work into positioning
  if (lowestIntersectionValue == 0) {
    lowestIntersectionValue = 35;
    lowestIntersectingDimension = "y";
  }

  return {
    isIntersecting: intersecting,
    intersectionDimension: lowestIntersectingDimension,
    intersectionValue: lowestIntersectionValue,
  };
}

function getNonOverlappingPosition(drawn, child, calculatedPosition) {
  //node positions are relative to their parent node - as such
  //there is no point in comparing nodes positions when they are not
  //on the same nesting level
  let samePlaceNode = drawn.nodes.find(
    (node) =>
      node.position.x == calculatedPosition.x &&
      node.position.y == calculatedPosition.y &&
      node.parentNode == child.parentNode,
  );
  if (samePlaceNode == undefined) return calculatedPosition;
  if (samePlaceNode.type == "workflow") {
    let wfWidth = parseInt(samePlaceNode.style.width.split("px")[0]);
    calculatedPosition.x =
      calculatedPosition.x + wfWidth + workflowHorizontalSpacing;
  } else {
    calculatedPosition.x =
      calculatedPosition.x + samePlaceNode.width + componentHorizontalSpacing;
  }

  return calculatedPosition;
}

function centreSingletons(drawn, wf) {
  let singletons = getSingletons(drawn, wf);
  for (var node of singletons) {
    let nodeParent = drawn.nodes.find((n) => n.id == node.parentNode);
    if (node.type == "workflow") {
      let parentWidth = parseInt(nodeParent.style.width.split("px")[0]);
      let parentCentre = parentWidth / 2;
      let nodeCentre = parseInt(node.style.width.split("px")[0]) / 2;
      node.position.x = parentCentre - nodeCentre;
    } else {
      let parentWidth = parseInt(nodeParent.style.width.split("px")[0]);
      let parentCentre = parentWidth / 2;
      let nodeCentre = node.width / 2;
      node.position.x = parentCentre - nodeCentre;
    }
  }
}
//Singletons are nodes that have 0 inputs (like workflow input nodes)
//and any nodes that have only 1 input (dependancy node) and
//it's the only child to that node
//is simple terms one child and one parent
function getSingletons(drawn, wf) {
  let singletons = [];
  let children = drawn.nodes.filter((node) => node.parentNode == wf.id);
  //for each node on the same nesting level
  //(directly inside wf and not nested inside a child workflow)
  for (var child of children) {
    //get each nodes input nodes (dependancy nodes)
    let inputs = drawn.edges.filter((e) => e.target == child.id);
    //if there are no inputs it is a singleton
    if (inputs.length == 0) {
      singletons.push(child);
    }
    // if there is only one input (parent) - it could be a singleton
    else if (inputs.length == 1) {
      let input = inputs[0];
      let edgesWithSameSource = drawn.edges.filter(
        (edge) => edge.source == input.source,
      );
      //if there is only one child - it is a singleton
      if (edgesWithSameSource.length == 1) {
        singletons.push(child);
      }
    }
  }
  return singletons;
}
