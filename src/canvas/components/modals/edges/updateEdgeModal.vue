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
      <edgeForm
        v-if="loaded"
        ref="edgeForm"
        :edgeProp="edgeProp"
        :allNodes="allNodes"
        :allEdges="allEdges"
        :sourceNode="sourceNode"
        :targetNode="targetNode"
        :sourceNodeType="sourceNodeType"
        @updated="updated"
      />
      <br />
      <bx-btn kind="danger" @click="emitDelete">
        Delete this connection &nbsp;
        <img
          class="white-svg"
          width="18"
          height="18"
          src="@/assets/trash-can.svg"
        />
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
import edgeForm from "@/canvas/components/forms/edgeForm.vue";
import { getSourceAndTargetNodes } from "@/canvas/functions/modalFunctions";

export default {
  components: { edgeForm },
  props: {
    edgeProp: Object,
    allNodes: Object,
    allEdges: Object,
  },
  emits: ["update", "delete"],
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
@import "@/styles/delete-button-icon-inside-cell-style.css";
@import "@/styles/bx-accordion-styles.css";
@import "@/styles/bx-modal-styles.css";

.padding-top {
  padding-top: 1.5rem;
}
</style>
