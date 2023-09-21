<template>
  <div class="workflow">
    <NodeToolbar
      id="nodeToolbar"
      :is-visible="data.toolbarVisible"
      :position="Position.Right"
    >
      <bx-btn @click="changeVisibility">
        {{ isHidden ? "Expand" : "Collapse" }}
      </bx-btn>
    </NodeToolbar>
    <NodeResizer min-width="100" min-height="30" />
    <Handle type="target" :position="Position.Top" />
    <slot name="node-workflow">{{ props.label }}</slot>
    <!-- <Handle type="source" :position="Position.Bottom" /> -->
  </div>
</template>

<script setup>
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
.workflow {
  padding: 10px 5px;
  font-size: 12px;
  text-align: center;
  color: #222;
}
#nodeToolbar {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}
</style>
