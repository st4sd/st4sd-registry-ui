<template>
  <cds-popover autoalign dropShadow id="files-table-popover" tabTip>
    <cds-button
      @click="openPopover()"
      kind="ghost"
      style="display: inline-table"
      ><img
        class="black-svg"
        slot="icon"
        width="16"
        height="16"
        src="@/assets/filter.svg"
    /></cds-button>
    <cds-popover-content @mouseleave="openPopover()">
      <div class="popover-content-div">
        <cds-checkbox-group legend-text="Status">
          <cds-checkbox
            @cds-checkbox-changed="
              checkboxChanged(
                $event.detail.checked,
                allowedFileStatuses,
                statusTypeEnums.MISSING,
              )
            "
            checked
            >Missing</cds-checkbox
          >
          <cds-checkbox
            @cds-checkbox-changed="
              checkboxChanged(
                $event.detail.checked,
                allowedFileStatuses,
                statusTypeEnums.UNSET,
              )
            "
            checked
            >Unset</cds-checkbox
          >
          <cds-checkbox
            @cds-checkbox-changed="
              checkboxChanged(
                $event.detail.checked,
                allowedFileStatuses,
                statusTypeEnums.SET,
              )
            "
            checked
            >Set</cds-checkbox
          >
        </cds-checkbox-group>
        <br />
        <cds-checkbox-group legend-text="Type">
          <cds-checkbox
            @cds-checkbox-changed="
              checkboxChanged(
                $event.detail.checked,
                allowedFileTypes,
                inputTypeEnums.INPUT,
              )
            "
            checked
            >Input</cds-checkbox
          >
          <cds-checkbox
            @cds-checkbox-changed="
              checkboxChanged(
                $event.detail.checked,
                allowedFileTypes,
                inputTypeEnums.EXECUTION_OPTION,
              )
            "
            checked
            >Optional</cds-checkbox
          >
          <cds-checkbox
            @cds-checkbox-changed="
              checkboxChanged(
                $event.detail.checked,
                allowedFileTypes,
                inputTypeEnums.PRESET,
              )
            "
            checked
            >Preset</cds-checkbox
          >
        </cds-checkbox-group>
      </div>
    </cds-popover-content>
  </cds-popover>
</template>

<script>
import "@carbon/web-components/es/components/popover/index.js";
import "@carbon/web-components/es/components/checkbox/index.js";
import "@carbon/web-components/es/components/button/index.js";

import inputTypeEnums from "@/enums/inputTypeEnums.js";
import statusTypeEnums from "@/enums/statusTypeEnums";

export default {
  name: "FilesTableFilter",
  data() {
    return {
      statusTypeEnums,
      inputTypeEnums,
      allowedFileTypes: new Set([
        inputTypeEnums.INPUT,
        inputTypeEnums.EXECUTION_OPTION,
        inputTypeEnums.PRESET,
      ]),
      allowedFileStatuses: new Set([
        statusTypeEnums.MISSING,
        statusTypeEnums.SET,
        statusTypeEnums.UNSET,
      ]),
    };
  },
  emits: ["filter-status-selection-updated", "filter-type-selection-updated"],
  watch: {
    allowedFileTypes: {
      deep: true,
      handler(allowedFileTypes) {
        this.$emit("filter-type-selection-updated", allowedFileTypes);
      },
    },
    allowedFileStatuses: {
      deep: true,
      handler(allowedFileStatuses) {
        this.$emit("filter-status-selection-updated", allowedFileStatuses);
      },
    },
  },
  methods: {
    openPopover() {
      let popover = document.getElementById("files-table-popover");
      let open = popover?.hasAttribute("open");
      open
        ? popover?.removeAttribute("open")
        : popover?.setAttribute("open", "");
    },
    checkboxChanged(checked, set, type) {
      checked ? set.add(type) : set.delete(type);
    },
  },
};
</script>

<style lang="scss" scoped>
@use "@carbon/layout";
@import "@/styles/svg.scss";

.popover-content-div {
  padding: layout.$spacing-05;
}
</style>
