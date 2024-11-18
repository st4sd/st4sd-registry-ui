import { reactive } from "vue";
import {
  FileConfiguration,
  FileConfigurationFromUpload,
  FileConfigurationFromS3,
} from "@/classes/FileConfiguration.js";

export const tearsheetsSharedState = reactive({
  files: new Map(),
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
    return experimentPayload;
  },

  async generatePayloadInputs() {
    let inputsPayload = [];
    for (let [key, value] of this.files.entries()) {
      let payload = await value.toPayload(key);
      inputsPayload.push(payload);
    }
    return inputsPayload;
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

  clear() {
    this.files = new Map();
    this.s3Endpoints = [];
    this.s3References = new Map();
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

  addS3Endpoint(s3Configuration) {
    this.s3Endpoints.push(s3Configuration);
    this.s3References.set(s3Configuration.id, new Set());
  },

  removeS3EndpointByIndex(index) {
    let id = this.s3Endpoints[index].id;
    this.s3Endpoints.splice(index, 1);
    this.s3References.delete(id);
  },

  findS3EndpointById(id) {
    return this.s3Endpoints.find((endpoint) => endpoint.id == id);
  },

  setConfigurationForFile(name, fileConfiguration) {
    this.files.set(name, fileConfiguration);
    if (fileConfiguration instanceof FileConfigurationFromS3) {
      this.s3References.get(fileConfiguration.endpointId).add(name);
    }
  },

  removeConfigurationForFile(fileName) {
    this.deleteS3Reference(fileName);
    this.files.delete(fileName);
  },

  getFileReferencesForS3Endpoint(id) {
    return this.s3References.get(id);
  },

  checkS3ReferenceIsEmpty(id) {
    return getFileReferencesForS3Endpoint(id).size == 0;
  },

  deleteS3Reference(fileName) {
    let fileConfiguration = this.files.get(fileName);
    if (fileConfiguration instanceof FileConfigurationFromS3) {
      this.s3References.get(fileConfiguration.endpointId).delete(fileName);
    }
  },
});
