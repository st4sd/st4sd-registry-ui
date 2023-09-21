export const getWorkflowsDimensions = (nodes) => {
  let workflowDimensionsDictionary = {};
  for (var node of nodes) {
    if (node.type == "workflow") {
      workflowDimensionsDictionary[node.id] = {
        width: node.style.width,
        height: node.style.height,
      };
    }
  }
  return workflowDimensionsDictionary;
};

export const getWorkflowsEdges = (nodes, edges) => {
  let workflowEdgesDictionary = {};
  for (var node of nodes) {
    if (node.type == "workflow") {
      workflowEdgesDictionary[node.id] = {
        edges: [],
      };
      //We are looking for edges that start from the workflow
      //or any node inside that workflow
      //this takes advantage of the naming convention for edges and nodes IDs
      //we are using .include() since the id's we are looking for
      //are in this form `${workflowName}/input`
      let workflowEdges = edges.filter((edge) => edge.source.includes(node.id));
      // we want to remove edges that start and end inside this workflow
      //meaning that the source and target nodes are children/nested inside this workflow
      let workflowFinalEdges = workflowEdges.filter(
        (edge) => !edge.target.includes(node.id),
      );
      for (var edge of workflowFinalEdges) {
        workflowEdgesDictionary[node.id].edges.push(edge);
      }
    }
  }
  return workflowEdgesDictionary;
};

export const hide = (
  node,
  nodes,
  edges,
  workFlowsDimensions,
  workFlowsEdges,
  isHidden,
) => {
  if (node.type == "workflow") {
    hideChildren(node, nodes, isHidden);
  }
  let workflow = nodes.find((n) => n.id == node.id);
  let toDelete = [];
  if (isHidden) {
    workflow.style.width = workflow.label.length * 20 + "px";
    workflow.style.height = "50px";
    for (var edge of workFlowsEdges[workflow.id].edges) {
      let existingEdge = edges.find((e) => e.id == edge.id);
      var newEdge = {
        id: `${existingEdge.id}[Hidden]`,
        source: workflow.id,
        target: existingEdge.target,
        definition: existingEdge.definition,
        markerEnd: existingEdge.markerEnd,
      };
      edges.push(newEdge);
    }
  } else {
    workflow.style.width = workFlowsDimensions[workflow.id].width;
    workflow.style.height = workFlowsDimensions[workflow.id].height;
    for (var anEdge of workFlowsEdges[workflow.id].edges) {
      let toBeDeletedEdge = edges.find((e) => e.id == `${anEdge.id}[Hidden]`);
      toDelete.push(toBeDeletedEdge);
    }
  }
  return { nodes, edges, toDelete };
};

export const hideChildren = (parent, nodes, hidden) => {
  let children = nodes.filter((n) => n.parentNode == parent.id);
  if (children.length > 0) {
    children.forEach((childNode) => {
      childNode.hidden = hidden;
      if (childNode.type == "workflow") {
        hideChildren(childNode, nodes, hidden);
      }
    });
  }
};
