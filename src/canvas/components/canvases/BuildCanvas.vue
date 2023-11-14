<template>
  <div class="dndflow" @drop="onDrop">
    <VueFlow
      :class="{ dark }"
      :default-zoom="1"
      :elevate-edges-on-select="true"
      :delete-key-code="false"
      :min-zoom="0.2"
      :max-zoom="4"
      class="basicflow"
      fit-view-on-init
      @dragover="onDragOver"
    >
      <Background :pattern-color="dark ? '#FFFFFB' : '#aaa'" gap="8" />
      <MiniMap />
      <Controls />
      <Panel :position="PanelPosition.TopRight" class="controls">
        <bx-btn
          title="Configure Experiment"
          @click="toggleModalVisibility('selectEntryPointModal')"
          kind="primary"
          :disabled="
            allNodes.filter((node) => node.type == 'workflow').length < 1
          "
        >
          Select Entrypoint
        </bx-btn>
        <bx-btn
          size="sm"
          title="Add Workflow"
          @click="toggleModalVisibility('createWorkflowModal')"
        >
          + Add workflow
        </bx-btn>

        <bx-btn size="sm" @click="toggleTheme" title="Toggle light/dark mode">
          <img
            class="canvas-logo"
            width="16"
            heigth="16"
            src="@/assets/brightness-contrast.svg"
          />
        </bx-btn>
        <bx-btn
          size="sm"
          title="Download canvas project files"
          @click="downloadExperimentFiles"
        >
          <img
            class="canvas-logo"
            width="16"
            heigth="16"
            src="@/assets/download.svg"
          />
        </bx-btn>
        <bx-btn size="sm" title="Save canvas project" @click="saveGraph">
          <img
            class="canvas-logo"
            width="16"
            heigth="16"
            src="@/assets/save.svg"
          />
        </bx-btn>
        <bx-btn
          size="sm"
          title="Load canvas from file"
          @click="toggleModalVisibility('fileUploadModal')"
        >
          <img
            class="canvas-logo"
            width="16"
            heigth="16"
            src="@/assets/upload.svg"
          />
        </bx-btn>
        <bx-btn
          size="sm"
          title="Register experiment"
          @click="toggleModalVisibility('registerExperimentModal')"
          kind="secondary"
          :disabled="allNodes.find((node) => node.isEntry == true) == undefined"
        >
          Register Experiment
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
    <BlocksLibrary />
    <!-- CRUD operations -->
    <createWorkflowModal
      v-if="modalVisibilities.createWorkflowModal.value"
      @added="addWorkflow"
      @bx-modal-closed="toggleModalVisibility('createWorkflowModal')"
    />
    <updateWorkflowModal
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
    <updateComponentModal
      v-if="modalVisibilities.updateComponentModal.value"
      :node="selectedNode"
      :allNodes="allNodes"
      :parentNode="parentNode"
      @bx-modal-closed="toggleModalVisibility('updateComponentModal')"
      @updated="updateNode"
      @delete="openDeleteModal"
      @removeParent="removeParentNode"
    />
    <createEdgeModal
      v-if="modalVisibilities.createEdgeModal.value"
      :edgeProp="newEdge"
      :allNodes="allNodes"
      :allEdges="allEdges"
      @bx-modal-closed="toggleModalVisibility('createEdgeModal')"
      @created="addEdge"
    />
    <updateEdgeModal
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
      :nodeType="nodeType"
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
    <selectEntryPointModal
      v-if="modalVisibilities.selectEntryPointModal.value"
      :allNodes="allNodes"
      @bx-modal-closed="toggleModalVisibility('selectEntryPointModal')"
      @update="toggleModalVisibility('selectEntryPointModal')"
    />
    <fileUploadModal
      @upload="displayUploadedElements"
      v-if="modalVisibilities.fileUploadModal.value"
      @bx-modal-closed="toggleModalVisibility('fileUploadModal')"
      title="Upload Files"
      open="true"
    />
    <registerExperiment
      v-if="modalVisibilities.registerExperimentModal.value"
      @bx-modal-closed="toggleModalVisibility('registerExperimentModal')"
      open="true"
      :name="props.pvep"
      :allNodes="allNodes"
      :allEdges="allEdges"
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
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import BlocksLibrary from "@/canvas/components/BlocksLibrary";
//Modals
import createEdgeModal from "@/canvas/components/modals/edges/createEdgeModal.vue";
import updateEdgeModal from "@/canvas/components/modals/edges/updateEdgeModal.vue";
import createWorkflowModal from "@/canvas/components/modals/st4sd_workflows/createWorkflowModal.vue";
import updateWorkflowModal from "@/canvas/components/modals/st4sd_workflows/updateWorkflowModal.vue";
import nestNodeModal from "@/canvas/components/modals/st4sd_workflows/nestNodeModal";
import updateComponentModal from "@/canvas/components/modals/st4sd_components/updateComponentModal.vue";
import selectEntryPointModal from "@/canvas/components/modals/experiment/selectEntryPointModal.vue";
import deleteModal from "@/canvas/components/modals/delete_modal/deleteModal.vue";
import fileUploadModal from "@/canvas/components/modals/experiment/fileUploadModal.vue";
import registerExperiment from "@/canvas/components/modals/experiment/registerExperiment.vue";

