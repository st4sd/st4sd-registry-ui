<template>
  <!-- <div class="filter-container"> -->
  <div>
    <St4sdFilterComponent
      :experiments="experiments"
      @updateSelectedFilters="onUpdateSelectedFilters"
    />
    <!--Below code commented out for easy return tp dds-filter-panel component when carbon team fixes event not firing bug-->

    <!-- <dds-filter-panel-composite
      @dds-selection-clear="passSelectedFilters"
      @dds-checkbox-select="passSelectedFilters"
    >
      <dds-filter-panel-heading slot="heading" @click="findSelectedCheckbox"
        >Filter</dds-filter-panel-heading
      >
      <dds-filter-group
        v-for="(domainFilter, domainFilterIdx) in domainFilters"
        :key="`domainFilter-${domainFilterIdx}`"
      >
        <dds-filter-group-item
          :filter-for="domainFilter.filterFor"
          :open="domainFilter.isOpen"
          :title-text="domainFilter.displayName"
        >
          <div
            v-for="(filter, filterIdx) in domainFilter.filters"
            :key="`filterPanel-${filterIdx}`"
          >
            <dds-filter-panel-checkbox
              class="filterCheckbox"
              :value="filter.name"
              >{{ filter.displayName }}</dds-filter-panel-checkbox
            >
          </div>
        </dds-filter-group-item>
      </dds-filter-group>
    </dds-filter-panel-composite> -->
  </div>
</template>

<script>
// const domainFilters = [
//   {
//     filterFor: "domain",
//     displayName: "Domain",
//     isOpen: true,
//     filters: [
//       {
//         name: "computational chemistry",
//         displayName: "Computational Chemistry",
//       },
//       {
//         name: "climate",
//         displayName: "Climate",
//       },
//     ],
//   },
//   {
//     filterFor: "platform",
//     displayName: "Platform",
//     isOpen: true,
//     filters: [
//       {
//         name: "openshift",
//         displayName: "OpenShift",
//       },
//       {
//         name: "openshift-kubeflux",
//         displayName: "Kubeflux",
//       },
//     ],
//   },
//   {
//     filterFor: "other",
//     displayName: "Other",
//     isOpen: true,
//     filters: [
//       {
//         name: "surrogate",
//         displayName: "Surrogate",
//       },
//     ],
//   },
// ];

import St4sdFilterComponent from "@/components/St4sdFilterComponent/St4sdFilterComponent.vue";
export default {
  components: {
    St4sdFilterComponent,
  },
  props: {
    experiments: Array,
  },
  methods: {
    onUpdateSelectedFilters(selectedFilters) {
      this.$emit("updateSelectedFilters", selectedFilters);
    },
    findSelectedCheckbox() {
      setTimeout(this.findShadowDomChildren(), 5000);
    },
    findShadowDomChildren() {
      let elements = document.querySelectorAll(".filterCheckbox");
      let shadowDomChildNodes = Array.from(elements[0].shadowRoot.childNodes);
      console.log(shadowDomChildNodes);
    },
  },
};
</script>

<style lang="scss">
.filter-container {
  padding-right: 1rem;
  @media screen and (max-width: 1056px) {
    padding-top: 2rem;
  }
}
dds-filter-panel-composite {
  @media screen and (max-width: 1056px) {
    margin-left: -16px;
  }
}
</style>
