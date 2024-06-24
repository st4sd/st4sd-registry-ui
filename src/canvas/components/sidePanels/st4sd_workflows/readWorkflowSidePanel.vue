<!-- eslint-disable vue/no-deprecated-slot-attribute -->
<template>
  <cds-side-panel
    open
    size="lg"
    includeOverlay="true"
    :title="this.title"
    @cds-side-panel-closed="$emit('closeSidePanel')"
    selectorInitialFocus="#firstAccordionItem"
  >
    <cds-accordion>
      <cds-accordion-item id="firstAccordionItem" open title="Overview">
        <cds-structured-list>
          <cds-structured-list-body>
            <cds-structured-list-row v-if="workflowName != ''">
              <cds-structured-list-cell>Name</cds-structured-list-cell>
              <cds-structured-list-cell>{{
                workflowName
              }}</cds-structured-list-cell>
            </cds-structured-list-row>
            <cds-structured-list-row v-if="workflowDescription != ''">
              <cds-structured-list-cell>Description</cds-structured-list-cell>
              <cds-structured-list-cell>{{
                workflowDescription
              }}</cds-structured-list-cell>
            </cds-structured-list-row>
          </cds-structured-list-body>
        </cds-structured-list>
      </cds-accordion-item>

      <cds-accordion-item :title="'Parameters (' + workflowParams.length + ')'">
        <cds-structured-list>
          <cds-structured-list-head>
            <cds-structured-list-header-row>
              <cds-structured-list-header-cell
                >Name</cds-structured-list-header-cell
              >
              <cds-structured-list-header-cell
                >Value</cds-structured-list-header-cell
              >
            </cds-structured-list-header-row>
          </cds-structured-list-head>
          <cds-structured-list-body>
            <cds-structured-list-row
              v-for="param in workflowParams"
              :key="param.name"
            >
              <cds-structured-list-cell>{{
                param.name
              }}</cds-structured-list-cell>
              <cds-structured-list-cell
                v-if="getParameterValue(param.name) != undefined"
              >
                {{ getParameterValue(param.name) }}
              </cds-structured-list-cell>
              <template v-else>
                <cds-structured-list-cell v-if="param.default != undefined">{{
                  param.default
                }}</cds-structured-list-cell>
                <cds-structured-list-cell v-else></cds-structured-list-cell
              ></template>
            </cds-structured-list-row>
          </cds-structured-list-body>
        </cds-structured-list>
      </cds-accordion-item>

      <cds-accordion-item
        :title="'Steps (' + Object.keys(workflowSteps).length + ')'"
      >
        <cds-structured-list>
          <cds-structured-list-head>
            <cds-structured-list-header-row>
              <cds-structured-list-header-cell
                >Name</cds-structured-list-header-cell
              >
              <cds-structured-list-header-cell
                >Default value</cds-structured-list-header-cell
              >
            </cds-structured-list-header-row>
          </cds-structured-list-head>
          <cds-structured-list-body>
            <cds-structured-list-row
              v-for="(stepRef, stepName) in workflowSteps"
              :key="stepName"
            >
              <cds-structured-list-cell>{{
                stepName
              }}</cds-structured-list-cell>
              <cds-structured-list-cell>{{ stepRef }}</cds-structured-list-cell>
            </cds-structured-list-row>
          </cds-structured-list-body>
        </cds-structured-list>
      </cds-accordion-item>

      <cds-accordion-item title="Execute">
        <cds-structured-list>
          <cds-structured-list-head>
            <cds-structured-list-header-row>
              <cds-structured-list-header-cell
                >Target Name</cds-structured-list-header-cell
              >
            </cds-structured-list-header-row>
          </cds-structured-list-head>
          <cds-structured-list-body>
            <template v-for="execute in workflowExecute" :key="execute.target">
              <cds-structured-list-row>
                <cds-structured-list-cell>{{
                  execute.target
                }}</cds-structured-list-cell>
              </cds-structured-list-row>
              <cds-structured-list-row>
                <cds-structured-list>
                  <cds-structured-list-head>
                    <cds-structured-list-header-row>
                      <cds-structured-list-header-cell
                        >>></cds-structured-list-header-cell
                      >
                      <cds-structured-list-header-cell
                        >Argument name</cds-structured-list-header-cell
                      >
                      <cds-structured-list-header-cell
                        >Definition</cds-structured-list-header-cell
                      >
                    </cds-structured-list-header-row>
                  </cds-structured-list-head>
                  <cds-structured-list-body>
                    <cds-structured-list-row
                      v-for="(argRef, argName) in execute.args"
                      :key="argName"
                    >
                      <cds-structured-list-cell></cds-structured-list-cell>
                      <cds-structured-list-cell>{{
                        argName
                      }}</cds-structured-list-cell>
                      <cds-structured-list-cell>{{
                        argRef
                      }}</cds-structured-list-cell>
                    </cds-structured-list-row>
                  </cds-structured-list-body>
                </cds-structured-list>
              </cds-structured-list-row>
            </template>
          </cds-structured-list-body>
        </cds-structured-list>
      </cds-accordion-item>
    </cds-accordion>
    <div class="cds--subgrid--narrow">
      <cds-button
        class="cds--css-grid-column"
        kind="danger"
        v-if="shareAndDeleteButtonsAvailable"
        @click="deleteWorkflow"
        :disabled="requestInProgress"
        title="Delete this template"
      >
        Delete &nbsp;
        <img
          slot="icon"
          class="white-svg"
          height="18"
          width="18"
          src="@/assets/trash-can.svg"
        />
      </cds-button>
      <cds-button
        class="cds--css-grid-column"
        kind="primary"
        v-if="shareAndDeleteButtonsAvailable"
        @click="shareWorkflow"
        :disabled="requestInProgress || !shareEnabled"
        :title="
          shareEnabled
            ? 'Store this Template in the persistent Graph Library and make it available to all experiments'
            : 'The persistent Graph Library already contains a template with the same name'
        "
      >
        Share &nbsp;
        <img
          slot="icon"
          class="white-svg"
          height="15"
          width="15"
          src="@/assets/launch.svg"
        />
      </cds-button>
    </div>
    <div v-if="requestInProgress" id="loading-wheel">
      <cds-inline-loading status="active">
        Request in progress ...
      </cds-inline-loading>
    </div>
  </cds-side-panel>
