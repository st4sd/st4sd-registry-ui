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

  async toPayload(key) {
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

  toPayload(originalFileName) {
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
