<!-- eslint-disable vue/no-deprecated-slot-attribute -->
<template>
  <cds-side-panel
    open
    size="lg"
    includeOverlay="true"
    :title="`Configure how <${targetNode.label}> consumes the outputs of <${sourceNode.label}>`"
    @cds-side-panel-closed="$emit('side-panel-closed')"
  >
    <div>
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
        @updated="updated"
      />
      <br />
      <cds-button kind="danger" @click="emitDelete">
        Delete this connection &nbsp;
        <img
          slot="icon"
          class="white-svg"
          width="18"
          height="18"
          src="@/assets/trash-can.svg"
        />
      </cds-button>
    </div>
    <cds-button
      slot="actions"
      kind="secondary"
      @click="$emit('side-panel-closed')"
      >Cancel</cds-button
    >
    <cds-button kind="primary" type="submit" slot="actions" @click="update">
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
  emits: ["update", "delete", "side-panel-closed"],
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
    update() {
      this.$refs.edgeForm.update();
    },
    updated() {
      this.$emit("update");
    },
    emitDelete() {
      this.$emit("delete");
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/styles/svg.scss";
</style>
