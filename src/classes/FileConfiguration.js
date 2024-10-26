export class FileConfiguration {
  constructor() {}
}

export class FileConfigurationFromUpload extends FileConfiguration {
  constructor(file) {
    super();
    this.file = file;
  }
}

export class FileConfigurationFromS3 extends FileConfiguration {
  constructor(endpointId, uri) {
    super();
    this.endpointId = endpointId;
    this.uri = uri;
  }
}
