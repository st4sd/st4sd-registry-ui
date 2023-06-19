import { reactive } from "vue";

export const expDAGStore = reactive({
  exportedDAG: {},
  setExportedDAG(obj) {
    this.exportedDAG = obj;
  },
});
