<!-- eslint-disable vue/no-deprecated-slot-attribute -->
<template>
  <c4p-side-panel
    open
    includeOverlay="true"
    title="Select Entrypoint"
    @c4p-side-panel-closed="this.$emit('side-panel-closed')"
  >
    <template v-if="Object.keys(entryPointSelectionNodes).length > 0">
      <cds-radio-button-group
        name="entryPointOptions"
        orientation="vertical"
        :value="selectedNodeId"
        @cds-radio-button-group-changed="selectedNodeId = $event.detail.value"
      >
        <template v-for="(node, i) in entryPointSelectionNodes" :key="i">
          <cds-radio-button
            :label-text="node.label"
            :value="node.id"
          ></cds-radio-button>
        </template>
      </cds-radio-button-group>
    </template>
    <template v-else>
      <br />
      <h5>
        Selecting an entrypoint is only possible if a workflow is present on the
        canvas
      </h5>
    </template>
    <cds-button
      slot="actions"
      kind="secondary"
      @click="this.$emit('side-panel-closed')"
      >Cancel</cds-button
    >
    <cds-button
      slot="actions"
      kind="primary"
      type="submit"
      @click="update"
      :disabled="selectedNodeId == ''"
      >Save changes</cds-button
    >
  </c4p-side-panel>
</template>

<script>
import "@carbon/web-components/es/components/radio-button/index.js";
import "@carbon/ibm-products-web-components/es/components/side-panel/index.js";

export default {
  props: {
    allNodes: Object,
  },
  emits: ["side-panel-closed"],
  data() {
    return {
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
    }
  },
  methods: {
    update() {
      this.entryPointSelectionNodes.forEach((node) => {
        node.isEntry = false;
      });
      let entryNode = this.allNodes.find(
        (node) => node.id == this.selectedNodeId,
      );
      if (entryNode != undefined) {
        entryNode.isEntry = true;
      }
      this.$emit("side-panel-closed");
    },
  },
};
</script>
