<template>
  <a :href="`experiment/${experiment.metadata.package.name}`">
    <div class="card-outer-container">
      <div class="card-inner-container">
        <p>{{ experiment.metadata.package.name }}</p>
        <p v-if="experiment.metadata.package.description">
          {{ experiment.metadata.package.description }}
        </p>
        <div class="tag-group-container">
          <!-- VE interface -->
          <cds-tag
            v-if="
              Object.keys(experiment.metadata.registry.interface).length != 0
            "
            type="green"
          >
            virtual-experiment
          </cds-tag>
          <!-- Platform -->
          <cds-tag
            v-for="(platform, platformIdx) in getAvailablePlatforms(experiment)"
            :key="`platform-${platformIdx}`"
            type="red"
          >
            platform: {{ platform }}
          </cds-tag>
          <!-- Available tags -->
          <cds-tag
            v-for="(tag, tagIdx) in tags"
            :key="`tag-${tagIdx}`"
            type="blue"
          >
            tag: {{ tag }}
          </cds-tag>
          <!-- User metadata -->
          <cds-tag
            v-for="label in experiment.metadata.package.keywords"
            :key="label"
            type="purple"
          >
            {{ label }}
          </cds-tag>
        </div>
      </div>
    </div>
  </a>
</template>

<script>
import "@carbon/web-components/es/components/tag/index.js";
import { getAvailablePlatforms } from "@/functions/package_utilities";
export default {
  name: "St4sdVirtualExperimentCard",
  props: {
    experiment: {
      type: Object,
      required: true,
    },
    tags: {
      type: Object,
      required: true,
    },
  },
  methods: {
    getAvailablePlatforms,
  },
};
</script>

<style scoped lang="scss">
@use "@carbon/layout";
@use "@/styles/cds-tag-styles.scss";
@use "@/styles/st4sd-virtual-experiment-card-styles.scss";
</style>
