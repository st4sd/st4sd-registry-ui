import { reactive } from "vue";

export const nodeStore = reactive({
  exportedNode: {},
  setExportedNode(obj) {
    this.exportedNode = obj;
  },
});
