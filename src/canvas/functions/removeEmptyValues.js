export default function getDSLDefinition(definition) {
  if (definition.signature.parameters) {
    removeEmptyDefaultsFromParameters(definition.signature.parameters);
  }
  let dslDefinition = removeEmptyValues(definition);
  return dslDefinition;
}

//This is a function that loops into the component definition
//and removes empty arrays and values
function removeEmptyValues(object) {
  let output = {};
  Object.keys(object).forEach((key) => {
    //If the value is empty string skip it
    mainBlock: if (object[key] == "") {
      break mainBlock;
    }
    // If the value is an object and not an array or null
    // loop over the object and remove empty values
    else if (
      typeof object[key] === "object" &&
      object[key] !== null &&
      !Array.isArray(object[key])
    ) {
      let subOutput = removeEmptyValues(object[key]);
      //If the returned object is not empty,
      //add it to the overall output
      if (Object.keys(subOutput).length > 0) {
        output[key] = subOutput;
      }
    }
    //This condition of != "" also applies to arrays
    //if the array is empty [""] it will be == ""
    else if (object[key] != "") {
      output[key] = object[key];
    }
  });
  return output;
}
export function removeEmptyDefaultsFromParameters(parameters) {
  parameters = parameters.filter((parameter) => parameter.name.trim() != "");
  parameters.map((parameter) => {
    //Make sure the key exists
    if (parameter.default) {
      if (parameter.default.trim() == "") {
        delete parameter.default;
      }
    } else {
      delete parameter.default;
    }
  });
}
