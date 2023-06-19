export default function buildExperiment(nodes, entryPointID) {
  let entryNode = nodes.find((n) => n.id == entryPointID.value);
  let workflows = nodes.filter(
    (n) => n.type == "workflow" && typeof n.parentNode == "string"
  );

  let components = nodes.filter(
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
    initialiseEntrypoint(result, nodes);
    workflows.forEach((workflow) => result.workflows.push(workflow.definition));

    //Component
    components.forEach((component) =>
      result.components.push(component.definition)
    );
  }

  return result;
}

function initialiseEntrypoint(result, nodes) {
  let inputs = nodes.filter((o) => o.type === "input");
  if (inputs != undefined) {
    for (var input in inputs) {
      result.entrypoint.execute[0].args[inputs[input].label] =
        inputs[input].definition;
    }
  }
  return result;
}
