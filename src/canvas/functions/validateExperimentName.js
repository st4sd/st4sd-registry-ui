export function validateExperimentName(experimentName) {
  let pattern =
    /^[a-z0-9]([-a-z0-9]*[a-z0-9])?(\\.[a-z0-9]([-a-z0-9]*[a-z0-9])?)*$/g;
  return pattern.exec(experimentName) === null ? true : false;
}
