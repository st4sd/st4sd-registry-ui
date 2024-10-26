export default class S3Configuration {
  constructor(name, endpoint, accessKey, secretAccessKey, region) {
    this.id = crypto.randomUUID();
    this.name = name;
    this.endpoint = endpoint;
    this.accessKey = accessKey;
    this.secretAccessKey = secretAccessKey;
    this.region = region;
  }

  isValid() {
    // Simply having this.name && this.endpoint was returning weird results
    let nameIsValid = this.name != undefined && this.name.trim() != "";
    let endpointIsValid =
      this.endpoint != undefined && this.endpoint.trim() != "";
    return nameIsValid && endpointIsValid;
  }

  clone() {
    // deep clone does not work on Classes
    return Object.assign(Object.create(Object.getPrototypeOf(this)), this);
  }
}
