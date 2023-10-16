import { reactive } from "vue";

export const canvasStore = reactive({
  node: {},
  DAG: {},
  PVEP: {},
  graph: {},

  setNode(obj) {
    this.node = obj;
  },
  setDAG(obj) {
    this.DAG = obj;
  },
  setPVEP(obj) {
    this.PVEP = obj;
  },
  setGraph(obj) {
    this.graph = obj;
  },
});
