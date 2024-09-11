import { findNodeByName } from "./canvasFunctions";
import { canvasStore } from "@/canvas/stores/canvasStore";

export function dslErrorToString(errorObject, nodes) {
  if (!errorObject?.location) return;

  // Assigning to variable for ease of use
  let location = errorObject.location;

  // We want to resolve the numbers in the location message to the various
  // component/workflow/parameter names to print them out for the user.
  // We also want to apply some transformation to these strings to make them
  // make more sense once we print them out.
  let humanReadableLocation = errorLocationToHumanReadable(
    errorObject,
    nodes,
  ).location;
  humanReadableLocation = humanReadableLocationToPrintable(
    humanReadableLocation,
  );

  // We want to lower case the first letter of the message as it'll come after a colon (:)
  let errorMessage =
    errorObject["message"][0].toLowerCase() + errorObject["message"].slice(1);

  // In case we don't have any specific handling for our case, we rely
  // on a generic message
  let result = `Error in ${humanReadableLocation[0]} "${humanReadableLocation[1]}"`;

  /*
    AP: WE HAVE A CASE FOR ALL SUPPORTED ERRORS
  */

  // Field required error: too complex to handle differently
  if (errorObject?.type == "missing") {
    return (result += `: ${errorMessage}`);
  }

  if (location.length >= 3) {
    // e.g.:
    // The parameter X of Y does not have a default value and is not given a value
    if (location[2] == "execute") {
      return (result += `: ${errorMessage}`);
    }

    // e.g,:
    // The parameter X in location entry-instance does not have a value or default
    if (
      location[2] == "signature" &&
      location.length >= 4 &&
      location[3] == "parameters"
    ) {
      return (result += `'s ${humanReadableLocation[3]}: ${errorMessage}`);
    }
  }

  // We default to adding the error message
  return (result += `: ${errorMessage}`);
}

function extractAppropriateValue(element) {
  if (!element) return;

  const keysToTry = ["name", "target"];
  for (let key of keysToTry) {
    if (element[key]) return element[key];
  }

  return element;
}

export function resolveLocationArray(locationArray, nodes) {
  if (!locationArray) return;

  // AP: we create a copy of the location array
  // the `location` array will be returned from this function
  // the `tempLocation` array will be manipulated in this function
  let location = locationArray.slice();
  let tempLocation = locationArray.slice();

  let template = resolveTemplateByLocationArray(locationArray, nodes);
  if (!template) return location;

  // We will always be accessing the template's definition
  template = template.definition;

  // the location array starts with
  // - 0: "workflows" or "components"
  // - 1: index
  location[1] = template.signature.name;

  // We remove the first two elements from the location array
  tempLocation = tempLocation.splice(2);

  // indexToSubstitute represents the index of the element
  // we will need to change in the `location` array. As we
  // will splice items out of the `tempLocation` array, we need
  // a support variable to find the index in the `location` array
  let indexToSubstitute = 2;

  // We need to convert number to the name of the item they are pointing to
  // we will iterate until we find numbers to substitute.
  let indexToResolve = tempLocation.findIndex((element) =>
    Number.isInteger(element),
  );

  while (indexToResolve != -1) {
    // We drill down in the template to follow the location
    for (let i = 0; i <= indexToResolve; i = i + 1) {
      template = template[tempLocation[i]];
    }

    indexToSubstitute += indexToResolve;

    // We need to extract something from the template
    // we use a different function to determine what we want to extract
    location[indexToSubstitute] = extractAppropriateValue(template);

    // +1 because start index is included
    tempLocation = tempLocation.splice(indexToResolve + 1);

    // Update before the next iteration
    indexToResolve = tempLocation.findIndex((element) =>
      Number.isInteger(element),
    );
  }

  return location;
}

export function resolveTemplateByLocationArray(locationArray, nodes) {
  let type;

  switch (locationArray[0]) {
    case "workflows":
      type = "workflow";
      break;
    case "components":
      type = "component";
      break;
    default:
      type = locationArray[0];
  }

  // AP 09/09/24:
  // This works by mimicking the way we construct the DSL.
  // By filtering the nodes first, we can then access them via
  // the id contained in the location array returned by the backend
  let filteredNodes = nodes.filter((node) => node.type == type);
  return filteredNodes[locationArray[1]];
}

export function errorLocationToHumanReadable(errorObject, nodes) {
  // AP: 29/08/2024
  // structuredClone does not work for some reason
  let updatedObject = JSON.parse(JSON.stringify(errorObject));
  updatedObject.location = resolveLocationArray(updatedObject?.location, nodes);
  return updatedObject;
}

const locationToPrintableMapping = new Map([
  ["workflows", "workflow"],
  ["components", "component"],
  ["args", "arguments"],
]);

function humanReadableLocationToPrintable(location) {
  return location.map((item) => {
    if (locationToPrintableMapping.has(item)) {
      return locationToPrintableMapping.get(item);
    }
    return item;
  });
}

export function setFormErrors(nodes, errorsFromBackend) {
  let processedErrors = [];
  for (let i = 0; i < errorsFromBackend.length; i++) {
    // AP: we can only do something about errors for which
    // we have the location and that are specific enough to
    // match something (i.e., we can't invalidate a field if
    // we are just given a workflow)
    if (
      !errorsFromBackend[i].location ||
      errorsFromBackend[i].location.length <= 2
    )
      continue;

    // The id in the template is generated based on the second part
    // of the location array (i.e., without the first two fields)
    let locationInTemplate = errorsFromBackend[i].location.slice(2);

    // We need to get the template to use its id
    let template = resolveTemplateByLocationArray(
      errorsFromBackend[i].location,
      nodes,
    );

    // AP: Unfortunately we can't use document.getElementById in here
    // because our v-ifs remove the elements from the document, meaning
    // we would not find the elements from here.
    processedErrors.push({
      id: `${template.id}-${locationInTemplate.join("-")}`,
      message: errorsFromBackend[i].message
        ? errorsFromBackend[i].message
        : "Invalid - check error panel",
    });
  }

  canvasStore.setFormErrors(processedErrors);
}

export function applyErrorsToForm(errors) {
  if (!errors) return;

  for (let error of errors) {
    let element = document.getElementById(error.id);
    if (!element) continue;

    element.setAttribute("invalid-text", error.message);
    element.setAttribute("invalid", true);
  }
}
