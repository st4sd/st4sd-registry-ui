<template>
  <St4sdBreadcrumb
    :breadcrumbs="[
      { name: 'Virtual Experiments', path: '/' },
      {
        name: id,
        path: `/experiment/${props.id}`,
      },
      {
        name: 'View Canvas',
        path: `/experiment/${props.id}/viewcanvas`,
      },
    ]"
  />

  <span v-if="isPreview" class="preview">This is a preview</span>

  <div v-if="graphLoading">
    <div id="loadingContainer">
      <bx-loading id="loadingWheel" type="overlay"></bx-loading>
    </div>
  </div>
  <div v-else>
    <div id="no-results-message" v-if="response == null">
      <p>No Canvas Avaiblable</p>
    </div>

    <div v-else>
      <ViewCanvas
        v-if="!editButtonClicked"
        :id="props.id"
        @edit-button-clicked="toggleEditButtonClicked"
      />
      <EditCanvas
        v-else
        :id="props.id"
        :transforms="transforms"
        :transformApplied="isPreview"
        @transform-selected="handleTransformSelected"
      />
      <div id="button-container">
        <button
          id="submit-button"
          v-if="isPreview"
          title="Register Experiment"
          @click="toggleModalVisibility('submitExperimentModal')"
        >
          Register Transformed Experiment
        </button>
      </div>
      <submitExperimentModal
        v-if="modalVisibilities.submitExperimentModal.value"
        @cancel="toggleModalVisibility('submitExperimentModal')"
        @submit="postNewExperiment"
        title="Submit Experiment"
        open="true"
      />
    </div>
  </div>
</template>

<script setup>
import St4sdBreadcrumb from "@/components/St4sdBreadcrumb/St4sdBreadcrumb.vue";
import ViewCanvas from "@/Canvas/ViewCanvas.vue";
import EditCanvas from "@/Canvas/EditCanvas.vue";
import submitExperimentModal from "@/Canvas/Modals/submitExperimentModal.vue";
import { ref, defineProps, onMounted } from "vue";
import { dagStore } from "@/Canvas/stores/dagStore";
import { createDAG } from "@/Canvas/createDAG";
import axios from "axios";
import { useRouter } from "vue-router";

const router = useRouter();

const props = defineProps({
  id: {
    type: String,
    default: "",
  },
});
let editButtonClicked = ref(false);
let transforms = ref(null);

const toggleEditButtonClicked = () => {
  editButtonClicked.value = !editButtonClicked.value;
  getGraphTransforms();
};

const getGraphTransforms = () => {
  axios
    .get(
      window.location.origin +
        `/registry-ui/backend/canvas/${props.id}/relationships`,
    )
    .then((response) => {
      if (response.data.length != 0) {
        transforms.value = response.data;
      } else {
        transforms.value = [];
      }
    });
};

let graphLoading = ref(true);
let response = ref(null);

const getGraph = async () => {
  let graphData;
  let inputsData;
  await axios
    .get(window.location.origin + "/registry-ui/backend/canvas/" + props.id)
    .then((graphResponse) => {
      if (graphResponse.data.length != 0) {
        graphData = graphResponse.data;
      }
    });
  await axios
    .get(
      window.location.origin + "/registry-ui/backend/experiments/" + props.id,
    )
    .then((inputsResponse) => {
      if (inputsResponse.data.length != 0) {
        inputsData = inputsResponse.data.entry;
      }
    });

  const elements = ref(createDAG(graphData, inputsData));
  response.value = elements.value;
  dagStore.setDAG(elements);
  graphLoading.value = false;
};

onMounted(() => {
  getGraph();
});

let experimentTransformId = "";

const handleTransformSelected = (loading, transformId) => {
  graphLoading.value = loading;
  experimentTransformId = transformId.value;
  getPreviewGraph();
};

let isPreview = ref(false);

const getPreviewGraph = async () => {
  let graphData;
  let inputsData;
  await axios
    .get(
      window.location.origin +
        "/registry-ui/backend/canvas/preview/" +
        experimentTransformId +
        "/dsl",
    )
    .then((graphResponse) => {
      if (graphResponse.data.length != 0) {
        graphData = graphResponse.data;
      }
    });
  await axios
    .get(
      window.location.origin +
        "/registry-ui/backend/canvas/preview/" +
        experimentTransformId +
        "/inputs",
    )
    .then((inputsResponse) => {
      if (inputsResponse.data.length != 0) {
        inputsData = inputsResponse.data.entry;
      }
    });

  const elements = ref(createDAG(graphData, inputsData));
  response.value = elements.value;
  dagStore.setDAG(elements);
  graphLoading.value = false;
  isPreview.value = true;
};

const postNewExperiment = (experimentName) => {
  axios
    .post(
      window.location.origin +
        `/registry-ui/backend/canvas/relationships/${experimentTransformId}/synthesize/${experimentName}`,
    )
    .then(
      setTimeout(() => {
        router.push({ path: `/experiment/${experimentName}` });
      }, "5000"),
    );
};

let modalVisibilities = {
  submitExperimentModal: ref(false),
};

const toggleModalVisibility = (modal) => {
  modalVisibilities[modal].value = !modalVisibilities[modal].value;
};
</script>

<style>
#loadingContainer {
  width: 100%;
  height: calc(100vh - 12rem);
  display: flex;
  justify-content: center;
  align-items: center;
}

#loadingWheel {
  display: inline-block;
  animation: none;
}

#no-results-message {
  display: flex;
  justify-content: center;
  padding-top: 2rem;
  text-decoration: underline 1px;
  text-underline-offset: 5px;
  text-align: center;
}

.preview {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.875rem;

  color: red;
  outline: 2px solid red;
}

#submit-button {
  border-radius: 0 !important;
  color: white;
  background-color: #0e61fe;
  border: none;
  margin: 4px !important;
  padding: 12px !important;
  box-shadow: none !important;
  font-weight: 600;
}

#button-container {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}
</style>
