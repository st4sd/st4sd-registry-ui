<template>
  <aside>
    <div id="controls">
      <div id="title">Template Library</div>
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
        <bx-btn
          v-if="isGlobalRegistryLibraryEnabled"
          title="Add Global Registry Component"
          icon-layout
          @click="navigateToGlobalRegistryLibrary"
          size="sm"
        >
          <img width="16" heigth="16" src="@/assets/embed.svg" />
          Import Component
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
      <div
        v-for="element in elements.sort((a, b) =>
          a.label.localeCompare(b.label),
        )"
        :key="element.id"
        class="node"
      >
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
import { getEntryWorkflowBlock } from "@/canvas/functions/getEntryWorkflowBlock";
import { canvasStore } from "@/canvas/stores/canvasStore";
import readWorkflowModal from "@/canvas/components/modals/st4sd_workflows/readWorkflowModal.vue";
import readComponentModal from "@/canvas/components/modals/st4sd_components/readComponentModal.vue";
import createComponentModal from "@/canvas/components/modals/st4sd_components/createComponentModal.vue";
import "@carbon/web-components/es/components/input/index.js";
import "@carbon/web-components/es/components/number-input/index.js";
import "@carbon/web-components/es/components/dropdown/index.js";
import "@carbon/web-components/es/components/search/index.js";
import router from "@/router";
import { registryUISharedState } from "@/stores/registryUISharedState";
import { getDeploymentEndpoint } from "@/functions/public_path";

let isGlobalRegistryLibraryEnabled = ref(
  registryUISharedState.isGlobalRegistryLibraryEnabled,
);

let id = 0;
const getId = () => `dndnode_${id++}`;

const emit = defineEmits(["updateLibraryError", "libraryLoaded"]);

async function getNodesFromUrls() {
  let nodes = [];

  await axios
    .get(
      `${getDeploymentEndpoint()}registry-ui/backend/canvas/graphs-library/internal`,
    )
    .then((response) => {
      for (let entryIndex in response.data.entries) {
        let graph = response.data.entries[entryIndex].graph;
        const entryWorkflowBlock = getEntryWorkflowBlock(graph);

        if (entryWorkflowBlock.parentNode == undefined) {
          entryWorkflowBlock.parentNode = "";
          entryWorkflowBlock.id = getId();
        }
        nodes.push(entryWorkflowBlock);
      }
    })
    .catch((error) => {
      emit("updateLibraryError", error);
    })
    .finally(() => {
      emit("libraryLoaded");
    });
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
  canvasStore.setNode(element);
};

const elements = ref([]);
const fullElements = ref([]);
getNodesFromUrls().then((data) => {
  fullElements.value = [...fullElements.value, ...data];
  elements.value = [...elements.value, ...data];
});

function navigateToGlobalRegistryLibrary() {
  router.push({ path: "/build-canvas/global-registry-library" });
}

const addComponentNode = (newComponent) => {
  newComponent.id = getId();
  fullElements.value.push(newComponent);
  elements.value.push(newComponent);
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
    elements.value = [...searchResult];
  } else {
    elements.value = [...fullElements.value];
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
#nodes-container {
  padding-left: 0.5rem;
  padding-right: 0.5rem;
}
.node {
  margin-bottom: 0.5rem;
}
</style>
