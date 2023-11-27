import { reactive } from "vue";
import getValueForEnvVar from "@/functions/get_value_for_env_var";

export const registryUISharedState = reactive({
  settings: {},
  isGlobalRegistry: true,
  isCanvasDisabled: true,
  isBuildCanvasEnabled: false,
  isParameterisationEnabled: false,
  isRunExperimentEnabled: false,
  isGlobalRegistryLibraryEnabled: false,
  isBuildCanvasEditingEnabled: false,
  isLocalGraphsLibraryWriteAccessEnabled: false,

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
    this.setIsGlobalRegistryLibraryEnabled(
      !this.isCanvasDisabled &&
        getValueForEnvVar(
          "ST4SD_REGISTRY_UI_SETTINGS_ENABLE_GLOBAL_REGISTRY_LIBRARY",
          obj,
        ) == "yes",
    );
    this.setIsBuildCanvasEditingEnabled(
      getValueForEnvVar(
        "ST4SD_REGISTRY_UI_SETTINGS_ENABLE_BUILD_CANVAS_EDITING",
        obj,
      ) == "yes",
    );
    this.setIsLocalGraphsLibraryWriteAccessEnabled(
      getValueForEnvVar(
        "ST4SD_REGISTRY_UI_SETTINGS_ENABLE_LOCAL_GRAPHS_LIBRARY_WRITE_ACCESS",
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
  setIsBuildCanvasEditingEnabled(obj) {
    this.isBuildCanvasEditingEnabled = obj;
  },
  setIsParameterisationEnabled(obj) {
    this.isParameterisationEnabled = obj;
  },
  setIsRunExperimentEnabled(obj) {
    this.isRunExperimentEnabled = obj;
  },
  setIsGlobalRegistryLibraryEnabled(obj) {
    this.isGlobalRegistryLibraryEnabled = obj;
  },
  setIsLocalGraphsLibraryWriteAccessEnabled(obj) {
    this.isLocalGraphsLibraryWriteAccessEnabled = obj;
  },
});
