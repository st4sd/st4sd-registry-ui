import { reactive } from "vue";

export const canvasStore = reactive({
  dsl: {},
  exportedNode: {},
  exportedDag: {},
  dag: {},
  setDsl(obj) {
    this.dsl = obj;
  },
  setExportedNode(obj) {
    this.exportedNode = obj;
  },
  setExportedDag(obj) {
    this.exportedDag = obj;
  },
  setDag(obj) {
    this.dag = obj;
  },
});
