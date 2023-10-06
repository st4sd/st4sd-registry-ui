<template>
  <!--  https://vueflow.dev/examples/dnd.html -->
  <div class="dndflow">
    <VueFlow
      :class="{ dark }"
      class="basicflow"
      :default-zoom="1"
      :min-zoom="0.2"
      :max-zoom="4"
      fit-view-on-init
    >
      <Background :pattern-color="dark ? '#FFFFFB' : '#aaa'" gap="8" />
      <MiniMap />
      <Controls />

      <Panel :position="PanelPosition.TopRight" class="controls">
        <bx-btn
          size="sm"
          v-if="doesOtherOrPresetsExist()"
          title="Toggle inputs visibility"
          @click="showHideInputNodes"
        >
          {{ showHideButtonTitle }}
        </bx-btn>
        <bx-btn size="sm" @click="toggleTheme" title="Toggle light/dark mode">
          <img
            class="canvas-logo"
            width="16"
            heigth="16"
            src="../assets/brightness-contrast.svg"
          />
        </bx-btn>
        <bx-btn size="sm" title="Download as JSON" @click="downloadJSON">
          <img
            class="canvas-logo"
            width="16"
            heigth="16"
            src="../assets/download.svg"
          />
        </bx-btn>
      </Panel>
      <template #node-component="{ label }">
        <ComponentNode :label="label" />
      </template>
      <template #node-workflow="nodeProps">
        <WorkflowNode
          :data="nodeProps.data"
          :label="nodeProps.label"
          :isHidden="false"
          @changeVisibility="onChangeVisibility(nodeProps, $event.value)"
        />
      </template>
      <template #node-workflow-input="{ label }">
        <WorkflowInputNode :label="label" />
      </template>
    </VueFlow>
    <TransformLibrary
      v-if="!props.transformApplied"
      :transforms="props.transforms"
      @transform-selected="handleTransformSelected"
    />

    <readWorkflowModal
      v-if="modalVisibilities.readWorkflowModal.value"
      title="Workflow Details"
      @bx-modal-closed="toggleModalVisibility('readWorkflowModal')"
      :node="clickedNode"
      :inputingEdges="inputingEdges"
      open="true"
    >
    </readWorkflowModal>
    <readComponentModal
      v-if="modalVisibilities.readComponentModal.value"
      title="Component Details"
      @bx-modal-closed="toggleModalVisibility('readComponentModal')"
      :node="clickedNode"
      :inputingEdges="inputingEdges"
      open="true"
    >
    </readComponentModal>
    <readInputModal
      v-if="modalVisibilities.readInputModal.value"
      @bx-modal-closed="toggleModalVisibility('readInputModal')"
      :node="clickedNode"
      open="true"
    />
    <readEdgeModal
      v-if="modalVisibilities.readEdgeModal.value"
      title="Edge Parameters"
      @bx-modal-closed="toggleModalVisibility('readEdgeModal')"
      :edge="clickedEdge"
      open="true"
    />
  </div>
</template>

<script setup>
import { ref } from "vue";
import {
  Background,
  Controls,
  MiniMap,
  Panel,
  PanelPosition,
} from "@vue-flow/additional-components";
import { VueFlow, useVueFlow } from "@vue-flow/core";
import { dagStore } from "@/Canvas/stores/dagStore";
import WorkflowInputNode from "@/Canvas/Nodes/WorkflowInputNode.vue";
import WorkflowNode from "@/Canvas/Nodes/WorkflowNode";
import ComponentNode from "@/Canvas/Nodes/ComponentNode.vue";
import readWorkflowModal from "@/Canvas/Modals/nodeCRUD/readWorkflow.vue";
import readComponentModal from "@/Canvas/Modals/nodeCRUD/readComponent.vue";
import readInputModal from "@/Canvas/Modals/nodeCRUD/readInput.vue";
import readEdgeModal from "@/Canvas/Modals/edgeCRUD/readEdge.vue";
import { toJSON } from "@/Canvas/downloadJSON";
import {
  getWorkflowsDimensions,
  getWorkflowsEdges,
  hide,
} from "@/Canvas/hideExpand";
import TransformLibrary from "./TransformLibrary.vue";

