import axios from "axios";

export default async function isGlobalRegistry(origin) {
  let isGlobalRegistry = false;
  await axios
    .get(origin + "/registry-ui/backend/settings/", {
      signal: AbortSignal.timeout(500),
    })
    .then((response) => {
      isGlobalRegistry =
        "ST4SD_REGISTRY_UI_SETTINGS_IS_GLOBAL" in response.data &&
        response.data["ST4SD_REGISTRY_UI_SETTINGS_IS_GLOBAL"] == "yes";
    });
  return isGlobalRegistry;
}
