<!-- eslint-disable vue/no-deprecated-slot-attribute -->
<template>
  <cds-side-panel
    open
    size="lg"
    includeOverlay="true"
    :title="`Configure how <${targetNode.label}> consumes the outputs of <${sourceNode.label}>`"
    @cds-side-panel-closed="closeSidePanel"
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
      @created="created"
    />
    <cds-button slot="actions" kind="secondary" @click="closeSidePanel"
      >Cancel</cds-button
    >
    <cds-button kind="primary" type="submit" slot="actions" @click="create">
      Save
    </cds-button>
  </cds-side-panel>
</template>

<script>
import "https://1.www.s81c.com/common/carbon/web-components/version/v2.8.0/side-panel.min.js";
import "https://1.www.s81c.com/common/carbon/web-components/version/v2.8.0/button.min.js";
import edgeForm from "@/canvas/components/forms/edgeForm.vue";
import { getSourceAndTargetNodes } from "@/canvas/functions/modalFunctions";

export default {
  components: { edgeForm },
  props: {
    edgeProp: Object,
    allNodes: Object,
    allEdges: Object,
  },
  emits: ["created", "closeSidePanel"],
  data() {
    return {
      sourceNode: {},
      targetNode: {},
      sourceNodeType: "",
      loaded: false,
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
    closeSidePanel() {
      this.$emit("closeSidePanel");
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
