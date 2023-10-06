<template>
  <div class="dndflow" @drop="onDrop">
    <VueFlow
      @dragover="onDragOver"
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
          title="Configure Experiment"
          @click="toggleModalVisibility('configureExperimentModal')"
        >
          Configure Experiment
        </bx-btn>
        <bx-btn
          size="sm"
          title="Add Workflow"
          @click="toggleModalVisibility('createWorkflowModal')"
        >
          Add workflow +
        </bx-btn>

        <bx-btn size="sm" @click="toggleTheme" title="Toggle light/dark mode">
          <img
            class="canvas-logo"
            width="16"
            heigth="16"
            src="../assets/brightness-contrast.svg"
          />
        </bx-btn>
        <bx-btn
          size="sm"
          title="Download canvas project files"
          @click="downloadJSON"
        >
          <img
            class="canvas-logo"
            width="16"
            heigth="16"
            src="../assets/download.svg"
          />
        </bx-btn>
        <bx-btn
          size="sm"
          title="Upload canvas project files"
          @click="toggleModalVisibility('fileUploadModal')"
        >
          <img
            class="canvas-logo"
            width="16"
            heigth="16"
            src="../assets/upload.svg"
          />
        </bx-btn>
      </Panel>
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
    <BlocksLibrary />
    <!-- CRUD operations -->
    <createWorkflowModal
      v-if="modalVisibilities.createWorkflowModal.value"
      @added="addWorkflow"
      @bx-modal-closed="toggleModalVisibility('createWorkflowModal')"
    />
    <updateWorkflow
      v-if="modalVisibilities.updateWorkflowModal.value"
      :node="selectedNode"
      :allNodes="allNodes"
      :parentNode="parentNode"
      @bx-modal-closed="toggleModalVisibility('updateWorkflowModal')"
      @update="updateNode"
      @delete="openDeleteModal"
      @removeParent="removeParentNode"
      @stepDeleted="removeConnectingEdges"
    />
    <updateComponent
      v-if="modalVisibilities.updateComponentModal.value"
      :node="selectedNode"
      :parentNode="parentNode"
      @bx-modal-closed="toggleModalVisibility('updateComponentModal')"
      @updated="updateNode"
      @delete="openDeleteModal"
      @removeParent="removeParentNode"
    />
    <createEdge
      v-if="modalVisibilities.createEdgeModal.value"
      :edgeProp="newEdge"
      :allNodes="allNodes"
      :allEdges="allEdges"
      @bx-modal-closed="toggleModalVisibility('createEdgeModal')"
      @finished="addConnection"
    />
    <updateEdge
      v-if="modalVisibilities.updateEdgeModal.value"
      :edgeProp="selectedEdge"
      :allNodes="allNodes"
      :allEdges="allEdges"
      @bx-modal-closed="toggleModalVisibility('updateEdgeModal')"
      @update="toggleModalVisibility('updateEdgeModal')"
      @delete="openDeleteModal"
    />
    <deleteModal
      v-if="modalVisibilities.deleteModal.value"
      :title="deleteModalTitle"
      :warningMessage="deleteWarningMessage"
      @delete="deleteNode"
      @bx-modal-closed="toggleModalVisibility('deleteModal')"
    />
    <!-- Nesting -->
    <nestNodeModal
      v-if="modalVisibilities.nestingModal.value"
      :toBeNestedNode="nestingNode"
      :nestingWorkflows="nestingWFs"
      :allNodes="allNodes"
      @bx-modal-closed="toggleModalVisibility('nestingModal')"
      @done="addStep"
    />
    <!-- Experiment configuration -->
    <configureExperiment
      v-if="modalVisibilities.configureExperimentModal.value"
      :allNodes="allNodes"
      @bx-modal-closed="toggleModalVisibility('configureExperimentModal')"
      @update="toggleModalVisibility('configureExperimentModal')"
    />
    <fileUploadModal
      @upload="displayUploadedElements"
      v-if="modalVisibilities.fileUploadModal.value"
      @bx-modal-closed="toggleModalVisibility('fileUploadModal')"
      title="Upload Files"
      open="true"
    />
  </div>
</template>

<script setup>
import "@carbon/web-components/es/components/button/index.js";
import "@carbon/web-components/es/components/input/index.js";
import "@carbon/web-components/es/components/textarea/index.js";

import { nextTick, watch } from "vue";
import {
  Background,
  Controls,
  MiniMap,
  Panel,
  PanelPosition,
} from "@vue-flow/additional-components";
import { VueFlow, useVueFlow } from "@vue-flow/core";
import { ref } from "vue";
import BlocksLibrary from "@/Canvas/BlocksLibrary";
//Modals
import createEdge from "@/Canvas/Modals/edgeCRUD/createEdge.vue";
import updateEdge from "@/Canvas/Modals/edgeCRUD/updateEdge.vue";
import createWorkflowModal from "@/Canvas/Modals/nodeCRUD/createWorkflow.vue";
import updateWorkflow from "@/Canvas/Modals/nodeCRUD/updateWorkflow.vue";
import updateComponent from "@/Canvas/Modals/nodeCRUD/updateComponent.vue";
import nestNodeModal from "@/Canvas/Modals/nestNodeModal";
import configureExperiment from "@/Canvas/Modals/configureExperiment.vue";
import deleteModal from "@/Canvas/Modals/deleteModal.vue";
import fileUploadModal from "@/Canvas/Modals/fileUploadModal.vue";

