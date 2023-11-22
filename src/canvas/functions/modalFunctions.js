//Modals functions
//This function takes a string in the form of %(parameter)sSuffix
//and returns the parameter
function getParameterAndSuffix(stringWithSymbols) {
  let parameter = stringWithSymbols;
  let suffix = "";
  if (stringWithSymbols.startsWith("%(") && stringWithSymbols.includes(")s")) {
    parameter = stringWithSymbols.substring(2).split(")s")[0];
    suffix = stringWithSymbols.replace("%(" + parameter + ")s", "");
  }
  return { parameter: parameter, suffix: suffix };
}

// This function takes a string in the form of <stepName>Suffix
// and extracts/returns the path and method strings
function getStepNameAndSuffix(fullString) {
  let splitArray = fullString.split(">");
  let suffix = splitArray[1];
  let stepName = splitArray[0].split("<")[1];
  return { stepName: stepName, suffix: suffix };
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

//This function returns the source node and target node for any edge
//If the source node is a workflow input - the source node will then become the workflow itself
export function getSourceAndTargetNodes(allNodes, edge) {
  let sourceNode = allNodes.find((node) => node.id == edge.source);
  let targetNode = allNodes.find((node) => node.id == edge.target);
  let sourceNodeType = sourceNode.type;
  if (sourceNode.type == "workflow-input") {
    sourceNode = allNodes.find((node) => node.id == sourceNode.parentNode);
  }
  return { sourceNode, targetNode, sourceNodeType };
}

export function getArguments(sourceNodeType, edge) {
  let argumentsArray = [];
  //Check if we are dealing with a new edge in progress (to be created)
  //or an existing edge that's being updated
  if (edge.definition != undefined) {
    if (sourceNodeType == "workflow-input") {
      //Transform arguments into array for ease of adding and removing
      //it's hard to change object keys
      argumentsArray = [];
      Object.keys(edge.definition).forEach((a) => {
        let result = getParameterAndSuffix(edge.definition[a]);
        argumentsArray.push({
          name: a,
          value: result.parameter,
          suffix: result.suffix,
        });
      });
    } else {
      //Transform arguments into array for ease of adding and removing
      //it's hard to change object keys
      argumentsArray = [];
      Object.keys(edge.definition).forEach((a) => {
        let result = getStepNameAndSuffix(edge.definition[a]);
        argumentsArray.push({
          name: a,
          value: result.stepName,
          suffix: result.suffix,
        });
      });
    }
  }
  //If the edge has no definition it means it's a new edge to be created
  //we initialise the argument array then.
  else {
    argumentsArray = [{ name: "", value: "", suffix: "" }];
  }
  return argumentsArray;
}
