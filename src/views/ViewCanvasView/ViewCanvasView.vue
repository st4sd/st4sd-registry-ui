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

  <div v-if="graphLoading">
    <div id="loadingContainer">
      <bx-loading id="loadingWheel" type="overlay"></bx-loading>
    </div>
  </div>
  <div v-else>
    <div id="no-results-message" v-if="response == null">
      <p>No Canvas Avaiblable</p>
    </div>

    <ViewCanvas v-else />
  </div>
</template>

<script setup>
import St4sdBreadcrumb from "@/components/St4sdBreadcrumb/St4sdBreadcrumb.vue";
import ViewCanvas from "@/Canvas/ViewCanvas.vue";
import { ref, defineProps, onMounted, watch } from "vue";
import { dagStore } from "@/Canvas/stores/dagStore";
import { createDAG } from "@/Canvas/createDAG";

const props = defineProps({
  id: {
    type: String,
    default: "",
  },
});

let graphLoading = ref(true);
let response = ref(null);

const getGraph = () => {
  const elements = ref(
    createDAG(
      window.location.origin + "/registry-ui/backend/canvas/" + props.id
    ).then((data) => {
      elements.value = data;
      response.value = data;
      dagStore.setDAG(elements);
      graphLoading.value = false;
    })
  );
};

watch(response, () => {});

onMounted(() => {
  getGraph();
});
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
</style>
