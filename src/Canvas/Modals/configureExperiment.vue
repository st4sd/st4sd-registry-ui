<template>
  <bx-modal open>
    <bx-modal-header>
      <bx-modal-close-button></bx-modal-close-button>
      <bx-modal-heading data-modal-primary-focus
        >Configure experiment</bx-modal-heading
      >
    </bx-modal-header>
    <bx-modal-body>
      <bx-content-switcher
        value="entryPoint"
        size="sm"
        @bx-content-switcher-selected="
          contentSwitcherSelection = $event.target.value
        "
      >
        <bx-content-switcher-item value="entryPoint"
          >Entrypoint</bx-content-switcher-item
        >
        <bx-content-switcher-item value="inputs"
          >Inputs ({{ inputsArray.length }})</bx-content-switcher-item
        >
      </bx-content-switcher>
      <template v-if="contentSwitcherSelection == 'entryPoint'">
        <template v-if="Object.keys(entryPointSelectionNodes).length > 0">
          <br />
          <h5>Select entrypoint:</h5>
          <br />
          <bx-radio-button-group
            name="entryPointOptions"
            orientation="vertical"
            :value="selectedNodeId"
            @bx-radio-button-group-changed="
              selectedNodeId = $event.detail.value
            "
          >
            <template v-for="(node, i) in entryPointSelectionNodes" :key="i">
              <bx-radio-button
                :label-text="node.label + ' (' + node.id + ')'"
                :value="node.id"
              ></bx-radio-button>
            </template>
          </bx-radio-button-group>
        </template>
        <template v-else>
          <br />
          <h5>Please drop nodes into the canvas before making a selection</h5>
        </template>
      </template>
      <template v-if="contentSwitcherSelection == 'inputs'">
        <template v-if="selectedNodeId != ''">
          <bx-structured-list>
            <bx-structured-list-head>
              <bx-structured-list-header-row>
                <bx-structured-list-header-cell
                  >Name</bx-structured-list-header-cell
                >
                <bx-structured-list-header-cell
                  >Value</bx-structured-list-header-cell
                >
              </bx-structured-list-header-row>
            </bx-structured-list-head>
            <bx-structured-list-body>
              <bx-structured-list-row
                v-for="(input, index) in inputsArray"
                :key="index"
              >
                <bx-structured-list-cell>
                  <bx-input
                    placeholder="Input name"
                    :value="input.name"
                    @input="input.name = $event.target.value"
                    colorScheme="light"
                  >
                    <!-- eslint-disable-next-line vue/no-deprecated-slot-attribute  -->
                    <span slot="helper-text"
                      >Input names have to be unique</span
                    >
                  </bx-input>
                </bx-structured-list-cell>
                <bx-structured-list-cell>
                  <bx-input
                    placeholder="Input value"
                    :value="input.value"
                    @input="input.value = $event.target.value"
                    colorScheme="light"
                  >
                  </bx-input>
                </bx-structured-list-cell>
                <bx-structured-list-cell
                  class="structured-list-delete-button-middle"
                >
                  <bx-btn
                    class="button-inside-cell"
                    kind="danger"
                    @click="removeInput(index)"
                  >
                    <img class="trash-can-icon" src="@/assets/trash-can.svg" />
                  </bx-btn>
                </bx-structured-list-cell>
              </bx-structured-list-row>
            </bx-structured-list-body>
            <bx-btn kind="primary" @click="addInput()">Add</bx-btn>
          </bx-structured-list>
        </template>
        <template v-else>
          <br />
          <h5>Please select an entry point before adding inputs</h5>
        </template>
      </template>
    </bx-modal-body>
    <bx-modal-footer>
      <bx-modal-footer-button kind="secondary" data-modal-close
        >Cancel</bx-modal-footer-button
      >
      <bx-modal-footer-button kind="primary" type="submit" @click="update"
        >Save changes</bx-modal-footer-button
      >
    </bx-modal-footer>
  </bx-modal>
</template>

<script>
import { ref } from "vue";

export default {
  props: {
    allNodes: Object,
  },
  emits: ["update"],
  data() {
    return {
      contentSwitcherSelection: ref("entryPoint"),
      inputsArray: [],
      entryPointSelectionNodes: {},
      selectedNodeId: "",
    };
  },
  mounted() {
    this.entryPointSelectionNodes = this.allNodes.filter(
      (node) => node.type == "workflow",
    );
    let entryNode = this.allNodes.find((node) => node.isEntry == true);
    if (entryNode != undefined) {
      this.selectedNodeId = entryNode.id;
      this.inputsArray = entryNode.inputs;
    }
  },
  methods: {
    update() {
      this.entryPointSelectionNodes.forEach((node) => {
        node.isEntry = false;
        node["input"] = [];
      });
      let entryNode = this.allNodes.find(
        (node) => node.id == this.selectedNodeId,
      );
      if (entryNode != undefined) {
        entryNode.isEntry = true;
        entryNode["inputs"] = this.inputsArray;
      }
      this.$emit("update");
    },
    addInput() {
      this.inputsArray.push({
        name: "",
        value: "",
      });
    },
    removeInput(index) {
      this.inputsArray.splice(index, 1);
    },
  },
};
</script>
<style lang="css" scoped>
@import "@/styles/delete-button-icon-inside-cell-style.css";
@import "@/styles/bx-structured-list-styles.css";
@import "@/styles/bx-accordion-styles.css";
@import "@/styles/bx-modal-styles.css";
</style>
