<!-- eslint-disable vue/no-deprecated-slot-attribute -->
<template>
  <div class="workflow">
    <NodeToolbar
      id="nodeToolbar"
      :is-visible="data.toolbarVisible"
      :position="Position.Right"
    >
      <cds-button @click="changeVisibility">
        {{ isHidden ? "Expand" : "Collapse" }}
        <img
          v-if="isHidden"
          slot="icon"
          class="white-svg"
          height="18"
          width="18"
          src="@/assets/maximize.svg"
        />
        <img
          v-else
          slot="icon"
          class="white-svg"
          height="18"
          width="18"
          src="@/assets/minimize.svg"
        />
      </cds-button>
    </NodeToolbar>
    <NodeResizer />
    <Handle type="target" :position="Position.Top" />
    <slot name="node-workflow">{{ props.label }}</slot>
    <Handle type="source" :position="Position.Bottom" />
  </div>
</template>

<script setup>
import "https://1.www.s81c.com/common/carbon/web-components/version/v2.8.0/button.min.js";

import { Handle, Position } from "@vue-flow/core";
import { ref } from "vue";
import { NodeResizer } from "@vue-flow/node-resizer";
import { NodeToolbar } from "@vue-flow/node-toolbar";

const props = defineProps({
  label: {
    type: String,
    required: true,
  },
  data: {
    required: true,
  },
});
const emit = defineEmits(["changeVisibility"]);
const isHidden = ref(false);
const changeVisibility = () => {
  isHidden.value = !isHidden.value;
  emit("changeVisibility", isHidden);
};
</script>

<style scoped>
/* Only the text color is set here, the background color is set main.scss */
.workflow {
  padding: 10px 5px;
  font-size: 12px;
  text-align: center;
  color: #222;
}

.dark .workflow {
  color: #fffffb;
}
#nodeToolbar {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}
</style>
