import buildExperiment from "./buildExperiment";

export function toJSON(nodes, entrypointNodeId, experimentName = "experiment") {
  if (duplicateLabelsExist(nodes)) {
    alert(
      "2 or more WF/Components have the same name, experiment elements names has to be unique",
    );
  } else if (entrypointNodeId.value === "") {
    alert("Entry point is not selected, an experiment needs an entry point");
  } else {
    download(
      experimentName + ".json",
      buildExperiment(nodes, entrypointNodeId),
    );
  }
}

const duplicateLabelsExist = (elements) => {
  let labels = new Set();
  elements.forEach((element) => labels.add(element.label));
  return elements.length != labels.size;
};

const download = (filename, exp) => {
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
