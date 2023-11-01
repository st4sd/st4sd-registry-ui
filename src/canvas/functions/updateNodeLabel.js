import { getTextWidth } from "@/canvas/functions/getTextWidth";

export function updateNodeLabel(node) {
  if (!node.stepId) {
    node.label = node.definition.signature.name;
  } else {
    node.label = node.stepId;
  }
  if (node.type == "workflow") {
    let newWidth = getTextWidth(`${node.label} inputs`) + 30;
    let oldWidth = parseInt(node.style.width.split("px")[0]);
    if (newWidth > oldWidth) {
      node.style.width = newWidth + "px";
    }
  } else {
    node.width = getTextWidth(node.label);
  }
}
