<template>
  <div>
    <Handle type="target" :position="Position.Top" />
    <slot name="node-component">{{ props.label }}</slot>
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
