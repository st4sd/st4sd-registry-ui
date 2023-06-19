import { reactive } from "vue";

export const registryUISharedState = reactive({
  settings: {},
  isGlobalRegistry: true,
  isCanvasDisabled: true,

  setSettings(obj) {
    this.settings = obj;
    this.setIsGlobalRegistry(
      "ST4SD_REGISTRY_UI_SETTINGS_IS_GLOBAL" in obj &&
        obj["ST4SD_REGISTRY_UI_SETTINGS_IS_GLOBAL"] == "yes"
    );
    this.setIsCanvasDisabled(
      "ST4SD_REGISTRY_UI_SETTINGS_DISABLE_CANVAS" in obj &&
        obj["ST4SD_REGISTRY_UI_SETTINGS_DISABLE_CANVAS"] == "yes"
    );
  },
  setIsGlobalRegistry(obj) {
    this.isGlobalRegistry = obj;
  },

  setIsCanvasDisabled(obj) {
    this.isCanvasDisabled = obj;
  },
});
