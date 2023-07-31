import axios from "axios";

export default async function getSettings(origin) {
  let settings = {};
  await axios
    .get(origin + "/registry-ui/backend/settings/", {
      signal: AbortSignal.timeout(500),
    })
    .then((response) => {
      settings = response.data;
    });
  return settings;
}
