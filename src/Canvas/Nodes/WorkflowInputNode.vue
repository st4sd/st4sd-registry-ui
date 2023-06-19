<template>
  <div class="workflow-input-node">
    <slot name="node-param">{{ props.label }}</slot>
    <Handle type="source" :position="Position.Bottom" />
  </div>
</template>

<script setup>
import { Handle, Position } from "@vue-flow/core";

const props = defineProps({
  label: {
    type: String,
    required: true,
  },
});
</script>

<script>
export default {
  inheritAttrs: false,
};
</script>

<style scoped>
.workflow-input-node {
  padding: 8px 5px;
  font-size: 11px;
  text-align: center;
  color: #222;
  background-color: rgb(225, 225, 228);
  border-color: #222;
  height: 25px;
}
</style>