//Stores
import { expDAGStore } from "@/Canvas/stores/expDAGStore";
import { nodeStore } from "@/Canvas/stores/nodeStore";

//Node types
import WorkflowNode from "@/Canvas/Nodes/WorkflowNode";
import WorkflowInputNode from "@/Canvas/Nodes/WorkflowInputNode.vue";

//Functions
import { toJSON } from "@/Canvas/downloadJSON";
import { hide, getWorkflowsEdges } from "@/Canvas/hideExpand";
import {
  setUpCanvas,
  addWorkflowNode,
  addWorkflowNodesToCanvas,
  isConnectionValid,
} from "@/Canvas/canvasFunctions";
import {
  isNestingValid,
  removeStep,
  removeNodeAndNestedNodes,
} from "@/Canvas/stepFunctions";

import "@carbon/web-components/es/components/input/index.js";
import "@carbon/web-components/es/components/textarea/index.js";

import { createDAG } from "@/Canvas/createDAG";
import axios from "axios";

const props = defineProps({
  pvep: {
    type: String,
    default: "",
  },
});

const emit = defineEmits(["updateLoading"]);

const getGraph = async () => {
  emit("updateLoading", true);
  let graphData;
  let inputsData;
  await axios
    .get(window.location.origin + "/registry-ui/backend/canvas/" + props.pvep)
    .then((graphResponse) => {
      if (graphResponse.data.length != 0) {
        graphData = graphResponse.data;
      }
    });
  await axios
    .get(
      window.location.origin + "/registry-ui/backend/experiments/" + props.pvep,
    )
    .then((inputsResponse) => {
      if (inputsResponse.data.length != 0) {
        inputsData = inputsResponse.data.entry;
      }
    });
  emit("updateLoading", false);
  nodes.value = [];
  edges.value = [];
  const uploadedGraph = createDAG(graphData, inputsData);

  addNodes(uploadedGraph.nodes);
  addEdges(uploadedGraph.edges);
};

let elements = {};
if (props.pvep != "") {
  getGraph();
} else {
  elements = expDAGStore.exportedDAG;
  elements.elevateEdgesOnSelect = true;
  setUpCanvas(elements);
}

const {
  onNodeDragStop,
  onConnect,
  addEdges,
  //setTransform,
  onEdgeDoubleClick,
  onNodeDoubleClick,
  removeEdges,
  removeNodes,
  findNode,
  addNodes,
  project,
  vueFlowRef,
  nodes,
  edges,
} = useVueFlow(elements);

let allNodes = nodes;
let allEdges = edges;
let workflowDimensions = {};
let id = ref(0);
const getId = () => `dndnode_${id.value++}`;
const onDragOver = (event) => {
  event.preventDefault();
  if (event.dataTransfer) {
    event.dataTransfer.dropEffect = "move";
  }
};

let modalVisibilities = {
  createWorkflowModal: ref(false),
  createEdgeModal: ref(false),
  updateEdgeModal: ref(false),
  updateWorkflowModal: ref(false),
  updateComponentModal: ref(false),
  configureExperimentModal: ref(false),
  nestingModal: ref(false),
  stepExecuteModal: ref(false),
  deleteModal: ref(false),
  fileUploadModal: ref(false),
};

const displayUploadedElements = (files) => {
  let dslFileContents = "";
  let inputFileContents = "";

  readFile(files[0]).then(function (dslResult) {
    dslFileContents = dslResult;

    readFile(files[1]).then(function (inputResult) {
      inputFileContents = inputResult;
      nodes.value = [];
      edges.value = [];
      const uploadedGraph = createDAG(dslFileContents, inputFileContents);

      addNodes(uploadedGraph.nodes);
      addEdges(uploadedGraph.edges);

      toggleModalVisibility("fileUploadModal");
    });
  });
};

function readFile(file) {
  return new Promise((resolve, reject) => {
    var fileReader = new FileReader();
    fileReader.onload = (f) => {
      const contence = JSON.parse(f.target.result);
      resolve(contence);
    };
    fileReader.onerror = reject;
    fileReader.readAsText(file);
  });
}

const toggleModalVisibility = (modal) => {
  modalVisibilities[modal].value = !modalVisibilities[modal].value;
};

