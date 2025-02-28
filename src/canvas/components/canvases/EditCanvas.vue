<!-- eslint-disable vue/no-deprecated-slot-attribute -->
<template>
  <!-- Error Notification -->
  <div id="toast-notification-container">
    <cds-toast-notification
      v-for="(notification, notifIdx) in toastNotifications"
      :key="notifIdx"
      timeout="5000"
      :kind="notification.kind"
      :title="notification.title"
      :subtitle="notification.subtitle"
      :caption="notification.caption"
      lowContrast
    />
  </div>
  <!--  https://vueflow.dev/examples/dnd.html -->
  <div class="dndflow">
    <VueFlow
      id="vue-flow-edit-canvas"
      :nodes="elements.nodes"
      :edges="elements.edges"
      class="basicflow"
      :delete-key-code="false"
      :class="{ dark }"
      :default-zoom="1"
      :min-zoom="0.2"
      :max-zoom="4"
      fit-view-on-init
      elevate-edges-on-select
    >
      <Background :pattern-color="dark ? '#FFFFFB' : '#aaa'" gap="8" />
      <MiniMap />
      <Controls>
        <cds-button
          class="controls-extra-button"
          size="md"
          style="padding-left: 4px"
          title="Auto align nodes"
          @click="alignNodesAndFitView()"
          :disabled="!nodes.some((node) => node.type != 'input')"
        >
          <img
            slot="icon"
            class="white-svg"
            width="16"
            height="16"
            src="@/assets/align--horizontal-center.svg"
          />
        </cds-button>
      </Controls>

      <Panel :position="PanelPosition.TopRight" class="controls">
        <cds-button
          size="md"
          class="cds-button-padding"
          v-if="doesOtherOrPresetsExist()"
          title="Toggle inputs visibility"
          @click="showHideInputNodes"
        >
          {{ showHideButtonTitle }}
          <img
            v-if="!inputNodesVisibility"
            slot="icon"
            class="white-svg"
            width="16"
            height="16"
            src="@/assets/upstream.svg"
          />
          <img
            v-else
            slot="icon"
            class="white-svg"
            width="16"
            height="16"
            src="@/assets/view--off.svg"
          />
        </cds-button>
        <cds-button
          size="md"
          class="cds-button-padding"
          @click="toggleTheme"
          title="Toggle light/dark mode"
        >
          <img
            slot="icon"
            class="white-svg"
            width="16"
            height="16"
            src="@/assets/brightness-contrast.svg"
          />
        </cds-button>
        <cds-button
          size="md"
          class="cds-button-padding"
          title="Download DSL"
          @click="downloadExperimentFiles"
        >
          <img
            slot="icon"
            class="white-svg"
            width="16"
            height="16"
            src="@/assets/download.svg"
          />
        </cds-button>
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

    <readWorkflowSidePanel
      v-if="modalVisibilities.readWorkflowSidePanel.value"
      title="Workflow Details"
      @side-panel-closed="toggleModalVisibility('readWorkflowSidePanel')"
      :node="clickedNode"
      :inputingEdges="inputingEdges"
      open="true"
    >
    </readWorkflowSidePanel>
    <readComponentSidePanel
      v-if="modalVisibilities.readComponentSidePanel.value"
      title="Component Details"
      @side-panel-closed="toggleModalVisibility('readComponentSidePanel')"
      :node="clickedNode"
      :inputingEdges="inputingEdges"
      open="true"
    >
    </readComponentSidePanel>
    <readExperimentInputsSidePanel
      v-if="modalVisibilities.readExperimentInputsSidePanel.value"
      @side-panel-closed="
        toggleModalVisibility('readExperimentInputsSidePanel')
      "
      :node="clickedNode"
      open="true"
    />
    <readEdgeSidePanel
      v-if="modalVisibilities.readEdgeSidePanel.value"
      @side-panel-closed="toggleModalVisibility('readEdgeSidePanel')"
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
import { canvasStore } from "@/canvas/stores/canvasStore";
//Node types
import WorkflowInputNode from "@/canvas/components/node_types/WorkflowInputNode.vue";
import WorkflowNode from "@/canvas/components/node_types/WorkflowNode.vue";
import ComponentNode from "@/canvas/components/node_types/ComponentNode.vue";
//Modals
import readWorkflowSidePanel from "@/canvas/components/sidePanels/st4sd_workflows/readWorkflowSidePanel.vue";
import readComponentSidePanel from "@/canvas/components/sidePanels/st4sd_components/readComponentSidePanel.vue";
import readExperimentInputsSidePanel from "@/canvas/components/sidePanels/experiment/readExperimentInputsSidePanel.vue";
import readEdgeSidePanel from "@/canvas/components/sidePanels/edges/readEdgeSidePanel.vue";
//Functions
import { downloadExperiment } from "@/canvas/functions/downloadJSON";
import {
  getWorkflowsDimensions,
  getWorkflowsEdges,
  hide,
} from "@/canvas/functions/hideExpand";
import { autoAlignNodes } from "@/canvas/functions/autoAlignNodes";
import TransformLibrary from "@/canvas/components/TransformLibrary.vue";

