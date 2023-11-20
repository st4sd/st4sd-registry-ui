import { reactive } from "vue";

export const canvasStore = reactive({
  node: {},
  DAG: {},
  PVEP: JSON.parse(window.localStorage.getItem("pvep")) || {},
  graph: JSON.parse(window.localStorage.getItem("graph")) || {},
  dsl: JSON.parse(window.localStorage.getItem("dsl")) || {},

  setNode(obj) {
    this.node = obj;
  },
  setDAG(obj) {
    this.DAG = obj;
  },
  setPVEP(obj) {
    window.localStorage.setItem("pvep", JSON.stringify(obj));
    this.pvep = JSON.parse(window.localStorage.getItem("pvep"));
  },
  clearPVEP() {
    window.localStorage.removeItem("pvep");
    this.pvep = {};
  },
  setGraph(obj) {
    window.localStorage.setItem("graph", JSON.stringify(obj));
    this.graph = JSON.parse(window.localStorage.getItem("graph"));
  },
  clearGraph() {
    window.localStorage.removeItem("graph");
    this.graph = {};
  },
  setDsl(obj) {
    window.localStorage.setItem("dsl", JSON.stringify(obj));
    this.dsl = JSON.parse(window.localStorage.getItem("dsl"));
  },
  clearDsl() {
    window.localStorage.removeItem("dsl");
    this.dsl = {};
  },
});
