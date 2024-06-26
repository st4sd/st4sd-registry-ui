<template>
  <!-- Error Notification -->
  <div id="toast-notification-container">
    <bx-toast-notification
      v-for="(notification, notifIdx) in toastNotifications"
      :key="notifIdx"
      timeout="5000"
      :kind="notification.kind"
      :title="notification.title"
      :subtitle="notification.subtitle"
      :caption="notification.caption"
    />
  </div>
  <!--  https://vueflow.dev/examples/dnd.html -->
  <div class="dndflow">
    <VueFlow
      class="basicflow"
      :delete-key-code="false"
      :class="{ dark }"
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
            class="white-svg"
            width="16"
            height="16"
            src="@/assets/brightness-contrast.svg"
          />
        </bx-btn>
        <bx-btn size="sm" title="Download DSL" @click="downloadExperimentFiles">
          <img
            class="white-svg"
            width="16"
            height="16"
            src="@/assets/download.svg"
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

    <readWorkflowSidePanel
      v-if="modalVisibilities.readWorkflowSidePanel.value"
      title="Workflow Details"
      @closeSidePanel="toggleModalVisibility('readWorkflowSidePanel')"
      :node="clickedNode"
      :inputingEdges="inputingEdges"
      open="true"
    >
    </readWorkflowSidePanel>
    <readComponentSidePanel
      v-if="modalVisibilities.readComponentSidePanel.value"
      title="Component Details"
      @closeSidePanel="toggleModalVisibility('readComponentSidePanel')"
      :node="clickedNode"
      :inputingEdges="inputingEdges"
      open="true"
    >
    </readComponentSidePanel>
    <readExperimentInputsSidePanel
      v-if="modalVisibilities.readExperimentInputsSidePanel.value"
      @closeSidePanel="toggleModalVisibility('readExperimentInputsSidePanel')"
      :node="clickedNode"
      open="true"
    />
    <readEdgeSidePanel
      v-if="modalVisibilities.readEdgeSidePanel.value"
      @closeSidePanel="toggleModalVisibility('readEdgeSidePanel')"
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
import { downloadExperiment } from "@/canvas/functions/downloadJSON";
import {
  getWorkflowsDimensions,
  getWorkflowsEdges,
  hide,
} from "@/canvas/functions/hideExpand";
import TransformLibrary from "@/canvas/components/TransformLibrary.vue";
import "@carbon/web-components/es/components/notification/index.js";

/**
 * useVueFlow provides all event handlers and store properties
 * You can pass the composable an object that has the same properties as the VueFlow component props
 */

//Vue Flow setup
const elements = ref(canvasStore.DAG);

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

/**
 * This is a Vue Flow event-hook which can be listened to from anywhere you call the composable, instead of only on the main component
 *
 * onPaneReady is called when viewpane & nodes have visible dimensions
 */
onPaneReady(({ fitView }) => {
  fitView();
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
</script>
<style lang="scss">
@import "@/canvas/styles/main.scss";
@import "@/styles/svg.scss";
@import "@/styles/toast-notification-styles.scss";
</style>