//Stores
import { canvasStore } from "@/canvas/stores/canvasStore";

//Node types
import ComponentNode from "@/canvas/components/node_types/ComponentNode.vue";
import WorkflowNode from "@/canvas/components/node_types/WorkflowNode";
import WorkflowInputNode from "@/canvas/components/node_types/WorkflowInputNode.vue";

//Functions
import { downloadExperiment, download } from "@/canvas/functions/downloadJSON";
import { hide, getWorkflowsEdges } from "@/canvas/functions/hideExpand";
import {
  setUpCanvas,
  addWorkflowNode,
  addWorkflowNodesToCanvas,
  convertToBuildCanvasSystem,
  isConnectionValid,
} from "@/canvas/functions/canvasFunctions";
import {
  isNestingValid,
  removeStep,
  removeNodeAndStepReference,
} from "@/canvas/functions/stepFunctions";

import "@carbon/web-components/es/components/input/index.js";
import "@carbon/web-components/es/components/textarea/index.js";
import { updateNodeLabel } from "@/canvas/functions/updateNodeLabel";
import { createDAG } from "@/canvas/functions/createDAG";
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
  //Change ID system and add workflow dimensions
  convertToBuildCanvasSystem(
    uploadedGraph.nodes,
    uploadedGraph.edges,
    workflowDimensions,
    getId,
  );
  addNodes(uploadedGraph.nodes);
  addEdges(uploadedGraph.edges);
};

let elements = {};
if (props.pvep != "") {
  getGraph();
} else {
  setUpCanvas(elements);
}

const {
  onNodeDragStop,
  onConnect,
  addEdges,
  addNodes,
  onEdgeDoubleClick,
  onNodeDoubleClick,
  removeEdges,
  removeNodes,
  findNode,
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
  selectEntryPointModal: ref(false),
  nestingModal: ref(false),
  stepExecuteModal: ref(false),
  deleteModal: ref(false),
  fileUploadModal: ref(false),
  registerExperimentModal: ref(false),
};

