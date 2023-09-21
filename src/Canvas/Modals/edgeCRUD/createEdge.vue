<template>
  <bx-modal open class="no-transform">
    <bx-modal-header>
      <bx-modal-close-button></bx-modal-close-button>
      <bx-modal-heading>Create new connection</bx-modal-heading>
    </bx-modal-header>
    <bx-modal-body v-if="newEdge != undefined">
      <bx-input
        placeholder="Label"
        colorScheme="light"
        @input="newEdge.label = $event.target.value"
        :value="newEdge.label"
      >
        <!-- eslint-disable-next-line vue/no-deprecated-slot-attribute -->
        <span slot="label-text">Connection label:</span>
        <!-- eslint-disable-next-line vue/no-deprecated-slot-attribute -->
        <span slot="helper-text">optional</span>
      </bx-input>
      <br />
      <bx-input
        placeholder="Source node"
        colorScheme="light"
        readonly
        :value="sourceNode.label + '(' + sourceNode.id + ')'"
      >
        <!-- eslint-disable-next-line vue/no-deprecated-slot-attribute -->
        <span slot="label-text">Source {{ sourceType }}: </span>
      </bx-input>
      <br />
      <h5>Arguments ({{ argumentsArray.length }})</h5>

      <bx-structured-list v-if="sourceType == 'workflow'">
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
            v-for="(argument, index) in argumentsArray"
            :key="index"
          >
            <bx-structured-list-cell>
              <bx-dropdown
                trigger-content="Select an argument"
                required
                colorScheme="light"
                :value="argument.name"
                @bx-dropdown-selected="argument.name = $event.target.value"
              >
                <bx-dropdown-item
                  v-for="(possibleArgument, key) in possibleArguments"
                  :key="key"
                  :value="possibleArgument"
                  >{{ possibleArgument }}</bx-dropdown-item
                >
              </bx-dropdown>
            </bx-structured-list-cell>
            <bx-structured-list-cell
              class="structured-list-delete-button-bottom"
            >
              <bx-dropdown
                trigger-content="Select a value"
                required
                colorScheme="light"
                :value="argument.value"
                @bx-dropdown-selected="argument.value = $event.target.value"
              >
                <bx-dropdown-item
                  v-for="(possibleValue, key) in possibleArgumentValues"
                  :key="key"
                  :value="possibleValue.name"
                  >{{ possibleValue.name }}</bx-dropdown-item
                >
              </bx-dropdown>
            </bx-structured-list-cell>
            <bx-structured-list-cell
              class="structured-list-delete-button-bottom"
            >
              <bx-btn
                class="button-inside-cell"
                kind="danger"
                v-if="argumentsArray.length > 1"
                @click="removeArgument(index)"
              >
                <img class="trash-can-icon" src="@/assets/trash-can.svg" />
              </bx-btn>
            </bx-structured-list-cell>
          </bx-structured-list-row>
        </bx-structured-list-body>
        <bx-btn kind="primary" @click="addArgument()"> Add </bx-btn>
      </bx-structured-list>

      <bx-structured-list v-if="sourceType == 'component'">
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
            v-for="(argument, index) in argumentsArray"
            :key="index"
          >
            <bx-structured-list-cell
              class="structured-list-delete-button-bottom"
            >
              <!-- helper text is done in this way to ensure the dropdown box aligns with the input -->
              <bx-dropdown
                helper-text=" "
                trigger-content="Select an argument"
                required
                colorScheme="light"
                :value="argument.name"
                @bx-dropdown-selected="argument.name = $event.target.value"
              >
                <bx-dropdown-item
                  v-for="(possibleArgument, key) in possibleArguments"
                  :key="key"
                  :value="possibleArgument"
                  >{{ possibleArgument }}</bx-dropdown-item
                >
              </bx-dropdown>
            </bx-structured-list-cell>
            <bx-structured-list-cell>
              <bx-input
                colorScheme="light"
                :value="argument.value"
                @input="argument.value = $event.target.value"
                required
                placeholder="Argument value"
              >
              </bx-input>
            </bx-structured-list-cell>
            <bx-structured-list-cell
              class="structured-list-delete-button-bottom"
            >
              <bx-btn
                class="button-inside-cell"
                kind="danger"
                v-if="argumentsArray.length > 1"
                @click="removeArgument(index)"
              >
                <img class="trash-can-icon" src="@/assets/trash-can.svg" />
              </bx-btn>
            </bx-structured-list-cell>
          </bx-structured-list-row>
        </bx-structured-list-body>
        <bx-btn kind="primary" @click="addArgument()"> Add </bx-btn>
      </bx-structured-list>
    </bx-modal-body>
    <bx-modal-footer>
      <bx-modal-footer-button kind="secondary" data-modal-close
        >Cancel</bx-modal-footer-button
      >
      <bx-modal-footer-button kind="primary" type="submit" @click="create"
        >Save</bx-modal-footer-button
      >
    </bx-modal-footer>
  </bx-modal>
