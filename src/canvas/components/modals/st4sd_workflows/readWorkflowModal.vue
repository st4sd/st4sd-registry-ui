<template>
  <bx-modal open class="no-transform">
    <bx-modal-header>
      <bx-modal-close-button></bx-modal-close-button>
      <bx-modal-heading>{{ title }}</bx-modal-heading>
    </bx-modal-header>
    <bx-modal-body>
      <bx-accordion>
        <bx-accordion-item data-modal-primary-focus open title-text="Overview">
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
        </bx-accordion-item>

        <bx-accordion-item
          :title-text="'Parameters (' + workflowParams.length + ')'"
        >
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
        </bx-accordion-item>

        <bx-accordion-item
          :title-text="'Steps (' + Object.keys(workflowSteps).length + ')'"
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
                <cds-structured-list-cell>{{
                  stepRef
                }}</cds-structured-list-cell>
              </cds-structured-list-row>
            </cds-structured-list-body>
          </cds-structured-list>
        </bx-accordion-item>

        <bx-accordion-item title-text="Execute">
          <cds-structured-list>
            <cds-structured-list-head>
              <cds-structured-list-header-row>
                <cds-structured-list-header-cell
                  >Target Name</cds-structured-list-header-cell
                >
              </cds-structured-list-header-row>
            </cds-structured-list-head>
            <cds-structured-list-body>
              <template
                v-for="execute in workflowExecute"
                :key="execute.target"
              >
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
        </bx-accordion-item>
      </bx-accordion>
      <bx-btn
        kind="danger"
        v-if="shareAndDeleteButtonsAvailable"
        @click="deleteWorkflow"
        :disabled="requestInProgress"
        title="Delete this template"
      >
        Delete &nbsp;
        <img
          class="white-svg"
          height="18"
          width="18"
          src="@/assets/trash-can.svg"
        />
      </bx-btn>
      <bx-btn
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
          class="white-svg"
          height="15"
          width="15"
          src="@/assets/launch.svg"
        />
      </bx-btn>
      <div v-if="requestInProgress" id="loading-wheel">
        <bx-inline-loading status="active">
          Request in progress ...
        </bx-inline-loading>
      </div>
    </bx-modal-body>
    <bx-modal-footer> </bx-modal-footer>
  </bx-modal>
</template>

<script>
import "https://1.www.s81c.com/common/carbon/web-components/version/v2.8.0/structured-list.min.js";
import "@carbon/web-components/es/components/inline-loading/index.js";
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
@import "@/styles/bx-modal-styles.css";
@import "@/styles/inline-loading-style.css";

bx-accordion-item::part(content) {
  padding-right: 1rem;
}
</style>
