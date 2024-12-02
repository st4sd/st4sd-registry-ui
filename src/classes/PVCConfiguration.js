export const pvcNameRegex = new RegExp(
  "^[a-z0-9]([-a-z0-9]*[a-z0-9])?(\.[a-z0-9]([-a-z0-9]*[a-z0-9])?)*$",
);

export const pvcInvalidString =
  "PVC Names must be unique, lowercase and contain only alphanumeric characters, '.' or '-'.\n" +
  "They must be less than 64 characters long and start with an alphanumeric character.\n" +
  "The regex used for validation is: [a-z0-9]([-a-z0-9]*[a-z0-9])?(\.[a-z0-9]([-a-z0-9]*[a-z0-9])?)*";

export class PVCConfiguration {
  constructor(name) {
    this.id = crypto.randomUUID();
    this.name = name;
  }

  isValid() {
    return (
      this.name != undefined &&
      pvcNameRegex.test(this.name) &&
      this.name.trim().length < 64
    );
  }

  clone() {
    // deep clone does not work on Classes
    return Object.assign(Object.create(Object.getPrototypeOf(this)), this);
  }
}
