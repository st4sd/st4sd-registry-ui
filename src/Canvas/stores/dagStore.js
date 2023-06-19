import { reactive } from "vue";

export const dagStore = reactive({
  DAG: {},
  setDAG(obj) {
    this.DAG = obj;
  },
});
