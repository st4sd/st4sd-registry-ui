//Modals functions
//This function takes a string in the form of %(referencedParameter)s
//and returns the referencedParameter
function getReferencedParameter(stringWithSymbols) {
  let referencedParameter = stringWithSymbols;
  let extra = "";
  if (stringWithSymbols.startsWith("%(") && stringWithSymbols.includes(")s")) {
    referencedParameter = stringWithSymbols.substring(2).split(")s")[0];
    extra = stringWithSymbols.replace("%(" + referencedParameter + ")s", "");
  }
  return { argument: referencedParameter, extra: extra };
}

export function getPossibleArgumentNames(edge, allNodes, allEdges) {
  let targetNode = allNodes.find((node) => node.id == edge.target);
  let siblingEdges = allEdges.filter(
    (e) => e.target == edge.target && e.id != edge.id,
  );
  let argumentNames = [];
  siblingEdges.forEach((siblingEdge) => {
    argumentNames = argumentNames.concat(Object.keys(siblingEdge.definition));
  });
  let targetParameters = targetNode.definition.signature.parameters.map(
    (p) => p.name,
  );
  targetParameters = targetParameters.filter(
    (targetParameter) => !argumentNames.includes(targetParameter),
  );
  return targetParameters;
}

// This function takes a string in the form of <source>extra
// and extracts/returns the path and method strings
function getSuffix(fullString) {
  let suffix = fullString.split(">")[1];
  return suffix;
}

//This function gets the source node and arguments for an existing edge/connection
export function getEdgeSourceAndArguments(allNodes, edge) {
  let sourceNode = {};
  let targetNode = allNodes.find((node) => node.id == edge.targetNode.id);
  let sourceType = "";
  let argumentsArray = [];
  //Depending on the source node type the edge arguments will be in a certain format
  //either %(referencedParameter)s or <source.path/filename>:method
  if (edge.sourceNode.type == "workflow-input") {
    sourceType = "workflow";
    sourceNode = allNodes.find((node) => node.id == edge.sourceNode.parentNode);
    //Transform arguments into array for ease of adding and removing
    //it's hard to change object keys
    Object.keys(edge.definition).forEach((a) => {
      let result = getReferencedParameter(edge.definition[a]);
      argumentsArray.push({
        name: a,
        value: result.argument,
        extra: result.extra,
      });
    });
  } else if (edge.sourceNode.type == "component") {
    sourceType = "component";
    sourceNode = allNodes.find((node) => node.id == edge.sourceNode.id);
    //Transform arguments into array for ease of adding and removing
    //it's hard to change object keys
    Object.keys(edge.definition).forEach((a) => {
      argumentsArray.push({
        name: a,
        value: getSuffix(edge.definition[a]),
        extra: "",
      });
    });
  }
  return { sourceNode, targetNode, sourceType, argumentsArray };
}

//This function gets the source node and arguments for an edge/connection in progress
//so, will initialise the arguments array based on the source node type
export function getEdgeSourceAndInitialiseArguments(allNodes, edge) {
  let sourceNode = allNodes.find((node) => node.id == edge.source);
  let targetNode = allNodes.find((node) => node.id == edge.target);
  let sourceType = "component";
  let argumentsArray = [{ name: "", value: "", extra: "" }];
  if (sourceNode.type == "workflow-input") {
    sourceType = "workflow";
    sourceNode = allNodes.find((node) => node.id == sourceNode.parentNode);
  }
  return { sourceNode, targetNode, sourceType, argumentsArray };
}
