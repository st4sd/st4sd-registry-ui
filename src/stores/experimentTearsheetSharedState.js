import { reactive } from "vue";
import {
  FileConfiguration,
  FileConfigurationFromUpload,
  FileConfigurationFromS3,
  FileConfigurationFromPVC,
} from "@/classes/FileConfiguration.js";

export const tearsheetsSharedState = reactive({
  files: new Map(),
  pvcEntries: [],
  pvcReferences: new Map(),
  s3Endpoints: [],
  s3References: new Map(),
  s3UriRegex: new RegExp(
    "^s3://(?<bucket>[^/]+)/(?<path>.*?)/?(?<file>[^/]+)$",
    "i",
  ),

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
    for (let i = 0; i < this.s3Endpoints.length; i++) {
      if (this.s3Endpoints[i].id == s3Configuration.id) {
        this.s3Endpoints[i] = s3Configuration;
      }
    }
  },

  updatePVCEndpoint(pvcConfiguration) {
    for (let i = 0; i < this.pvcEntries.length; i++) {
      if (this.pvcEntries[i].id == pvcConfiguration.id) {
        this.pvcEntries[i] = pvcConfiguration;
      }
    }
  },

  clear() {
    this.files = new Map();
    this.s3Endpoints = [];
    this.s3References = new Map();
    this.pvcEntries = [];
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
    this.s3Endpoints.push(s3Configuration);
    this.s3References.set(s3Configuration.id, new Set());
  },

  addPVCEntry(pvcConfiguration) {
    this.pvcEntries.push(pvcConfiguration);
    this.pvcReferences.set(pvcConfiguration.name, new Set());
  },

  removeS3EndpointByIndex(index) {
    let id = this.s3Endpoints[index].id;
    this.s3Endpoints.splice(index, 1);
    this.s3References.delete(id);
  },

  removePVCEntryByIndex(index) {
    let id = this.pvcEntries[index].id;
    this.pvcEntries.splice(index, 1);
    this.pvcReferences.delete(id);
  },

  findS3EndpointById(id) {
    return this.s3Endpoints.find((endpoint) => endpoint.id == id);
  },

  findPVCEntryById(id) {
    return this.pvcEntries.find((entry) => entry.id == id);
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
    for (let entry of this.pvcEntries) {
      if (entry.name == name) {
        return false;
      }
    }
    return true;
  },
});