/**
 * useVueFlow provides all event handlers and store properties
 * You can pass the composable an object that has the same properties as the VueFlow component props
 */

//Vue Flow setup
const elements = ref(dagStore.DAG);

const {
  onPaneReady,
  onEdgeDoubleClick,
  onConnect,
  addEdges,
  onNodeDoubleClick,
  removeEdges,
  nodes,
  edges,
} = useVueFlow(elements.value);

//Variable declaration
let clickedNode;
let clickedEdge;
let inputingEdges;
let modalVisibilities = {
  readEdgeModal: ref(false),
  readInputModal: ref(false),
  readComponentModal: ref(false),
  readWorkflowModal: ref(false),
};
const dark = ref(false);

let showHideButtonTitle = ref("Show all inputs");
let inputNodesVisibility = ref(false);

const workflowsDims = getWorkflowsDimensions(nodes.value);
const workflowsEdges = getWorkflowsEdges(nodes.value, edges.value);

const props = defineProps({
  id: {
    type: String,
    default: "",
  },
  // default: [] gives an error https://github.com/vuejs/vue/issues/1032
  transforms: {
    type: Array,
    default: () => [],
  },
  transformApplied: {
    type: Boolean,
    default: false,
  },
});

const doesOtherOrPresetsExist = () => {
  return nodes.value.some((node) => node.id == "other" || node.id == "presets");
};

const showHideInputNodes = () => {
  inputNodesVisibility.value = !inputNodesVisibility.value;
  let other = nodes.value.find((a) => a.id == "other");
  if (other != undefined) {
    other.hidden = !inputNodesVisibility.value;
  }
  let presets = nodes.value.find((a) => a.id == "presets");
  if (presets != undefined) {
    presets.hidden = !inputNodesVisibility.value;
  }
  showHideButtonTitle.value =
    showHideButtonTitle.value == "Hide presets & other"
      ? "Show all inputs"
      : "Hide presets & other";
};

/**
 * This is a Vue Flow event-hook which can be listened to from anywhere you call the composable, instead of only on the main component
 *
 * onPaneReady is called when viewpane & nodes have visible dimensions
 */
onPaneReady(({ fitView }) => {
  fitView();
});

const toggleModalVisibility = (modal) => {
  modalVisibilities[modal].value = !modalVisibilities[modal].value;
};
onNodeDoubleClick(({ node }) => {
  clickedNode = { ...node };
  inputingEdges = edges.value.filter((n) => n.target == node.id);
  if (node.type == "workflow") {
    toggleModalVisibility("readWorkflowModal");
    //node type to change to component instead of empty string
    //there is an issue to track this
    //https://github.ibm.com/st4sd/overview/issues/517
  } else if (node.type == "component") {
    inputingEdges = edges.value.filter((n) => n.target == node.id);
    toggleModalVisibility("readComponentModal");
  } else if (node.type == "input") {
    toggleModalVisibility("readInputModal");
  }
});

onEdgeDoubleClick(({ edge }) => {
  clickedEdge = { ...edge };
  toggleModalVisibility("readEdgeModal");
});

/**
 * onConnect is called when a new connection is created.
 * You can add additional properties to your new edge (like a type or label) or block the creation altogether
 */
onConnect((params) => addEdges([params]));

const toggleTheme = () => (dark.value = !dark.value);

const onChangeVisibility = (node, isHidden) => {
  let result = hide(
    node,
    nodes.value,
    edges.value,
    workflowsDims,
    workflowsEdges,
    isHidden,
  );
  removeEdges(result.toDelete);
};

const downloadJSON = () => {
  toJSON(nodes.value, edges.value, "experiment");
};

const emit = defineEmits(["transformSelected"]);

const handleTransformSelected = (loading, transformId) => {
  emit("transformSelected", loading, transformId);
};
</script>
<style lang="scss" src="@/Canvas/main.scss"></style>
