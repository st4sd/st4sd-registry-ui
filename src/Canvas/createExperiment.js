export default function createExperiment(Nodes, entryPointID) {
  let entryNode = Nodes.find((n) => n.id == entryPointID.value);
  let workflows = Nodes.filter(
    (n) => n.type == "workflow" && typeof n.parentNode == "string"
  );

  let components = Nodes.filter(
    (n) => n.type == "" && typeof n.parentNode === "string"
  );

  let result = {};
  if (entryNode != undefined) {
    result = {
      entrypoint: {
        "entry-instance": entryNode.label,
        execute: [
          {
            target: "<entry-instance>",
            args: {},
          },
        ],
      },
      workflows: [],
      components: [],
    };
    initialiseEntrypoint(result, Nodes);
    workflows.forEach((workflow) => result.workflows.push(workflow.definition));

    //Component
    components.forEach((component) =>
      result.components.push(component.definition)
    );
  }

  return result;
}

function initialiseEntrypoint(result, Nodes) {
  let inputs = Nodes.filter((o) => o.type === "input");
  if (inputs != undefined) {
    for (var input in inputs) {
      result.entrypoint.execute[0].args[inputs[input].label] =
        inputs[input].definition;
    }
  }
  return result;
}
