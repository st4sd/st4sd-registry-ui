import { reactive } from "vue";

import S3Configuration from "@/classes/S3Configuration";
import { PVCConfiguration } from "@/classes/PVCConfiguration";
import {
  FileConfigurationFromS3,
  FileConfigurationFromPVC,
} from "@/classes/FileConfiguration.js";

function loadFromLocalStorage(key) {
  let storedItems = JSON.parse(window.localStorage.getItem(key)) || [];
  let target_class;
  switch (key) {
    case "s3Configurations":
      target_class = S3Configuration;
      break;
    case "pvcConfigurations":
      target_class = PVCConfiguration;
      break;
    default:
      return;
  }
  for (let i = 0; i < storedItems.length; i++) {
    storedItems[i] = Object.assign(new target_class(), storedItems[i]);
  }
  return storedItems;
}

export const tearsheetsSharedState = reactive({
  files: new Map(),
  pvcConfigurations: loadFromLocalStorage("pvcConfigurations"),
  pvcReferences: new Map(),
  s3Configurations: loadFromLocalStorage("s3Configurations"),
  s3References: new Map(),
  s3UriRegex: new RegExp(
    "^s3://(?<bucket>[^/]+)/(?<path>.*?)/?(?<file>[^/]+)$",
    "i",
  ),

  initializeS3ReferencesSet() {
    for (let i = 0; i < this.s3Configurations.length; i++) {
      this.s3References.set(this.s3Configurations[i].id, new Set());
    }
  },

  initializePVCReferencesSet() {
    for (let i = 0; i < this.pvcConfigurations.length; i++) {
      this.pvcReferences.set(this.pvcConfigurations[i].name, new Set());
    }
  },

  async generateExperimentPayload(experiment) {
    let experimentPayload = {};
    if (experiment.parameterisation.executionOptions.variables.length > 0) {
      experimentPayload["variables"] = this.generatePayloadVariables(
        experiment.parameterisation.executionOptions.variables,
      );
    }
    experimentPayload["platform"] = this.generatePayloadPlatform(experiment);
    experimentPayload["inputs"] = await this.generatePayloadInputs();
    let s3Endpoint = this.getS3Endpoint();
    if (s3Endpoint) {
      experimentPayload["s3"] = s3Endpoint;
    }
    experimentPayload["volumes"] = this.generatePayloadVolumes();
    return experimentPayload;
  },

  async generatePayloadInputs() {
    let inputsPayload = [];
    for (let [key, value] of this.files.entries()) {
      let payload = await value.toInputsPayload(key);
      inputsPayload.push(payload);
    }
    return inputsPayload;
  },

  generatePayloadVolumes() {
    let volumePayload = [];
    for (let file of this.files.values()) {
      if (file instanceof FileConfigurationFromPVC) {
        volumePayload.push(file.toVolumesPayload());
      }
    }
    return volumePayload;
  },

  generatePayloadVariables(variables) {
    let variablesPayload = {};
    for (let exeOptVariable of variables) {
      if (exeOptVariable.value) {
        variablesPayload[exeOptVariable.name] = exeOptVariable.value;
      }
    }
    return variablesPayload;
  },

  generatePayloadPlatform(experiment) {
    return experiment.parameterisation.executionOptions?.selectedPlatform;
  },

  updateS3Endpoint(s3Configuration) {
    for (let i = 0; i < this.s3Configurations.length; i++) {
      if (this.s3Configurations[i].id == s3Configuration.id) {
        this.s3Configurations[i] = s3Configuration;
        window.localStorage.setItem(
          "s3Configurations",
          JSON.stringify(this.s3Configurations),
        );
        break;
      }
    }
  },

  updatePVCEndpoint(pvcConfiguration) {
    for (let i = 0; i < this.pvcConfigurations.length; i++) {
      if (this.pvcConfigurations[i].id == pvcConfiguration.id) {
        this.pvcConfigurations[i] = pvcConfiguration;
        window.localStorage.setItem(
          "pvcConfigurations",
          JSON.stringify(this.pvcConfigurations),
        );
      }
    }
  },

  clear() {
    this.files = new Map();
    this.s3References = new Map();
    this.pvcReferences = new Map();
  },

  getS3Endpoint() {
    if (this.s3References.size == 0) {
      return;
    }

    let endpointID = this.s3References.keys().next().value;
    let fileReferences = this.s3References.get(endpointID);
    if (fileReferences.size == 0) {
      return;
    }

    let endpoint = this.findS3EndpointById(endpointID);

    return {
      accessKeyID: endpoint.accessKey,
      secretAccessKey: endpoint.secretAccessKey,
      bucket: endpoint.bucket,
      endpoint: endpoint.endpoint,
      region: endpoint.region,
    };
  },

  getPVCEntry() {
    if (this.pvcReferences.size == 0) {
      return;
    }

    let pvcID = this.pvcReferences.keys().next().value;
    let fileReferences = this.pvcReferences.get(pvcID);
    if (fileReferences.size == 0) {
      return;
    }

    let entry = this.findPVCEntryById(pvcID);

    return {
      peristentVolumeClaim: entry.pvcName,
      subPath: entry.subPath,
    };
  },

  addS3Endpoint(s3Configuration) {
    this.s3Configurations.push(s3Configuration);
    this.s3References.set(s3Configuration.id, new Set());
    window.localStorage.setItem(
      "s3Configurations",
      JSON.stringify(this.s3Configurations),
    );
  },

  addPVCEntry(pvcConfiguration) {
    this.pvcConfigurations.push(pvcConfiguration);
    this.pvcReferences.set(pvcConfiguration.name, new Set());
    window.localStorage.setItem(
      "pvcConfigurations",
      JSON.stringify(this.pvcConfigurations),
    );
  },

  removeS3EndpointByIndex(index) {
    let id = this.s3Configurations[index].id;
    this.s3Configurations.splice(index, 1);
    this.s3References.delete(id);
    window.localStorage.setItem(
      "s3Configurations",
      JSON.stringify(this.s3Configurations),
    );
  },

  removePVCEntryByIndex(index) {
    let id = this.pvcConfigurations[index].id;
    this.pvcConfigurations.splice(index, 1);
    this.pvcReferences.delete(id);
    window.localStorage.setItem(
      "pvcConfigurations",
      JSON.stringify(this.pvcConfigurations),
    );
  },

  findS3EndpointById(id) {
    return this.s3Configurations.find((endpoint) => endpoint.id == id);
  },

  findPVCEntryById(id) {
    return this.pvcConfigurations.find((entry) => entry.id == id);
  },

  setConfigurationForFile(name, fileConfiguration) {
    this.files.set(name, fileConfiguration);
    if (fileConfiguration instanceof FileConfigurationFromS3) {
      this.s3References.get(fileConfiguration.endpointId).add(name);
    }
    if (fileConfiguration instanceof FileConfigurationFromPVC) {
      this.pvcReferences.get(fileConfiguration.pvcName).add(name);
    }
  },

  removeConfigurationForFile(fileName) {
    this.deleteReference(fileName);
    this.files.delete(fileName);
  },

  getFileReferencesForS3Endpoint(id) {
    return this.s3References.get(id);
  },

  getFileReferencesForPVCEntry(id) {
    return this.pvcReferences.get(id);
  },

  checkS3ReferenceIsEmpty(id) {
    return getFileReferencesForS3Endpoint(id).size == 0;
  },

  checkPVCReferenceIsEmpty(id) {
    return getFileReferencesForPVCEntry(id).size == 0;
  },

  deleteReference(fileName) {
    let fileConfiguration = this.files.get(fileName);
    if (fileConfiguration instanceof FileConfigurationFromS3) {
      this.s3References.get(fileConfiguration.endpointId).delete(fileName);
    }
    if (fileConfiguration instanceof FileConfigurationFromPVC) {
      this.pvcReferences.get(fileConfiguration.pvcName).delete(fileName);
    }
  },

  hasPVCWithName(name) {
    for (let entry of this.pvcConfigurations) {
      if (entry.name == name) {
        return false;
      }
    }
    return true;
  },
});
