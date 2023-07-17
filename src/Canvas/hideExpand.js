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
      let workflowEdges = edges.filter((e) => e.source.includes(node.id));
      // we want to remove edges that start and end inside this workflow
      //meaning that the source and target nodes are children/nested inside this workflow
      let workflowFinalEdges = workflowEdges.filter(
        (e) => !e.target.includes(node.id),
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
  workFlowsDims,
  workFlowsEdges,
  isHidden,
) => {
  if (node.type == "workflow") {
    hideChildren(node, nodes, isHidden);
  }
  let wf = nodes.find((n) => n.id == node.id);
  let toDelete = [];
  if (isHidden) {
    wf.style.width = wf.label.length * 30 + "px";
    wf.style.height = "100px";
    for (var edge of workFlowsEdges[wf.id].edges) {
      let existingEdge = edges.find((e) => e.id == edge.id);
      var newEdge = {
        id: `${existingEdge.id}[Hidden]`,
        source: wf.id,
        target: existingEdge.target,
        definition: existingEdge.definition,
        markerEnd: existingEdge.markerEnd,
      };
      edges.push(newEdge);
    }
  } else {
    wf.style.width = workFlowsDims[wf.id].width;
    wf.style.height = workFlowsDims[wf.id].height;
    for (var dEdge of workFlowsEdges[wf.id].edges) {
      let toDeleteEdge = edges.find((e) => e.id == `${dEdge.id}[Hidden]`);
      toDelete.push(toDeleteEdge);
    }
  }
  return { nodes, edges, toDelete };
};

export const hideChildren = (parent, nodes, Hidden) => {
  let children = nodes.filter((n) => n.parentNode == parent.id);
  if (children.length > 0) {
    children.forEach((cNode) => {
      cNode.hidden = Hidden;
      if (cNode.type == "workflow") {
        hideChildren(cNode, nodes, Hidden);
      }
    });
  }
};
