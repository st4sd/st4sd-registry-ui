<template>
  <bx-modal open class="no-transform">
    <bx-modal-header>
      <bx-modal-close-button></bx-modal-close-button>
      <bx-modal-heading data-modal-primary-focus
        >Configure how &lt;{{ targetNode.label }}&gt; consumes the outputs of
        &lt;{{ sourceNode.label }}&gt;</bx-modal-heading
      >
    </bx-modal-header>
    <bx-modal-body>
      <bx-input
        placeholder="Label"
        colorScheme="light"
        @input="edge.label = $event.target.value"
        :value="edge.label"
      >
        <!-- eslint-disable-next-line vue/no-deprecated-slot-attribute -->
        <span slot="label-text">Connection label:</span>
        <!-- eslint-disable-next-line vue/no-deprecated-slot-attribute -->
        <span slot="helper-text">optional</span>
      </bx-input>
      <br />
      <h5 v-if="edge.definition != undefined">Arguments:</h5>
      <bx-structured-list>
        <bx-structured-list-head>
          <bx-structured-list-header-row>
            <bx-structured-list-header-cell
              >Target</bx-structured-list-header-cell
            >
            <bx-structured-list-header-cell
              >Source</bx-structured-list-header-cell
            >
            <bx-structured-list-header-cell
              >Suffix</bx-structured-list-header-cell
            >
          </bx-structured-list-header-row>
        </bx-structured-list-head>
        <bx-structured-list-body v-if="sourceType == 'workflow'">
          <bx-structured-list-row
            v-for="(argument, index) in argumentsArray"
            :key="index"
          >
            <bx-structured-list-cell
              class="structured-list-delete-button-bottom"
            >
              <!-- helper text is done in this way to ensure the dropdown box aligns with the input -->
              <bx-dropdown
                class="updatedChoices"
                helper-text=" "
                trigger-content="Select target"
                required
                colorScheme="light"
                :value="argument.name"
                @bx-dropdown-selected="
                  argument.name = $event.target.value;
                  updateSelectedArguments();
                "
              >
                <bx-dropdown-item
                  v-for="(possibleArgument, key) in possibleArguments.filter(
                    (arg) =>
                      !selectedArguments.includes(arg) || arg == argument.name,
                  )"
                  :key="key"
                  :value="possibleArgument"
                  >{{ possibleArgument }}</bx-dropdown-item
                >
              </bx-dropdown>
            </bx-structured-list-cell>
            <bx-structured-list-cell
              class="structured-list-delete-button-bottom"
            >
              <!-- helper text is done in this way to ensure the dropdown box aligns with the input -->
              <bx-dropdown
                helper-text=" "
                trigger-content="Select source"
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
            <bx-structured-list-cell>
              <bx-input
                label-text="optional"
                colorScheme="light"
                :value="argument.extra"
                @input="argument.extra = $event.target.value"
                placeholder="e.g. :ref or /path:ref, etc"
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

        <bx-structured-list-body v-if="sourceType == 'component'">
          <bx-structured-list-row
            v-for="(argument, index) in argumentsArray"
            :key="index"
          >
            <bx-structured-list-cell
              class="structured-list-delete-button-bottom"
            >
              <!-- helper text is done in this way to ensure the dropdown box aligns with the input -->
              <bx-dropdown
                class="updatedChoices"
                helper-text=" "
                trigger-content="Select an argument"
                required
                colorScheme="light"
                :value="argument.name"
                @bx-dropdown-selected="
                  argument.name = $event.target.value;
                  updateSelectedArguments();
                "
              >
                <bx-dropdown-item
                  v-for="(possibleArgument, key) in possibleArguments.filter(
                    (arg) =>
                      !selectedArguments.includes(arg) || arg == argument.name,
                  )"
                  :key="key"
                  :value="possibleArgument"
                  >{{ possibleArgument }}</bx-dropdown-item
                >
              </bx-dropdown>
            </bx-structured-list-cell>
            <bx-structured-list-cell
              class="structured-list-delete-button-middle"
            >
              <h5 class="padding-top">
                {{ "<" + sourceNode.stepId + ">" }}
              </h5>
            </bx-structured-list-cell>
            <bx-structured-list-cell>
              <bx-input
                label-text="optional"
                colorScheme="light"
                :value="argument.value"
                @input="argument.value = $event.target.value"
                placeholder="e.g. /path:ref"
              />
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
      <br />
      <bx-btn kind="danger" @click="emitDelete">
        Delete this connection &nbsp;
        <img class="trash-can-icon" src="@/assets/trash-can.svg" />
      </bx-btn>
    </bx-modal-body>
    <bx-modal-footer>
      <bx-modal-footer-button kind="secondary" data-modal-close
        >Cancel</bx-modal-footer-button
      >
      <bx-modal-footer-button kind="primary" type="submit" @click="update"
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
  getEdgeSourceAndArguments,
} from "@/canvas/functions/modalFunctions";
export default {
  props: {
    edgeProp: Object,
    allNodes: Object,
    allEdges: Object,
  },
  emits: ["update", "delete"],
  data() {
    return {
      edge: "",
      sourceType: "",
      sourceNode: {},
      targetNode: {},
      argumentsArray: [],
      possibleArguments: [],
      selectedArguments: [],
      possibleArgumentValues: [],
    };
  },
  mounted() {
    this.edge = this.edgeProp;
    //Get the arguments possible values
    this.initialiseSourceNodeAndArguments();
    this.possibleArguments = getPossibleArgumentNames(
      this.edgeProp,
      this.allNodes,
      this.allEdges,
    );
    this.possibleArgumentValues = [
      ...this.sourceNode.definition.signature.parameters,
    ];
    this.selectedArguments = [...this.argumentsArray.map((arg) => arg.name)];
  },
  methods: {
    update() {
      //make sure the argument names are unique by adding them to
      //a Set which can only contain unique values
      let uniqueArguments = new Set(this.argumentsArray.map((x) => x.name));
      let newEdgeDefinition = {};
      if (this.argumentsArray.length != uniqueArguments.size) {
        alert("Please make sure argument names are unique");
      } else {
        if (this.sourceType == "workflow") {
          this.argumentsArray.map((x) => {
            x.name = x.name.trim();
            x.value = x.value.trim();
            if (x.name != "" && x.value != "") {
              newEdgeDefinition[x.name] = `%(${x.value})s`;
              x.extra = x.extra.trim();
              if (x.extra != "") {
                newEdgeDefinition[x.name] =
                  newEdgeDefinition[x.name] + `:${x.extra}`;
              }
            }
          });
        } else {
          this.argumentsArray.map((x) => {
            x.name = x.name.trim();
            if (x.name != "") {
              x.value = x.value.trim();
              let value = "<" + this.sourceNode.stepId + ">";
              if (x.value != "") {
                value = value + x.value;
              }
              newEdgeDefinition[x.name] = value;
            }
          });
        }
        this.edge.definition = newEdgeDefinition;
        this.$emit("update");
      }
    },
    emitDelete() {
      this.$emit("delete");
    },
    initialiseSourceNodeAndArguments() {
      let result = getEdgeSourceAndArguments(this.allNodes, this.edge);
      this.sourceNode = result.sourceNode;
      this.targetNode = result.targetNode;
      this.sourceType = result.sourceType;
      this.argumentsArray = result.argumentsArray;
    },
    addArgument() {
      this.updateSelectedArguments();
      this.argumentsArray.push({
        name: "",
        value: "",
        extra: "",
      });
    },
    removeArgument(index) {
      let name = this.argumentsArray[index].name;
      this.argumentsArray.splice(index, 1);
      //we update selectedArguments this way instead of calling updateSelectedArguments()
      //because getElementsByClassName("updatedChoices") in that function will not pick up
      //the removal of that element and the deletion of that argument row will not change selectedArguments
      if (name != undefined) {
        this.selectedArguments = this.selectedArguments.filter(
          (arg) => arg != name,
        );
      }
    },
    updateSelectedArguments() {
      this.selectedArguments = [];
      var elements = document.getElementsByClassName("updatedChoices");
      for (var element of elements) {
        this.selectedArguments.push(element.value);
      }
    },
  },
};
</script>

<style lang="css" scoped>
@import "@/styles/delete-button-icon-inside-cell-style.css";
@import "@/styles/bx-structured-list-styles.css";
@import "@/styles/bx-accordion-styles.css";
@import "@/styles/bx-modal-styles.css";

.padding-top {
  padding-top: 1.5rem;
}
</style>
