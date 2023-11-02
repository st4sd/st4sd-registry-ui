import buildExperiment from "@/canvas/functions/buildExperiment";

export function validateExperiment(nodes, entryNode) {
  if (duplicateLabelsExist(nodes)) {
    return {
      isValid: false,
      payload:
        "2 or more WF/Components have the same name, experiment elements names has to be unique",
    };
  } else if (entryNode == undefined) {
    return {
      isValid: false,
      payload:
        "Entry point is not selected, an experiment needs an entry point",
    };
  } else {
    return { isValid: true, payload: entryNode };
  }
}

export function getDsl(nodes, edges) {
  let entryNode = nodes.find((node) => node.isEntry == true);
  let validationResult = validateExperiment(nodes, entryNode);
  if (validationResult.isValid) {
    return buildExperiment(nodes, edges, entryNode);
  } else {
    throw new Error(validationResult.payload);
  }
}

export function downloadExperiment(nodes, edges, fileName) {
  let dsl = getDsl(nodes, edges);
  if (dsl != undefined) {
    download(fileName + ".json", dsl);
  }
}

const duplicateLabelsExist = (elements) => {
  let labels = new Set();
  elements.forEach((element) => labels.add(element.label));
  return elements.length != labels.size;
};

export const download = (filename, exp) => {
  var hiddenElement = document.createElement("a");
  hiddenElement.setAttribute(
    "href",
    "data:text/plain; charset=utf-8, " +
      encodeURIComponent(JSON.stringify(exp)),
  );
  hiddenElement.setAttribute("download", filename);
  document.body.appendChild(hiddenElement);
  hiddenElement.click();
  document.body.removeChild(hiddenElement);
};
