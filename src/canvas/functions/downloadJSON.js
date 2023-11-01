import buildExperiment from "@/canvas/functions/buildExperiment";

export function toJSON(nodes, edges, experimentName) {
  let entryNode = nodes.find((node) => node.isEntry == true);
  if (duplicateLabelsExist(nodes)) {
    alert(
      "2 or more WF/Components have the same name, experiment elements names has to be unique",
    );
  } else if (entryNode == undefined) {
    alert("Entry point is not selected, an experiment needs an entry point");
  } else {
    download(
      experimentName + ".json",
      buildExperiment(nodes, edges, entryNode),
    );
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
