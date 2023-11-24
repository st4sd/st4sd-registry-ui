import { reactive } from "vue";

export const canvasStore = reactive({
  node: {},
  DAG: {},
  pvep: JSON.parse(window.sessionStorage.getItem("pvep")) || {},
  graph: JSON.parse(window.sessionStorage.getItem("graph")) || {},
  dsl: JSON.parse(window.sessionStorage.getItem("dsl")) || {},

  setNode(obj) {
    this.node = obj;
  },
  setDAG(obj) {
    this.DAG = obj;
  },
  setPVEP(obj) {
    window.sessionStorage.setItem("pvep", JSON.stringify(obj));
    this.pvep = JSON.parse(window.sessionStorage.getItem("pvep"));
  },
  clearPVEP() {
    window.sessionStorage.removeItem("pvep");
    this.pvep = {};
  },
  setGraph(obj) {
    window.sessionStorage.setItem("graph", JSON.stringify(obj));
    this.graph = JSON.parse(window.sessionStorage.getItem("graph"));
  },
  clearGraph() {
    window.sessionStorage.removeItem("graph");
    this.graph = {};
  },
  setDsl(obj) {
    window.sessionStorage.setItem("dsl", JSON.stringify(obj));
    this.dsl = JSON.parse(window.sessionStorage.getItem("dsl"));
  },
  clearDsl() {
    window.sessionStorage.removeItem("dsl");
    this.dsl = {};
  },
});
