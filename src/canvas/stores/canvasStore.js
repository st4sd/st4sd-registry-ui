import { reactive } from "vue";

export const canvasStore = reactive({
  node: {},
  DAG: {},
  PVEP: {},
  graph: JSON.parse(window.localStorage.getItem("graph")) || {},
  dsl: JSON.parse(window.localStorage.getItem("dsl")) || {},

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
    window.localStorage.setItem("graph", JSON.stringify(obj));
    this.graph = JSON.parse(window.localStorage.getItem("graph"));
  },
  setDsl(obj) {
    window.localStorage.setItem("dsl", JSON.stringify(obj));
    this.dsl = JSON.parse(window.localStorage.getItem("dsl"));
  },
});