</template>

<script>
import "@carbon/web-components/es/components/modal/index.js";
import "@carbon/web-components/es/components/button/index.js";
import "@carbon/web-components/es/components/input/index.js";
import "@carbon/web-components/es/components/dropdown/index.js";
import {
  getPossibleArgumentNames,
  getEdgeSourceAndInitialiseArguments,
} from "@/Canvas/modalFunctions";
export default {
  props: {
    edgeProp: Object,
    allNodes: Object,
    allEdges: Object,
  },
  emits: ["finished"],
  data() {
    return {
      newEdge: {},
      sourceNode: {},
      sourceType: "",
      argumentsArray: [],
      possibleArguments: [],
      possibleArgumentValues: [],
    };
  },
  mounted() {
    let result = getEdgeSourceAndInitialiseArguments(
      this.allNodes,
      this.edgeProp,
    );
    this.sourceNode = result.sourceNode;
    this.sourceType = result.sourceType;
    this.argumentsArray = result.argumentsArray;
    this.newEdge = { ...this.edgeProp };
    this.possibleArguments = getPossibleArgumentNames(
      this.edgeProp,
      this.allNodes,
      this.allEdges,
    );
    this.possibleArgumentValues = [
      ...this.sourceNode.definition.signature.parameters,
    ];
  },
  methods: {
    addArgument() {
      if (this.sourceType == "workflow") {
        this.argumentsArray.push({
          name: "",
          //set a default value so this can never be saved empty
          //work around untill we can enforce a choice in the dropdown
          value: this.possibleArgumentValues[0].name,
        });
      } else {
        this.argumentsArray.push({
          name: "",
          value: "",
        });
      }
    },
    removeArgument(index) {
      this.argumentsArray.splice(index, 1);
    },
    create() {
      let uniqueArguments = new Set(this.argumentsArray.map((x) => x.name));
      let newEdgeDefinition = {};
      if (this.argumentsArray.length != uniqueArguments.size) {
        alert("Please make sure argument names are unique");
      } else {
        if (this.sourceType == "workflow") {
          this.argumentsArray.map(
            (x) => (newEdgeDefinition[x.name] = `%(${x.value})s`),
          );
        } else {
          this.argumentsArray.map((x) => {
            newEdgeDefinition[x.name] = x.value;
            // newEdgeDefinition[x.name] = `<${this.sourceNode.id}>:${x.method}`;
            // if (x.fileName != undefined) {
            //   x.fileName = x.fileName.trim();
            //   if (x.fileName != "") {
            //     newEdgeDefinition[
            //       x.name
            //     ] = `<${this.sourceNode.id}/${x.fileName}>:${x.method}`;
            //   }
            // }
          });
        }
      }
      this.newEdge.definition = newEdgeDefinition;
      this.$emit("finished", this.newEdge);
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
