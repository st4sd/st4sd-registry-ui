import { reactive } from "vue";

export const registryUISharedState = reactive({
  isGlobalRegistry: true,
  setIsGlobalRegistry(obj) {
    this.isGlobalRegistry = obj;
  },
});
