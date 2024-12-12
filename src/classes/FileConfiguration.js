import readFile from "@/functions/read_file";
import { tearsheetsSharedState } from "@/stores/experimentTearsheetSharedState.js";

export class FileConfiguration {
  constructor() {}
}

export class FileConfigurationFromUpload extends FileConfiguration {
  constructor(file) {
    super();
    this.file = file;
  }

  async toInputsPayload(key) {
    let result = await readFile(this.file);
    return {
      content: result,
      filename: key,
    };
  }
}

export class FileConfigurationFromS3 extends FileConfiguration {
  constructor(endpointId, uri) {
    super();
    this.endpointId = endpointId;
    this.uri = uri;
  }

  toInputsPayload(originalFileName) {
    let s3UriGroups = tearsheetsSharedState.s3UriRegex.exec(this.uri);
    let path = s3UriGroups.groups.path ? `${s3UriGroups.groups.path}/` : "";
    let file = s3UriGroups.groups.file;
    let filename = path + file;
    if (s3UriGroups.groups.file != originalFileName) {
      filename += `:${originalFileName}`;
    }
    return {
      filename,
    };
  }
}

export class FileConfigurationFromPVC extends FileConfiguration {
  constructor(pvcId, pvcName, fileName, subPath) {
    super();
    this.pvcId = pvcId;
    this.pvcName = pvcName;
    this.fileName = fileName;
    this.subPath = subPath;
    this.volumeID = crypto.randomUUID();
  }

  toInputsPayload(originalFileName) {
    let filename = this.fileName;
    if (filename != originalFileName) {
      filename += `:${originalFileName}`;
    }
    return {
      filename,
      volume: this.volumeID,
    };
  }

  toVolumesPayload() {
    return {
      identifier: this.volumeID,
      type: {
        persistentVolumeClaim: this.pvcName,
      },
      subPath: this.subPath,
    };
  }
}

export class FileConfigurationFromDatashim extends FileConfiguration {
  constructor(datasetId, datasetName, fileName) {
    super();
    this.datasetId = datasetId;
    this.datasetName = datasetName;
    this.fileName = fileName;
  }

  toInputsPayload(originalFileName) {
    let filename = this.fileName;
    if (filename != originalFileName) {
      filename += `:${originalFileName}`;
    }
    return {
      filename,
    };
  }

  toDatashimDatasetPayload() {
    return {
      dataset: this.datasetName,
    };
  }
}
