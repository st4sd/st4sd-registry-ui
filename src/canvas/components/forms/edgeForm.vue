<template>
  <cds-text-input
    label="Connection label (optional):"
    class="cds-theme-zone-g10"
    placeholder="Label"
    @input="this.edgeName = $event.target.value"
    :value="edge.label"
  />
  <br />
  <h5 v-if="edge.definition != undefined">Arguments:</h5>
  <cds-structured-list>
    <cds-structured-list-head>
      <cds-structured-list-header-row>
        <cds-structured-list-header-cell
          >Target</cds-structured-list-header-cell
        >
        <cds-structured-list-header-cell
          >Source</cds-structured-list-header-cell
        >
        <cds-structured-list-header-cell
          >Suffix (optional)</cds-structured-list-header-cell
        >
      </cds-structured-list-header-row>
    </cds-structured-list-head>
    <cds-structured-list-body v-if="sourceNodeType == 'workflow-input'">
      <cds-structured-list-row
        v-for="(argument, index) in argumentsArray"
        :key="index"
      >
        <cds-structured-list-cell>
          <bx-dropdown
            class="updatedChoices"
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
        </cds-structured-list-cell>
        <cds-structured-list-cell>
          <bx-dropdown
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
        </cds-structured-list-cell>
        <cds-structured-list-cell class="align-top">
          <cds-text-input
            class="cds-theme-zone-g10"
            :value="argument.suffix"
            @input="argument.suffix = $event.target.value"
            placeholder="e.g. :ref or /path:ref, etc"
          />
        </cds-structured-list-cell>
        <cds-structured-list-cell class="align-top">
          <cds-icon-button
            kind="danger"
            enter-delay-ms="1000"
            leave-delay-ms="0"
            align="bottom"
            v-if="argumentsArray.length > 1"
            @click="removeArgument(index)"
          >
            <img
              slot="icon"
              class="white-svg"
              height="18"
              width="18"
              src="@/assets/remove.svg"
            />
            <p slot="tooltip-content">Remove item</p>
          </cds-icon-button>
        </cds-structured-list-cell>
      </cds-structured-list-row>
    </cds-structured-list-body>
    <cds-structured-list-body v-else>
      <cds-structured-list-row
        v-for="(argument, index) in argumentsArray"
        :key="index"
      >
        <cds-structured-list-cell>
          <bx-dropdown
            class="updatedChoices"
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
        </cds-structured-list-cell>
        <cds-structured-list-cell class="align-top">
          <cds-text-input
            class="cds-theme-zone-g10"
            readonly
            :value="`<${sourceNode.stepId}>`"
          />
        </cds-structured-list-cell>
        <cds-structured-list-cell class="align-top">
          <cds-text-input
            class="cds-theme-zone-g10"
            :value="argument.suffix"
            @input="argument.suffix = $event.target.value"
            required
            placeholder="e.g. /path:ref"
          />
        </cds-structured-list-cell>
        <cds-structured-list-cell class="align-top">
          <cds-icon-button
            kind="danger"
            enter-delay-ms="1000"
            leave-delay-ms="0"
            align="bottom"
            v-if="argumentsArray.length > 1"
            @click="removeArgument(index)"
          >
            <img
              slot="icon"
              class="white-svg"
              height="18"
              width="18"
              src="@/assets/remove.svg"
            />
            <p slot="tooltip-content">Remove item</p>
          </cds-icon-button>
        </cds-structured-list-cell>
      </cds-structured-list-row>
    </cds-structured-list-body>
    <bx-btn kind="primary" @click="addArgument()"> Add </bx-btn>
  </cds-structured-list>
</template>

<script>
import "@carbon/web-components/es/components/modal/index.js";
import "@carbon/web-components/es/components/button/index.js";
import "@carbon/web-components/es/components/dropdown/index.js";
import "https://1.www.s81c.com/common/carbon/web-components/version/v2.8.0/structured-list.min.js";
import "https://1.www.s81c.com/common/carbon/web-components/version/v2.8.0/icon-button.min.js";

