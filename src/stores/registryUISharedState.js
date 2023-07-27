import { reactive } from "vue";

export const registryUISharedState = reactive({
  settings: {},
  isGlobalRegistry: true,
  isCanvasDisabled: true,
  isParameterisationEnabled: false,
  isRunExperimentEnabled: false,

  setSettings(obj) {
    this.settings = obj;
    this.setIsGlobalRegistry(
      "ST4SD_REGISTRY_UI_SETTINGS_IS_GLOBAL" in obj &&
        obj["ST4SD_REGISTRY_UI_SETTINGS_IS_GLOBAL"] == "yes",
    );
    this.setIsCanvasDisabled(
      "ST4SD_REGISTRY_UI_SETTINGS_DISABLE_CANVAS" in obj &&
        obj["ST4SD_REGISTRY_UI_SETTINGS_DISABLE_CANVAS"] == "yes",
    );
    this.setIsParameterisationEnabled(
      "ST4SD_REGISTRY_UI_SETTINGS_ENABLE_EDIT_PARAMETERISATION" in obj &&
        obj["ST4SD_REGISTRY_UI_SETTINGS_ENABLE_EDIT_PARAMETERISATION"] == "yes",
    );
    this.setIsRunExperimentEnabled(
      "ST4SD_REGISTRY_UI_SETTINGS_ENABLE_RUN_EXPERIMENT" in obj &&
        obj["ST4SD_REGISTRY_UI_SETTINGS_ENABLE_RUN_EXPERIMENT"] == "yes",
    );
  },
  setIsGlobalRegistry(obj) {
    this.isGlobalRegistry = obj;
  },

  setIsCanvasDisabled(obj) {
    this.isCanvasDisabled = obj;
  },

  setIsParameterisationEnabled(obj) {
    this.isParameterisationEnabled = obj;
  },

  setIsRunExperimentEnabled(obj) {
    this.isRunExperimentEnabled = obj;
  },
});
