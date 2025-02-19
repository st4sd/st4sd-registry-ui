import { reactive } from "vue";

export const canvasStore = reactive({
  node: null,
  DAG: {},
  pvep: JSON.parse(window.sessionStorage.getItem("pvep")) || {},
  graph: JSON.parse(window.sessionStorage.getItem("graph")) || {},
  dsl: JSON.parse(window.sessionStorage.getItem("dsl")) || {},
  latestValidatedDsl:
    JSON.parse(window.localStorage.getItem("latestValidatedDsl")) || {},
  validateDslAutomatically:
    JSON.parse(window.localStorage.getItem("dslAutoValidation")) || true,
  formErrors: JSON.parse(window.localStorage.getItem("formErrors")) || [],

  setAutomaticDslValidation(obj) {
    window.localStorage.setItem("dslAutoValidation", JSON.stringify(obj));
    this.validateDslAutomatically = JSON.parse(
      window.localStorage.getItem("dslAutoValidation"),
    );
  },
  setFormErrors(arr) {
    this.formErrors = arr;
  },
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
  setLatestValidatedDsl(obj) {
    window.localStorage.setItem("latestValidatedDsl", JSON.stringify(obj));
    this.latestValidatedDsl = JSON.parse(
      window.localStorage.getItem("latestValidatedDsl"),
    );
  },
  clearDsl() {
    window.sessionStorage.removeItem("dsl");
    this.dsl = {};
  },
});
