<!-- eslint-disable vue/no-deprecated-slot-attribute -->
<template>
  <c4p-side-panel
    open
    size="lg"
    includeOverlay="true"
    :title="`Configure how <${targetNode.label}> consumes the outputs of <${sourceNode.label}>`"
    @c4p-side-panel-closed="$emit('side-panel-closed')"
  >
    <edgeForm
      v-if="loaded"
      ref="edgeForm"
      :edgeProp="edgeProp"
      :allNodes="allNodes"
      :allEdges="allEdges"
      :sourceNode="sourceNode"
      :targetNode="targetNode"
      :sourceNodeType="sourceNodeType"
      @submitDisabled="this.submitDisabled"
      @created="created"
    />
    <cds-button
      slot="actions"
      kind="secondary"
      @click="$emit('side-panel-closed')"
      >Cancel</cds-button
    >
    <cds-button
      :disabled="disabled"
      kind="primary"
      type="submit"
      slot="actions"
      @click="create"
    >
      Save
    </cds-button>
  </c4p-side-panel>
</template>

<script>
import "@carbon/ibm-products-web-components/es/components/side-panel/index.js";
import "@carbon/web-components/es/components/button/index.js";
import edgeForm from "@/canvas/components/forms/edgeForm.vue";
import { getSourceAndTargetNodes } from "@/canvas/functions/modalFunctions";

export default {
  components: { edgeForm },
  props: {
    edgeProp: Object,
    allNodes: Object,
    allEdges: Object,
  },
  emits: ["created", "side-panel-closed"],
  data() {
    return {
      sourceNode: {},
      targetNode: {},
      sourceNodeType: "",
      loaded: false,
      disabled: true,
    };
  },
  mounted() {
    let result = getSourceAndTargetNodes(this.allNodes, this.edgeProp);
    this.sourceNode = result.sourceNode;
    this.targetNode = result.targetNode;
    this.sourceNodeType = result.sourceNodeType;
    if (this.sourceNode != {} && this.targetNode != {}) {
      this.loaded = true;
    }
  },
  methods: {
    submitDisabled(value) {
      this.disabled = value;
    },
    create() {
      this.$refs.edgeForm.create();
    },
    created(edge) {
      this.$emit("created", edge);
    },
  },
};
</script>
