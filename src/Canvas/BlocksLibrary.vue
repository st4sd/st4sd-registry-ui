<template>
  <aside>
    <div id="controls">
      <div class="title">Component Library</div>
      <bx-search
        placeholder="Search here"
        @keyup="updateList"
        @input="searchTerm = $event.target.value"
        :value="searchTerm"
        class="library-search-bar"
      />
      <bx-btn
        title="Add Component"
        icon-layout
        @click="toggleAddModal"
        size="sm"
      >
        <!-- <img width="16" heigth="16" src="../assets/plus.svg" /> -->
        Add component +
      </bx-btn>
    </div>
    <div id="nodes-container">
      <div v-for="element in elements" :key="element.id" class="node">
        <div
          class="vue-flow__node-workflow"
          :draggable="true"
          @dragstart="onDragStart($event, element)"
          v-if="element.type == 'workflow'"
          @dblclick="onDoubleClick(element)"
        >
          {{ element.label }}
        </div>
        <div
          class="vue-flow__node-default"
          :draggable="true"
          @dragstart="onDragStart($event, element)"
          @dblclick="onDoubleClick(element)"
          v-else
        >
          {{ element.label }}
        </div>
      </div>
    </div>
    <createComponent
      @bx-modal-closed="toggleAddModal"
      @add="addNode(newNode)"
      v-if="modalAddActive"
      title="Add Component"
      @addedNode="addNode"
    />
    <readWorkflow
      v-if="modalWorkflowActive"
      title="Workflow Details"
      @bx-modal-closed="toggleWorkflowModal"
      :node="clickedNode"
      :inputingEdges="[]"
    />
    <readComponent
      v-if="modalComponentActive"
      title="Component Details"
      @bx-modal-closed="toggleComponentModal"
      :node="clickedNode"
      :inputingEdges="[]"
    />
  </aside>
</template>

<script setup>
import { ref } from "vue";
import axios from "axios";
import getBlocks from "@/Canvas/getBlocks";
import { nodeStore } from "@/Canvas/stores/nodeStore";
import readWorkflow from "@/Canvas/Modals/nodeCRUD/readWorkflow.vue";
import readComponent from "@/Canvas/Modals/nodeCRUD/readComponent.vue";
import createComponent from "@/Canvas/Modals/nodeCRUD/createComponent.vue";
import "@carbon/web-components/es/components/input/index.js";
import "@carbon/web-components/es/components/number-input/index.js";
import "@carbon/web-components/es/components/dropdown/index.js";
import "@carbon/web-components/es/components/search/index.js";

const urls = ["analysis", "simulation", "parent", "parent2", "BandGapDFT"];
let id = 0;
const getId = () => `dndnode_${id++}`;

async function getNodesFromUrls() {
  let nodes = [];
  let data = {};
  for (const url of urls) {
    await axios
      .get(
        window.location.origin +
          "/registry-ui/backend/canvas/hardcodeddsl/" +
          url,
      )
      .then((graphResponse) => {
        data = graphResponse.data;
      });

    const newArray = getBlocks(data);
    newArray.forEach((element) => {
      //Needs clarifying on the conditions of identifying a duplicate
      let n = nodes.find((o) => JSON.stringify(o) === JSON.stringify(element));
      if (n == undefined) {
        if (element.parentNode == undefined) {
          element.parentNode = "";
          element.id = getId();
        }
        nodes.push(element);
      }
    });
  }
  return nodes;
}

const onDragStart = (event, element) => {
  nodeStore.setExportedNode(element);
};

const elements = ref();
const fullElements = ref(
  getNodesFromUrls().then((data) => {
    fullElements.value = data;
    elements.value = data;
  }),
);

const modalAddActive = ref(false);
const toggleAddModal = () => {
  modalAddActive.value = !modalAddActive.value;
};

const addNode = (newNode) => {
  newNode.id = getId();
  fullElements.value.push(newNode);
  toggleAddModal();
};

//Search bar function
let searchTerm = "";
const updateList = () => {
  let searchResult = [];
  if (searchTerm.length > 0) {
    fullElements.value.forEach((item) => {
      if (item.label.toLowerCase().includes(searchTerm.toLowerCase())) {
        searchResult.push(item);
      }
    });
    elements.value = searchResult;
  } else {
    elements.value = fullElements.value;
  }
};

const modalWorkflowActive = ref(false);
const toggleWorkflowModal = () => {
  modalWorkflowActive.value = !modalWorkflowActive.value;
};

const modalComponentActive = ref(false);
const toggleComponentModal = () => {
  modalComponentActive.value = !modalComponentActive.value;
};

let clickedNode;
const onDoubleClick = (node) => {
  clickedNode = { ...node };
  if (node.type == "workflow") {
    toggleWorkflowModal();
  } else if (node.type == "") {
    toggleComponentModal();
  }
};
</script>

<style scoped lang="scss">
.title {
  padding-top: 1.5rem;
}

#controls {
  margin-bottom: 1rem;
}
</style>
