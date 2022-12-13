<template>
  <div class="cds--col-lg-12">
    <div
      class="cds--row card-row"
      v-for="experiment in experimentsToShow"
      :key="experiment.metadata.package.name"
    >
      <dds-card
        border
        logo
        class="card-proportions"
        :href="`experiment/${experiment.metadata.package.name}`"
      >
        <dds-card-eyebrow>{{
          experiment.metadata.package.name
        }}</dds-card-eyebrow>
        <p>
          {{ experiment.metadata.package.description }}
        </p>
        <dds-tag-group>
          <!-- VE interface -->
          <bx-tag
            v-if="
              Object.keys(experiment.metadata.registry.interface).length != 0
            "
            type="green"
          >
            virtual-experiment
          </bx-tag>
          <!-- Platform -->
          <bx-tag
            v-for="(platform, platformIdx) in getAvailablePlatforms(experiment)"
            :key="`platform-${platformIdx}`"
            type="red"
          >
            platform: {{ platform }}
          </bx-tag>
          <!-- Available tags -->
          <bx-tag
            v-for="(tag, tagIdx) in findTagsForPackageName(
              experiment.metadata.package.name
            )"
            :key="`tag-${tagIdx}`"
            type="blue"
          >
            tag: {{ tag }}
          </bx-tag>
          <!-- User metadata -->
          <bx-tag
            v-for="label in experiment.metadata.package.keywords"
            :key="label"
            type="purple"
          >
            {{ label }}
          </bx-tag>
        </dds-tag-group>
        <dds-card-footer> </dds-card-footer>
      </dds-card>
    </div>
  </div>
</template>

<script>
import { getAvailablePlatforms } from "@/functions/package_utilities";

export default {
  props: {
    selectedFilters: Object,
    experiments: Array,
  },
  computed: {
    experimentsTaggedLatest() {
      return Array.from(
        this.experiments.filter((experiment) => {
          return experiment.metadata.registry.tags.includes("latest");
        })
      );
    },
    experimentsToShow() {
      let toShow = this.experimentsTaggedLatest;
      for (const filterName in this.selectedFilters) {
        const selectedFilter = this.selectedFilters[filterName];
        // Platform has to be treated differently
        if (filterName == "platform") {
          toShow = toShow.filter(function (element) {
            let platforms = getAvailablePlatforms(element);
            return selectedFilter.every((p) => platforms.includes(p));
          });
          continue;
        }
        //
        toShow = toShow.filter(function (element) {
          return selectedFilter.every((d) =>
            element.metadata.package.keywords.includes(d)
          );
        });
      }
      return toShow;
    },
  },
  methods: {
    getAvailablePlatforms,
    findTagsForPackageName(name) {
      let tags = new Set();
      for (let i = 0; i < this.experiments.length; i++) {
        if (this.experiments[i].metadata.package.name != name) continue;
        this.experiments[i].metadata.package.tags.forEach((tag) => {
          tags.add(tag);
        });
      }
      return Array.from(tags);
    },
  },
};
</script>

<style lang="scss">
@use "@carbon/grid";
@use "@carbon/layout";
.card-row {
  margin-bottom: layout.$spacing-06;
  // max-height: 200px;
}

.card-proportions {
  max-height: 300px;
}
</style>
