//Modals functions
//This function takes a string in the form of %(referencedParameter)s
//and returns the referencedParameter
function getReferencedParameter(stringWithSymbols) {
  let referencedParameter = stringWithSymbols;
  if (stringWithSymbols.startsWith("%")) {
    referencedParameter = stringWithSymbols.substring(
      2,
      stringWithSymbols.length - 2,
    );
  }
  return referencedParameter;
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
  console.log(argumentNames);
  let targetParameters = targetNode.definition.signature.parameters.map(
    (p) => p.name,
  );
  targetParameters = targetParameters.filter(
    (targetParameter) => !argumentNames.includes(targetParameter),
  );
  console.log(targetParameters);

  return targetParameters;
}

//This function takes a string in the form of <source.path/filename>:method
//and extracts/returns the filename and method strings
// function getFileNameandMethod(fullString) {
//   let splitArray = fullString.split(">:");
//   let method = splitArray[1];
//   let fileName = splitArray[0].split("<")[1].split("/")[1];
//   return { fileName, method };
// }

//This function gets the source node and arguments for an existing edge/connection
export function getEdgeSourceAndArguments(allNodes, edge) {
  let sourceNode = {};
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
      argumentsArray.push({
        name: a,
        value: getReferencedParameter(edge.definition[a]),
      });
    });
  } else if (edge.sourceNode.type == "component") {
    sourceType = "component";
    sourceNode = allNodes.find((node) => node.id == edge.sourceNode.id);
    //Transform arguments into array for ease of adding and removing
    //it's hard to change object keys
    Object.keys(edge.definition).forEach((a) => {
      //let { fileName, method } = getFileNameandMethod(edge.definition[a]);
      argumentsArray.push({
        name: a,
        value: edge.definition[a],
        // fileName: fileName,
        // method: method,
      });
    });
  }
  return { sourceNode, sourceType, argumentsArray };
}

//This function gets the source node and arguments for an edge/connection in progress
//so, will initialise the arguments array based on the source node type
export function getEdgeSourceAndInitialiseArguments(allNodes, edge) {
  let sourceNode = allNodes.find((node) => node.id == edge.source);
  let sourceType = "component";
  let argumentsArray = [{ name: "", value: "" }];
  if (sourceNode.type == "workflow-input") {
    sourceType = "workflow";
    sourceNode = allNodes.find((node) => node.id == sourceNode.parentNode);
  }
  return { sourceNode, sourceType, argumentsArray };
}