import "@carbon/web-components/es/components/notification/index.js";
import "@carbon/web-components/es/components/button/index.js";

/**
 * useVueFlow provides all event handlers and store properties
 * You can pass the composable an object that has the same properties as the VueFlow component props
 */

//Vue Flow setup
const elements = ref(canvasStore.DAG);

const {
  onInit,
  onEdgeDoubleClick,
  onConnect,
  addNodes,
  addEdges,
  onNodeDoubleClick,
  removeEdges,
  getIntersectingNodes,
  getConnectedEdges,
  fitView,
  nodes,
  edges,
} = useVueFlow("vue-flow-edit-canvas");

//Variable declaration
let clickedNode;
let clickedEdge;
let inputingEdges;

let modalVisibilities = {
  readEdgeSidePanel: ref(false),
  readExperimentInputsSidePanel: ref(false),
  readComponentSidePanel: ref(false),
  readWorkflowSidePanel: ref(false),
};

const toggleModalVisibility = (modal) => {
  modalVisibilities[modal].value = !modalVisibilities[modal].value;
};
let toastNotifications = ref([]);
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

onInit((vueFlowInstance) => {
  vueFlowInstance.fitView();
});

onNodeDoubleClick(({ node }) => {
  clickedNode = { ...node };
  inputingEdges = edges.value.filter((n) => n.target == node.id);
  if (node.type == "workflow") {
    toggleModalVisibility("readWorkflowSidePanel");
    //node type to change to component instead of empty string
    //there is an issue to track this
    //https://github.ibm.com/st4sd/overview/issues/517
  } else if (node.type == "component") {
    inputingEdges = edges.value.filter((n) => n.target == node.id);
    toggleModalVisibility("readComponentSidePanel");
  } else if (node.type == "input") {
    toggleModalVisibility("readExperimentInputsSidePanel");
  }
});

onEdgeDoubleClick(({ edge }) => {
  clickedEdge = { ...edge };
  toggleModalVisibility("readEdgeSidePanel");
});

/**
 * onConnect is called when a new connection/edge is created.
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

// AP: FIXME: Copied from ViewCanvas
const downloadExperimentFiles = () => {
  try {
    downloadExperiment(nodes.value, edges.value, props.id + "-transformed-dsl");
  } catch (error) {
    let dslDownloadError = {
      kind: "error",
      title: "Unable to download DSL file",
      subtitle: "",
      caption: error.message,
    };
    toastNotifications.value.push(dslDownloadError);
  }
};

const emit = defineEmits(["transformSelected"]);

const handleTransformSelected = (loading, transformId) => {
  emit("transformSelected", loading, transformId);
};

function alignNodesAndFitView() {
  autoAlignNodes(
    nodes.value,
    edges.value,
    getIntersectingNodes,
    getConnectedEdges,
  ).then(({ newNodes, newEdges }) => {
    edges.value = [];
    nodes.value = [];
    /*
      AP (25/09/24):
      We're adding a delay of 5ms due to this issue:
      https://github.ibm.com/st4sd/st4sd-registry-ui/issues/811
    */
    setTimeout(() => {
      addNodes(newNodes);
      addEdges(newEdges);
      nextTick(() => fitView());
    }, 5);
  });
}
</script>
<style scoped lang="scss">
@use "@/canvas/styles/main.scss";
@use "@/styles/svg.scss";
@use "@/styles/toast-notification-styles.scss";
</style>
