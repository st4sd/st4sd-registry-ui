<template>
  <St4sdBreadcrumb
    :breadcrumbs="[
      { name: 'Virtual Experiments', path: '/' },
      {
        name: 'Build Canvas',
        path: '/build-canvas',
      },
    ]"
  />

  <BuildCanvas />
</template>

<script setup>
import St4sdBreadcrumb from "@/components/St4sdBreadcrumb/St4sdBreadcrumb.vue";
import BuildCanvas from "@/Canvas/BuildCanvas";
</script>

<style></style>
