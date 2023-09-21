<template>
  <bx-modal open>
    <bx-modal-header>
      <bx-modal-close-button></bx-modal-close-button>
      <bx-modal-heading>{{ title }}</bx-modal-heading>
    </bx-modal-header>
    <bx-modal-body>
      <div>
        <componentForm
          @updateDefinition="setBlockDefinition"
          :formEmitted="formEmitted"
        />
      </div>
    </bx-modal-body>
    <bx-modal-footer>
      <bx-modal-footer-button kind="secondary" data-modal-close
        >Cancel</bx-modal-footer-button
      >
      <bx-modal-footer-button
        kind="primary"
        type="submit"
        @click="toggleFormEmit"
        >Submit</bx-modal-footer-button
      >
    </bx-modal-footer>
  </bx-modal>
</template>

<script>
import componentForm from "@/Canvas/componentForm.vue";

export default {
  components: { componentForm },
  props: { title: String },
  emits: ["addedNode"],
  data() {
    return {
      WFName: "",
      WFNumParams: 1,
      WFNumSteps: 1,
      WFParameters: [{ name: "", default: "" }],
      WFStepNames: [],
      WFClassName: [],
      WFNumArg: [1, 1],
      WFArgDefs: [[]],
      WFArgNames: [[]],
      WFTarget: [],
      formEmitted: false,
    };
  },
  watch: {
    WFNumSteps(newVal) {
      for (let i = 1; i < newVal; i++) {
        this.WFArgDefs.push([]);
        this.WFArgNames.push([]);
        this.WFNumArg.push(1);
      }
    },

    WFNumParams(newVal) {
      for (let i = 1; i < newVal; i++) {
        this.WFParameters.push({});
      }
    },

    WFStepNames(newVal) {
      for (let i = 0; i < this.WFNumSteps.value; i++) {
        if (this.WFTarget[i] == undefined) {
          this.WFTarget.splice(i, 0, newVal[i]);
        } else {
          this.WFTarget.splice(i, 1, newVal[i]);
        }
      }
    },
  },
  methods: {
    toggleFormEmit() {
      this.formEmitted = true;
    },

    getWFDefinition() {
      let signature = this.getWFSignature();
      let execute = this.getWFExecutables();
      let steps = this.getWFSteps();
      let definition = { signature: signature, execute: execute, steps: steps };
      return definition;
    },
    getWFSignature() {
      let WFParametersValid = [];
      for (let i = 0; i < this.WFNumParams; i++) {
        let obj = this.WFParameters[i];
        let validatedParams = this.removeEmptyString(obj);
        WFParametersValid.push(validatedParams);
      }
      let signature = { name: this.WFName, parameters: WFParametersValid };
      return signature;
    },
    removeEmptyString(obj) {
      Object.keys(obj).forEach((k) => obj[k] === "" && delete obj[k]);
      return obj;
    },
    getWFSteps() {
      let steps = {};
      for (let i in this.WFStepNames) {
        Object.assign(steps, { [this.WFStepNames[i]]: this.WFClassName[i] });
      }
      return steps;
    },
    getWFExecutables() {
      let execute = [];
      for (let i = 0; i < this.WFStepNames.length; i++) {
        let WFArgs = {};
        let WFExecutable = {};
        for (let j = 0; j < this.WFNumArg[i + 1]; j++) {
          Object.assign(WFArgs, {
            [this.WFArgNames[i][j]]: this.WFArgDefs[i][j],
          });
        }
        Object.assign(WFExecutable, {
          target: `<${this.WFStepNames[i]}>`,
          args: WFArgs,
        });
        execute.push(WFExecutable);
      }
      return execute;
    },
    setBlockDefinition(emittedDefinition) {
      let setDefinition = {};
      this.formEmitted = false;
      setDefinition.name = emittedDefinition.name;
      setDefinition.command = emittedDefinition.command;
      setDefinition.stage = emittedDefinition.stage;
      setDefinition.variables = emittedDefinition.variables;
      setDefinition.references = emittedDefinition.references;
      setDefinition.workflowAttributes = emittedDefinition.workflowAttributes;
      Object.defineProperty(setDefinition, "resourceManager", {
        value: {},
        writable: true,
      });
      Object.defineProperties(setDefinition.resourceManager, {
        config: {
          value: emittedDefinition.config,
        },
        lsf: {
          value: emittedDefinition.lsf,
        },
        kubernetes: {
          value: emittedDefinition.kubernetes,
        },
      });
      setDefinition.resourceRequest = emittedDefinition.resourceRequest;
      setDefinition.signature = emittedDefinition.signature;

      this.addNewNode(setDefinition);
    },
    addNewNode(setDefinition) {
      //the new node card's properties here
      let addedNode = {
        id: "1",
        label: setDefinition.name,
        type: "",
        definition: setDefinition,
      };
      this.$emit("addedNode", addedNode);
    },
  },
};
</script>
