import ELK from "elkjs/lib/elk.bundled.js";

export async function autoAlignNodes(
  allNodes,
  allEdges,
  getIntersectingNodes,
  getConnectedEdges,
) {
  let workflowNodes = allNodes.filter((node) => node.type == "workflow");

  let elk = new ELK();

  for (let workflowNode of workflowNodes) {
    let intersectingNodes = getIntersectingNodes(workflowNode);
    let intersectingEdges = getConnectedEdges(intersectingNodes);
    for (let intersectingNode of intersectingNodes) {
      if (intersectingNode.type == "workflow") {
        intersectingNodes = intersectingNodes.filter(
          (node) => node.id != intersectingNode.id,
        );
      }
    }

    const graph = {
      id: `${workflowNode.id}root`,
      layoutOptions: {
        "elk.algorithm": "layered",
        "elk.direction": "DOWN",
        "elk.layered.spacing.nodeNodeBetweenLayers": "50",
        "elk.layered.nodePlacement.bk.fixedAlignment": "BALANCED",
        "org.eclipse.elk.layered.nodePlacement.strategy": "SIMPLE",
      },
      children: intersectingNodes.map((node) => {
        return {
          ...node,
          width: node.dimensions.width || 150,
          height: node.dimensions.height || 50,
        };
      }),
      edges: intersectingEdges,
    };

    let elkGraph = await elk.layout(graph);

    for (let i = 0; i < allNodes.length; i++) {
      let foundNode = elkGraph.children.find(
        (node) => allNodes[i].id == node.id,
      );
      if (foundNode) {
        allNodes[i] = {
          ...foundNode,
          /* 
            APev (19/02/25): Add 35 to y axis to stop nested 
            input node covering the title of workflow node.
          */
          position: { x: foundNode.x, y: foundNode.y + 35 },
        };
      }
    }

    for (let i = 0; i < allEdges.length; i++) {
      let foundEdge = elkGraph.edges.find((edge) => allEdges[i].id == edge.id);
      if (foundEdge) {
        allEdges[i] = { ...foundEdge };
      }
    }
  }

  return {
    newNodes: allNodes,
    newEdges: allEdges,
  };
}
