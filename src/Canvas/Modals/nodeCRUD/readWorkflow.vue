<template>
  <bx-modal class="no-transform">
    <bx-modal-header>
      <bx-modal-close-button></bx-modal-close-button>
      <bx-modal-heading>{{ title }}</bx-modal-heading>
    </bx-modal-header>
    <bx-modal-body>
      <bx-accordion>
        <bx-accordion-item open title-text="Overview">
          <bx-structured-list>
            <bx-structured-list-head>
              <bx-structured-list-header-row>
                <bx-structured-list-header-cell
                  >Property</bx-structured-list-header-cell
                >
                <bx-structured-list-header-cell
                  >Definition</bx-structured-list-header-cell
                >
              </bx-structured-list-header-row>
            </bx-structured-list-head>
            <bx-structured-list-body>
              <bx-structured-list-row v-if="workflowName != ''">
                <bx-structured-list-cell>Workflow name</bx-structured-list-cell>
                <bx-structured-list-cell>{{
                  workflowName
                }}</bx-structured-list-cell>
              </bx-structured-list-row>
            </bx-structured-list-body>
          </bx-structured-list>
        </bx-accordion-item>

        <bx-accordion-item title-text="Parameters">
          <bx-structured-list>
            <bx-structured-list-head>
              <bx-structured-list-header-row>
                <bx-structured-list-header-cell
                  >Name</bx-structured-list-header-cell
                >
                <bx-structured-list-header-cell
                  >Default value</bx-structured-list-header-cell
                >
              </bx-structured-list-header-row>
            </bx-structured-list-head>
            <bx-structured-list-body>
              <bx-structured-list-row
                v-for="param in workflowParams"
                :key="param.name"
              >
                <bx-structured-list-cell>{{
                  param.name
                }}</bx-structured-list-cell>
                <bx-structured-list-cell v-if="param.default != undefined">{{
                  param.default
                }}</bx-structured-list-cell>
                <bx-structured-list-cell v-else></bx-structured-list-cell>
              </bx-structured-list-row>
            </bx-structured-list-body>
          </bx-structured-list>
        </bx-accordion-item>

        <bx-accordion-item title-text="Steps">
          <bx-structured-list>
            <bx-structured-list-head>
              <bx-structured-list-header-row>
                <bx-structured-list-header-cell
                  >Name</bx-structured-list-header-cell
                >
                <bx-structured-list-header-cell
                  >Default value</bx-structured-list-header-cell
                >
              </bx-structured-list-header-row>
            </bx-structured-list-head>
            <bx-structured-list-body>
              <bx-structured-list-row
                v-for="(stepRef, stepName) in workflowSteps"
                :key="stepName"
              >
                <bx-structured-list-cell>{{
                  stepName
                }}</bx-structured-list-cell>
                <bx-structured-list-cell>{{ stepRef }}</bx-structured-list-cell>
              </bx-structured-list-row>
            </bx-structured-list-body>
          </bx-structured-list>
        </bx-accordion-item>

        <bx-accordion-item title-text="Execute">
          <bx-structured-list>
            <bx-structured-list-head>
              <bx-structured-list-header-row>
                <bx-structured-list-header-cell
                  >Target Name</bx-structured-list-header-cell
                >
              </bx-structured-list-header-row>
            </bx-structured-list-head>
            <bx-structured-list-body>
              <template
                v-for="execute in workflowExecute"
                :key="execute.target"
              >
                <bx-structured-list-row>
                  <bx-structured-list-cell>{{
                    execute.target
                  }}</bx-structured-list-cell>
                </bx-structured-list-row>
                <bx-structured-list-row>
                  <bx-structured-list>
                    <bx-structured-list-head>
                      <bx-structured-list-header-row>
                        <bx-structured-list-header-cell
                          >>></bx-structured-list-header-cell
                        >
                        <bx-structured-list-header-cell
                          >Argument name</bx-structured-list-header-cell
                        >
                        <bx-structured-list-header-cell
                          >Definition</bx-structured-list-header-cell
                        >
                      </bx-structured-list-header-row>
                    </bx-structured-list-head>
                    <bx-structured-list-body>
                      <bx-structured-list-row
                        v-for="(argRef, argName) in execute.args"
                        :key="argName"
                      >
                        <bx-structured-list-cell></bx-structured-list-cell>
                        <bx-structured-list-cell>{{
                          argName
                        }}</bx-structured-list-cell>
                        <bx-structured-list-cell>{{
                          argRef
                        }}</bx-structured-list-cell>
                      </bx-structured-list-row>
                    </bx-structured-list-body>
                  </bx-structured-list>
                </bx-structured-list-row>
              </template>
            </bx-structured-list-body>
          </bx-structured-list>
        </bx-accordion-item>
      </bx-accordion>
    </bx-modal-body>
  </bx-modal>
</template>

<script>
export default {
  name: "readWorkflowModal",
  props: {
    title: String,
    node: Object,
  },
  data() {
    return {
      workflowName: "",
      workflowParams: "",
      workflowSteps: "",
      workflowExecute: "",
    };
  },
  mounted() {
    this.workflowName = this.node.definition.signature.name;
    this.workflowParams = this.node.definition.signature.parameters;
    this.workflowSteps = this.node.definition.steps;
    this.workflowExecute = this.node.definition.execute;
  },
};
</script>
<style lang="css" scoped src="@/styles/bx-modal-styles.css">
bx-accordion-item::part(content) {
  /* border: dashed 2px black; */
  padding-right: 1rem;
}
</style>
