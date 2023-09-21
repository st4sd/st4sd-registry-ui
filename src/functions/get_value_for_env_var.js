export default function getValueForEnvVar(envVar, obj) {
  if (envVar in obj) {
    return obj[envVar];
  }
  return undefined;
}
