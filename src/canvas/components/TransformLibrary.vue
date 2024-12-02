<template>
  <aside>
    <div id="controls">
      <div class="title">Transform Library</div>
    </div>
    <div id="nodes-container">
      <div v-if="transforms == null">
        <div id="loadingContainer">
          <cds-loading></cds-loading>
        </div>
      </div>
      <div v-else>
        <div v-if="transforms.length == 0">
          <p id="no-relationships-message">No transforms avaiblable</p>
        </div>
        <div id="submit">
          <div v-for="element in elements" :key="element.id" class="node">
            <div class="vue-flow__node-default" @click="onClick(element)">
              {{ element.label }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </aside>
</template>

<script setup>
import { ref, watch } from "vue";
import "@carbon/web-components/es/components/loading/index.js";

const props = defineProps({
  id: {
    type: String,
    default: "",
  },
  transforms: {
    type: Array,
    default: () => [],
  },
});

watch(
  () => props.transforms,
  () => {
    if (props.transforms.length != 0 && props.transforms[0] != null) {
      elements.value = props.transforms;
    } else {
      elements.value = [];
    }
  },
);

const elements = ref([]);

const emit = defineEmits(["transformSelected"]);

let graphLoading = ref(false);
let transformId = ref("");

const onClick = (element) => {
  graphLoading.value = true;
  transformId.value = element.id;
  emit("transformSelected", graphLoading.value, transformId);
};
</script>

<style lang="scss" scoped>
@use "@/canvas/styles/aside-styles.scss";

#loadingContainer {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

#controls {
  height: auto !important;
}

#submit {
  display: flex !important;
  flex-direction: column !important;
  justify-content: space-between !important;
}

#no-relationships-message {
  justify-content: center;
  align-items: center;
  color: white;
}
</style>