const displayUploadedElements = (files) => {
  if (Array.isArray(files)) {
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
  } else {
    let graphFileContents = "";
    readFile(files).then(function (graphResult) {
      graphFileContents = graphResult;

      addNodes(graphFileContents.nodes);
      addEdges(graphFileContents.edges);
      toggleModalVisibility("fileUploadModal");
    });
  }
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
  const newNode = JSON.parse(JSON.stringify(canvasStore.node));
  const { left, top } = vueFlowRef.value.getBoundingClientRect();

  newNode.position = project({
    x: event.clientX - left,
    y: event.clientY - top,
  });
  let id;
  if (newNode.type == "workflow") {
    // In a workflow newNode is used to generate the whole workflow and thus
    // newNode itself will not be used in the workflow and will be replaced with
    // the workflow's entry point node, so we manually return the new id to be used
    // in the nextTick() function
    id = addWorkflowNodesToCanvas(
      newNode,
      workflowDimensions,
      getId,
      addNodes,
      addEdges,
    );
  } else {
    newNode.id = getId();
    id = newNode.id;
    addNodes([newNode]);
  }

  // align node position after drop, so it's centered to the mouse
  nextTick(() => {
    const node = findNode(id);
    const stop = watch(
      () => node.dimensions,
      (dimensions) => {
        if (dimensions.width > 0 && dimensions.height > 0) {
          //For workflows we want the mouse to be in the top centre
          if (node.type == "workflow") {
            node.position = {
              x: node.position.x - node.dimensions.width / 2,
              y: node.position.y - node.dimensions.height / 6,
            };
          } else {
            node.position = {
              x: node.position.x - node.dimensions.width / 2,
              y: node.position.y - node.dimensions.height / 2,
            };
          }

          stop();
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
  let existingEdge = edges.value.find(
    (edge) =>
      edge.source == edgeInProgress.source &&
      edge.target == edgeInProgress.target,
  );
  if (existingEdge != undefined) {
    selectedEdge = existingEdge;
    nodeType = "connection";
    toggleModalVisibility("updateEdgeModal");
  } else if (isConnectionValid(newEdge, findNode)) {
    toggleModalVisibility("createEdgeModal");
  }
});

let nodeType;
let selectedEdge;
onEdgeDoubleClick(({ edge }) => {
  selectedEdge = edge;
  nodeType = "connection";
  toggleModalVisibility("updateEdgeModal");
});

const addEdge = (newEdge) => {
  if (Object.keys(newEdge.definition).length > 0) {
    addEdges([newEdge]);
  }
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
  if (updatedNode.type == "workflow") {
    toggleModalVisibility("updateWorkflowModal");
  } else {
    selectedNode.label = updatedNode.label;
    selectedNode.definition = updatedNode.definition;
    toggleModalVisibility("updateComponentModal");
  }
};

const openDeleteModal = () => {
  toggleModalVisibility("deleteModal");
  //close update modals
  if (nodeType == "workflow") {
    toggleModalVisibility("updateWorkflowModal");
  } else if (nodeType == "component") {
    toggleModalVisibility("updateComponentModal");
  } else if (nodeType == "connection") {
    toggleModalVisibility("updateEdgeModal");
  }
};

const deleteNode = () => {
  if (nodeType == "connection") {
    removeEdges([selectedEdge]);
  } else {
    removeNodeAndStepReference(selectedNode, findNode, removeNodes);
  }
  toggleModalVisibility("deleteModal");
};

const removeParentNode = () => {
  selectedNode.parentNode = undefined;
  selectedNode.expandParent = false;
  //Remove it as a step from parent WF
  removeStep(parentNode, selectedNode);
  //We call this function after removeStep as removeStep deletes the stepId and then
  //updateNodeLabel tests if the stepId exists or not
  updateNodeLabel(selectedNode);
  removeConnectingEdges(selectedNode);
  if (nodeType == "workflow") {
    toggleModalVisibility("updateWorkflowModal");
  } else if (nodeType == "component") {
    toggleModalVisibility("updateComponentModal");
  }
};

const removeConnectingEdges = (node) => {
  const connectingEdges = edges.value.filter(
    (edge) => edge.source == node.id || edge.target == node.id,
  );
  //remove edges that have any child of the node as source//
  removeEdges(connectingEdges);
};

const downloadExperimentFiles = () => {
  downloadExperiment(nodes.value, edges.value, "experiment");
};

const saveGraph = () => {
  let d = new Date();
  download(`build-canvas-${d.toISOString()}.json`, {
    nodes: nodes._object.nodes,
    edges: edges._object.edges,
  });
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

onMounted(() => {
  const route = useRoute();
  if (route.query.registrationCancelled == "true") {
    let graph = canvasStore.graph;
    addNodes(graph.nodes);
    addEdges(graph.edges);
    canvasStore.setGraph({});
  }
});
</script>

<style lang="scss" src="@/canvas/styles/main.scss"></style>
