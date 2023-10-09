<template>
  <aside>
    <div id="controls">
      <div id="title">Component Library</div>
      <div id="buttons">
        <bx-btn
          title="Create Component"
          icon-layout
          @click="toggleModalVisibility('createComponentModal')"
          size="sm"
        >
          <img width="16" heigth="16" src="@/assets/plus.svg" />
          New Component
        </bx-btn>
      </div>
      <bx-search
        placeholder="Search here"
        @keyup="updateList"
        @input="searchTerm = $event.target.value"
        :value="searchTerm"
        class="library-search-bar"
      />
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
          class="vue-flow__node-component"
          :draggable="true"
          @dragstart="onDragStart($event, element)"
          @dblclick="onDoubleClick(element)"
          v-else
        >
          {{ element.label }}
        </div>
      </div>
    </div>
    <createComponentModal
      v-if="modalVisibilities.createComponentModal.value"
      @componentAdded="addComponentNode"
      @bx-modal-closed="toggleModalVisibility('createComponentModal')"
    />
    <readWorkflowModal
      v-if="modalVisibilities.readWorkflowModal.value"
      title="Workflow Details"
      @bx-modal-closed="toggleModalVisibility('readWorkflowModal')"
      :node="clickedNode"
      :inputingEdges="[]"
    />
    <readComponentModal
      v-if="modalVisibilities.readComponentModal.value"
      title="Component Details"
      @bx-modal-closed="toggleModalVisibility('readComponentModal')"
      :node="clickedNode"
      :inputingEdges="[]"
    />
  </aside>
</template>

<script setup>
import { ref } from "vue";
import axios from "axios";
import getBlocks from "@/canvas/functions/getBlocks";
import { nodeStore } from "@/canvas/stores/nodeStore";
import readWorkflowModal from "@/canvas/components/modals/st4sd_workflows/readWorkflowModal.vue";
import readComponentModal from "@/canvas/components/modals/st4sd_components/readComponentModal.vue";
import createComponentModal from "@/canvas/components/modals/st4sd_components/createComponentModal.vue";
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

let modalVisibilities = {
  readComponentModal: ref(false),
  readWorkflowModal: ref(false),
  createComponentModal: ref(false),
};

const toggleModalVisibility = (modal) => {
  modalVisibilities[modal].value = !modalVisibilities[modal].value;
};

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

const addComponentNode = (newComponent) => {
  newComponent.id = getId();
  fullElements.value.push(newComponent);
  toggleModalVisibility("createComponentModal");
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

let clickedNode;
const onDoubleClick = (node) => {
  clickedNode = { ...node };
  if (node.type == "workflow") {
    toggleModalVisibility("readWorkflowModal");
  } else if (node.type == "component") {
    toggleModalVisibility("readComponentModal");
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