import {
  getArguments,
  getPossibleArgumentNames,
} from "@/canvas/functions/modalFunctions";
export default {
  props: {
    edgeProp: Object,
    allNodes: Object,
    allEdges: Object,
    sourceNode: Object,
    targetNode: Object,
    sourceNodeType: String,
  },
  emits: ["created", "updated"],
  data() {
    return {
      edge: {},
      argumentsArray: [],
      possibleArguments: [],
      selectedArguments: [],
      possibleArgumentValues: [],
      edgeName: "",
    };
  },
  mounted() {
    this.edge = this.edgeProp;
    //Get source node target node and arguments
    this.argumentsArray = getArguments(this.sourceNodeType, this.edgeProp);
    //Get all possible arguments that have not been used in other connections
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
    create() {
      let uniqueArguments = new Set(this.argumentsArray.map((x) => x.name));
      let newEdgeDefinition = {};
      if (this.argumentsArray.length != uniqueArguments.size) {
        alert("Please make sure argument names are unique");
      } else {
        if (this.sourceNodeType == "workflow-input") {
          this.argumentsArray.map((x) => {
            x.name = x.name.trim();
            x.value = x.value.trim();
            if (x.name != "" && x.value != "") {
              newEdgeDefinition[x.name] = `%(${x.value})s`;
              x.suffix = x.suffix.trim();
              if (x.suffix != "") {
                newEdgeDefinition[x.name] =
                  newEdgeDefinition[x.name] + `${x.suffix}`;
              }
            }
          });
        } else {
          this.argumentsArray.map((x) => {
            x.name = x.name.trim();
            x.value = this.sourceNode.id;
            if (x.name != "") {
              x.suffix = x.suffix.trim();
              let value = "<" + x.value + ">";
              if (x.suffix != "") {
                value = value + x.suffix;
              }
              newEdgeDefinition[x.name] = value;
            }
          });
        }
      }
      this.edge.label = this.edgeName;
      this.edge.definition = newEdgeDefinition;
      this.$emit("created", this.edge);
    },
    update() {
      //make sure the argument names are unique by adding them to
      //a Set which can only contain unique values
      let uniqueArguments = new Set(this.argumentsArray.map((x) => x.name));
      let newEdgeDefinition = {};
      if (this.argumentsArray.length != uniqueArguments.size) {
        alert("Please make sure argument names are unique");
      } else {
        if (this.sourceNodeType == "workflow-input") {
          this.argumentsArray.map((x) => {
            x.name = x.name.trim();
            x.value = x.value.trim();
            if (x.name != "" && x.value != "") {
              newEdgeDefinition[x.name] = `%(${x.value})s`;
              x.suffix = x.suffix.trim();
              if (x.suffix != "") {
                newEdgeDefinition[x.name] =
                  newEdgeDefinition[x.name] + `${x.suffix}`;
              }
            }
          });
        } else {
          this.argumentsArray.map((x) => {
            x.name = x.name.trim();
            if (x.name != "") {
              x.suffix = x.suffix.trim();
              let value = "<" + this.sourceNode.stepId + ">";
              if (x.suffix != "") {
                value = value + x.suffix;
              }
              newEdgeDefinition[x.name] = value;
            }
          });
        }
        this.edge.definition = newEdgeDefinition;
        this.edge.label = this.edgeName;
        this.$emit("updated");
      }
    },
    addArgument() {
      this.updateSelectedArguments();
      this.argumentsArray.push({
        name: "",
        value: "",
        suffix: "",
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
@import "@/styles/svg.scss";
@import "@/styles/delete-button-icon-inside-cell-style.css";
@import "@/styles/cds-structured-list-styles.css";
@import "@/styles/bx-accordion-styles.css";
@import "@/styles/bx-modal-styles.css";

.padding-top {
  padding-top: 1.5rem;
}
</style>