</template>

<script>
import "https://1.www.s81c.com/common/carbon/web-components/version/v2.8.0/structured-list.min.js";
import "https://1.www.s81c.com/common/carbon/web-components/version/v2.8.0/side-panel.min.js";
import "https://1.www.s81c.com/common/carbon/web-components/version/v2.8.0/accordion.min.js";
import "https://1.www.s81c.com/common/carbon/web-components/version/v2.8.0/button.min.js";
import "https://1.www.s81c.com/common/carbon/web-components/version/v2.8.0/inline-loading.min.js";
export default {
  props: {
    title: String,
    node: Object,
    inputingEdges: Array,
    shareEnabled: Boolean,
    requestInProgress: Boolean,
    shareAndDeleteButtonsAvailable: Boolean,
  },
  data() {
    return {
      workflowName: "",
      workflowDescription: "",
      workflowParams: "",
      workflowSteps: "",
      workflowExecute: "",
    };
  },
  mounted() {
    if (this.node.definition.signature.name) {
      this.workflowName = this.node.definition.signature.name;
    }
    if (this.node.definition.signature.description) {
      this.workflowDescription = this.node.definition.signature.description;
    }
    if (this.node.definition.signature.parameters) {
      this.workflowParams = this.node.definition.signature.parameters;
    }
    if (this.node.definition.steps) {
      this.workflowSteps = this.node.definition.steps;
    }
    if (this.node.definition.execute) {
      this.workflowExecute = this.node.definition.execute;
    }
  },
  methods: {
    getParameterValue(paramName) {
      for (var edge of this.inputingEdges) {
        if (edge.definition[paramName] != undefined) {
          return edge.definition[paramName];
        }
      }
    },
    shareWorkflow() {
      this.$emit("shareWorkflow", this.node);
    },
    deleteWorkflow() {
      this.$emit("deleteWorkflow", this.node);
    },
  },
};
</script>
<style lang="scss" scoped>
@import "@/styles/svg.scss";
@import "@/styles/inline-loading-style.css";
</style>
