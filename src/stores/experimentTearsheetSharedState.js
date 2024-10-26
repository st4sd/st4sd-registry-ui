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

  addS3Endpoint(s3Configuration) {
    this.s3Endpoints.push(s3Configuration);
    this.s3References.set(s3Configuration.id, new Set());
  },

  removeS3EndpointByIndex(index) {
    let id = this.s3Endpoints[index].id;
    this.s3Endpoints.splice(index, 1);
    this.s3References.delete(id);
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
