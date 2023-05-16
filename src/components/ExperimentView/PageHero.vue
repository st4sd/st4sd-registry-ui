<template>
  <!-- Experiment header -->
  <div>
    <div class="cds--row pad1 topPad">
      <!-- Left column  -->
      <div class="cds--col-sm-4 cds--col-md-8 cds--col-lg-12 pad1">
        <!-- Experiment name and description -->
        <dds-content-block>
          <dds-content-block-heading>{{
            experiment.metadata.package.name
          }}</dds-content-block-heading>
          <dds-content-block-copy>{{
            experiment.metadata.package.description
          }}</dds-content-block-copy>

          <!-- Experiment tags -->
          <dds-tag-group>
            <!-- Virtual experiment -->
            <bx-tag v-if="checkVeInterfaceIsPresent(experiment)" type="green">
              virtual-experiment
            </bx-tag>
            <!-- Platforms -->
            <bx-tag
              v-for="option in getAvailablePlatforms"
              :key="`platformoption-${option}`"
              type="red"
            >
              platform: {{ option }}
            </bx-tag>
            <!-- Tags -->
            <bx-tag
              v-for="(tag, idx) in experiment.metadata.registry.tags"
              :key="`registrytag-${idx}`"
              type="blue"
            >
              tag: {{ tag }}
            </bx-tag>
            <!-- Digest -->
            <bx-tag type="blue">
              digest: {{ experiment.metadata.registry.digest }}
            </bx-tag>
          </dds-tag-group>

          <!-- eslint-disable-next-line vue/no-deprecated-slot-attribute -->
          <dds-text-cta slot="footer" cta-type="local" v-if="!isGlobalRegistry">
            <bx-link :href="`${getDeploymentEndpoint()}experiment/${id}/runs`"
              >View Runs</bx-link
            >
          </dds-text-cta>
        </dds-content-block>
      </div>

      <!-- Right column -->
      <div class="cds--col-sm-4 cds--col-md-8 cds--col-lg-4 pad1">
        <!-- Progress indicator -->
        <St4sdBestPracticesProgressIndicator
          :loading="loading"
          :experiment="experiment"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { checkVeInterfaceIsPresent } from "@/functions/ve_interface";
import { getDeploymentEndpoint } from "@/functions/public_path";
import St4sdBestPracticesProgressIndicator from "@/components/St4sdBestPracticesProgressIndicator";

export default {
  name: "PageHero",
  components: { St4sdBestPracticesProgressIndicator },
  props: {
    experiment: Object,
    id: String,
    isGlobalRegistry: Boolean,
    loading: Number,
    getAvailablePlatforms: Array,
  },
  methods: {
    checkVeInterfaceIsPresent,
    getDeploymentEndpoint,
  },
};
</script>

<style lang="scss">
dds-content-block {
  padding-bottom: 0;
  padding-top: 0;
}
dds-structured-list-cell {
  overflow-wrap: anywhere;
}

.topPad {
  padding-top: 2rem;
}
</style>
