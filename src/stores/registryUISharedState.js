import { reactive } from "vue";
import getValueForEnvVar from "@/functions/get_value_for_env_var";

export const registryUISharedState = reactive({
  settings: {},
  isGlobalRegistry: true,
  isCanvasDisabled: true,
  isBuildCanvasEnabled: false,
  isParameterisationEnabled: false,
  isRunExperimentEnabled: false,

  setSettings(obj) {
    this.settings = obj;
    this.setIsGlobalRegistry(
      getValueForEnvVar("ST4SD_REGISTRY_UI_SETTINGS_IS_GLOBAL", obj) == "yes",
    );
    this.setIsCanvasDisabled(
      getValueForEnvVar("ST4SD_REGISTRY_UI_SETTINGS_DISABLE_CANVAS", obj) ==
        "yes",
    );
    this.setIsParameterisationEnabled(
      getValueForEnvVar(
        "ST4SD_REGISTRY_UI_SETTINGS_ENABLE_EDIT_PARAMETERISATION",
        obj,
      ) == "yes",
    );
    this.setIsRunExperimentEnabled(
      getValueForEnvVar(
        "ST4SD_REGISTRY_UI_SETTINGS_ENABLE_RUN_EXPERIMENT",
        obj,
      ) == "yes",
    );
    this.setIsBuildCanvasEnabled(
      !this.isCanvasDisabled &&
        getValueForEnvVar(
          "ST4SD_REGISTRY_UI_SETTINGS_ENABLE_BUILD_CANVAS",
          obj,
        ) == "yes",
    );
  },
  setIsGlobalRegistry(obj) {
    this.isGlobalRegistry = obj;
  },
  setIsCanvasDisabled(obj) {
    this.isCanvasDisabled = obj;
  },
  setIsBuildCanvasEnabled(obj) {
    this.isBuildCanvasEnabled = obj;
  },
  setIsParameterisationEnabled(obj) {
    this.isParameterisationEnabled = obj;
  },
  setIsRunExperimentEnabled(obj) {
    this.isRunExperimentEnabled = obj;
  },
});
