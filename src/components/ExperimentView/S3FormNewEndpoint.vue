<template>
  <cds-form-group>
    <br />
    <cds-text-input
      :value="configuration.name"
      :disabled="disableForm"
      @input="configuration.name = $event.target.value"
      label="Name"
    />
    <br />
    <cds-text-input
      :value="configuration.endpoint"
      :disabled="disableForm"
      @input="configuration.endpoint = $event.target.value"
      label="Endpoint"
    />
    <br />
    <cds-text-input
      :value="configuration.bucket"
      :disabled="disableForm"
      @input="configuration.bucket = $event.target.value"
      label="Bucket"
    />
    <br />
    <cds-text-input
      :value="configuration.accessKey"
      :disabled="disableForm"
      @input="configuration.accessKey = $event.target.value"
      label="Access Key"
    />
    <br />
    <cds-text-input
      :value="configuration.secretAccessKey"
      :disabled="disableForm"
      @input="configuration.secretAccessKey = $event.target.value"
      label="Secret Access Key"
      type="password"
    />
    <br />
    <cds-text-input
      :value="configuration.region"
      :disabled="disableForm"
      @input="configuration.region = $event.target.value"
      label="Region (optional)"
    />
    <br />
    <div>
      <cds-button
        v-if="isInEditMode"
        size="md"
        title="Cancel edits"
        kind="tertiary"
        @click="(resetForm(), $emit('cancel-edit'))"
        >Cancel edit
      </cds-button>
      <cds-button
        v-else
        size="md"
        title="Reset values"
        kind="tertiary"
        @click="resetForm"
        :disabled="disableForm"
        >Reset
      </cds-button>
      <cds-button
        size="md"
        :title="isInEditMode ? 'Confirm' : 'Add'"
        @click="handleUserConfirmation"
        :disabled="!configuration.isValid() || disableForm"
        >{{ primaryButtonText }}
      </cds-button>
    </div>
  </cds-form-group>
</template>

<script>
import "@carbon/web-components/es/components/form-group/index.js";
import "@carbon/web-components/es/components/text-input/index.js";
import "@carbon/web-components/es/components/button/index.js";

import S3Configuration from "@/classes/S3Configuration.js";

export default {
  name: "S3FormNewEndpoint",
  emits: ["add-new-s3-endpoint", "edit-s3-endpoint", "cancel-edit"],
  props: {
    isInEditMode: Boolean,
    s3EditEndpoint: {
      type: S3Configuration,
      default: new S3Configuration(),
    },
    disableForm: Boolean,
  },
  watch: {
    isInEditMode: {
      immediate: true,
      handler(newEditValue) {
        if (newEditValue) this.configuration = this.s3EditEndpoint.clone();
        else this.resetForm();
      },
    },
  },
  computed: {
    primaryButtonText() {
      return this.isInEditMode ? "Apply changes" : "Add endpoint";
    },
  },
  data() {
    return {
      configuration: this.s3EditEndpoint.clone(),
    };
  },
  methods: {
    handleUserConfirmation() {
      let eventName = this.isInEditMode
        ? "edit-s3-endpoint"
        : "add-new-s3-endpoint";
      this.$emit(eventName, this.configuration);
      this.resetForm();
    },
    resetForm() {
      this.configuration = new S3Configuration();
    },
  },
};
</script>
<style lang="scss" scoped>
@use "@carbon/layout";
cds-button {
  padding-right: layout.$spacing-03;
}
</style>