const onDrop = (event) => {
  //copy the element so we do not change the source
  const newNode = JSON.parse(JSON.stringify(nodeStore.exportedNode));
  const { left, top } = vueFlowRef.value.getBoundingClientRect();

  newNode.position = project({
    x: event.clientX - left,
    y: event.clientY - top,
  });
  newNode.id = getId();
  if (newNode.type == "workflow") {
    addWorkflowNodesToCanvas(
      newNode,
      workflowDimensions,
      getId,
      addNodes,
      addEdges,
    );
  } else {
    addNodes([newNode]);
  }

  // align node position after drop, so it's centered to the mouse
  nextTick(() => {
    const node = findNode(newNode.id);
    const stop = watch(
      () => node.dimensions,
      (dimensions) => {
        if (dimensions.width > 0 && dimensions.height > 0) {
          node.position = {
            x: node.position.x - node.dimensions.width / 2,
            y: node.position.y - node.dimensions.height / 2,
          };
          stop();
          //resetTransform();
        }
      },
      { deep: true, flush: "post" },
    );
  });
};

const addWorkflow = (workflow, input) => {
  addWorkflowNode(workflow, input, workflowDimensions, getId, addNodes);
  toggleModalVisibility("createWorkflowModal");
};

let nestingNode = {};
let nestingWFs = [];
onNodeDragStop((event) => {
  let { isNesting, nestingWorkflows } = isNestingValid(
    event.node,
    event.intersections,
    nodes.value,
  );
  if (isNesting) {
    nestingNode = { ...event.node };
    nestingWFs = nestingWorkflows;
    toggleModalVisibility("nestingModal");
  }
});

let newEdge;
onConnect((edgeInProgress) => {
  newEdge = edgeInProgress;
  if (isConnectionValid(newEdge, findNode)) {
    toggleModalVisibility("createEdgeModal");
  }
});

let nodeType;
let selectedEdge;
onEdgeDoubleClick(({ edge }) => {
  selectedEdge = edge;
  nodeType = "edge";
  toggleModalVisibility("updateEdgeModal");
});

const addConnection = (newEdge) => {
  addEdges([newEdge]);
  toggleModalVisibility("createEdgeModal");
};

const dark = ref(false);

/**
 * Resets the current viewpane transformation (zoom & pan)
 */
//const resetTransform = () => setTransform({ x: 0, y: 0, zoom: 1 });

const toggleTheme = () => (dark.value = !dark.value);

//NODE - COMPONENT
let selectedNode;
let parentNode;

onNodeDoubleClick(({ node }) => {
  selectedNode = node;
  parentNode = findNode(node.parentNode);
  if (node.type == "component") {
    nodeType = "component";
    toggleModalVisibility("updateComponentModal");
  } else {
    if (node.type == "workflow-input") {
      selectedNode = findNode(node.parentNode);
      parentNode = findNode(selectedNode.parentNode);
    }
    nodeType = "workflow";
    toggleModalVisibility("updateWorkflowModal");
  }
});

const updateNode = (updatedNode) => {
  selectedNode.label = updatedNode.label;
  selectedNode.definition = updatedNode.definition;
  if (updatedNode.type == "workflow") {
    nodes.value.find(
      (node) =>
        node.type == "workflow-input" && node.parentNode == updatedNode.id,
    ).label = `${updatedNode.label} inputs`;
    toggleModalVisibility("updateWorkflowModal");
  } else {
    toggleModalVisibility("updateComponentModal");
  }
};

let deleteModalTitle;
let deleteWarningMessage;
const openDeleteModal = () => {
  if (nodeType == "workflow") {
    deleteModalTitle = "Delete workflow";
    deleteWarningMessage = "Are you sure you want to delete this workflow?";
  } else if (nodeType == "component") {
    deleteModalTitle = "Delete component";
    deleteWarningMessage = "Are you sure you want to delete this component?";
  } else {
    deleteModalTitle = "Delete connection";
    deleteWarningMessage = "Are you sure you want to delete this connection?";
  }
  toggleModalVisibility("deleteModal");
};

const deleteNode = () => {
  if (nodeType == "workflow") {
    removeNodeAndNestedNodes(selectedNode, nodes, findNode, removeNodes);
    toggleModalVisibility("updateWorkflowModal");
  } else if (nodeType == "component") {
    removeNodeAndNestedNodes(selectedNode, nodes, findNode, removeNodes);
    toggleModalVisibility("updateComponentModal");
  } else {
    removeEdges([selectedEdge]);
    toggleModalVisibility("updateEdgeModal");
  }
  toggleModalVisibility("deleteModal");
};

const removeParentNode = () => {
  selectedNode.parentNode = undefined;
  selectedNode.expandParent = false;
  //Remove it as a step from parent WF
  removeStep(parentNode, selectedNode);
  removeConnectingEdges(selectedNode);
};

const removeConnectingEdges = (node) => {
  const connectingEdges = edges.value.filter(
    (edge) => edge.source == node.id || edge.target == node.id,
  );
  //remove edges that have any child of the node as source//
  removeEdges(connectingEdges);
};

const downloadJSON = () => {
  toJSON(nodes.value, edges.value, "experiment");
};

const onChangeVisibility = (node, isHidden) => {
  let result = hide(
    node,
    nodes.value,
    edges.value,
    workflowDimensions,
    getWorkflowsEdges(nodes.value, edges.value),
    isHidden,
  );
  removeEdges(result.toDelete);
};

const addStep = () => {
  toggleModalVisibility("nestingModal");
};
</script>

<style lang="scss" src="@/Canvas/main.scss"></style>
