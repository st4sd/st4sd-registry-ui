<template>
  <div>
    <script
      type="module"
      src="https://1.www.s81c.com/common/carbon/web-components/version/v1.21.0/progress-indicator.rtl.min.js"
    ></script>
    <div class="breadcrumb">
      <bx-breadcrumb>
        <bx-breadcrumb-item>
          <router-link to="/">Virtual Experiments</router-link>
        </bx-breadcrumb-item>
        <bx-breadcrumb-item>
          <bx-skeleton-text></bx-skeleton-text>
        </bx-breadcrumb-item>
      </bx-breadcrumb>
    </div>
    <div class="cds--row pad1">
      <div class="cds--col-lg-10">
        <p style="padding: 64px"></p>
        <bx-skeleton-text type="heading"></bx-skeleton-text>
        <p style="padding: 10px; margin: 10px"></p>
        <bx-skeleton-text type="line"></bx-skeleton-text>
        <bx-skeleton-text type="line"></bx-skeleton-text>
      </div>
      <div class="cds--col" style="padding: 64px">
        <bx-progress-indicator-skeleton class="ve-progress-indicator" vertical>
          <bx-progress-step-skeleton vertical></bx-progress-step-skeleton>
          <bx-progress-step-skeleton vertical></bx-progress-step-skeleton>
          <bx-progress-step-skeleton vertical></bx-progress-step-skeleton>
          <bx-progress-step-skeleton vertical></bx-progress-step-skeleton>
        </bx-progress-indicator-skeleton>
      </div>
    </div>
  </div>
</template>

<script>
import "carbon-web-components/es/components/progress-indicator/index.js";
export default {
  name: "LoadingOverlay",
};
</script>

<style lang="scss">
@use "@carbon/grid";
@use "@carbon/layout";
@use "@carbon/colors";
.ve-progress-indicator {
  margin-top: 64px;
}
</style>
<template>
  <div>
    <div class="breadcrumb">
      <bx-breadcrumb>
        <bx-breadcrumb-item>
          <router-link to="/">Virtual Experiments</router-link>
        </bx-breadcrumb-item>
        <bx-breadcrumb-item>
          <bx-skeleton-text></bx-skeleton-text>
        </bx-breadcrumb-item>
      </bx-breadcrumb>
    </div>
    <div class="cds--row pad1">
      <div class="cds--col-lg-10">
        <p style="padding: 64px"></p>
        <bx-skeleton-text type="heading"></bx-skeleton-text>
        <p style="padding: 10px; margin: 10px"></p>
        <bx-skeleton-text type="line"></bx-skeleton-text>
        <bx-skeleton-text type="line"></bx-skeleton-text>
      </div>
      <div class="cds--col" style="padding: 64px">
        <bx-progress-indicator-skeleton class="ve-progress-indicator" vertical>
          <bx-progress-step-skeleton vertical></bx-progress-step-skeleton>
          <bx-progress-step-skeleton vertical></bx-progress-step-skeleton>
          <bx-progress-step-skeleton vertical></bx-progress-step-skeleton>
          <bx-progress-step-skeleton vertical></bx-progress-step-skeleton>
        </bx-progress-indicator-skeleton>
      </div>
    </div>
  </div>
</template>

<script>
import "carbon-web-components/es/components/progress-indicator/index.js";
export default {
  name: "LoadingOverlay",
};
</script>

<style lang="scss">
@use "@carbon/grid";
@use "@carbon/layout";
@use "@carbon/colors";
.ve-progress-indicator {
  margin-top: 64px;
}
</style>
