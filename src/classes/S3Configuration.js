export default class S3Configuration {
  constructor(name, endpoint, bucket, accessKey, secretAccessKey, region) {
    this.id = crypto.randomUUID();
    this.name = name;
    this.endpoint = endpoint;
    this.bucket = bucket;
    this.accessKey = accessKey;
    this.secretAccessKey = secretAccessKey;
    this.region = region;
  }

  isValid() {
    // Simply having this.name && this.endpoint was returning weird results
    let nameIsValid = this.name != undefined && this.name.trim() != "";
    let endpointIsValid =
      this.endpoint != undefined && this.endpoint.trim() != "";
    let bucketIsValid = this.bucket != undefined && this.bucket.trim() != "";
    let accessKeyIsValid =
      this.accessKey != undefined && this.accessKey.trim() != "";
    let secretAccessKeyIsValid =
      this.secretAccessKey != undefined && this.secretAccessKey.trim() != "";
    return (
      nameIsValid &&
      endpointIsValid &&
      bucketIsValid &&
      accessKeyIsValid &&
      secretAccessKeyIsValid
    );
  }

  clone() {
    // deep clone does not work on Classes
    return Object.assign(Object.create(Object.getPrototypeOf(this)), this);
  }
}
