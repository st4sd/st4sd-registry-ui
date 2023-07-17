<template>
  <div class="cds--row pad1">
    <div class="cds--col-sm-4 cds--col-md-2 cds--col-lg-4">
      <dds-content-block class="ve-content-block">
        <dds-content-block-heading class="ve-heading"
          >Base</dds-content-block-heading
        >
      </dds-content-block>
    </div>
    <div class="cds--col-sm-4 cds--col-md-6 cds--col-lg-12">
      <dds-structured-list>
        <dds-structured-list-body>
          <dds-structured-list-group
            v-for="(basePackage, idx) in filterBasePackages(
              experiment.base.packages,
              'git',
            )"
            :key="idx"
            :title="basePackage.name"
          >
            <dds-structured-list-row>
              <dds-structured-list-cell class="cds--col-sm-1"
                >Source</dds-structured-list-cell
              ><dds-structured-list-cell class="cds--col-sm-3">
                <bx-link :href="getUrl(basePackage.source.git)"
                  >{{ getUrl(basePackage.source.git) }}
                </bx-link>
              </dds-structured-list-cell>
            </dds-structured-list-row>
            <dds-structured-list-row
              v-if="basePackage.source.git.location.commit != null"
            >
              <dds-structured-list-cell class="cds--col-sm-1"
                >Version</dds-structured-list-cell
              ><dds-structured-list-cell class="cds--col-sm-3">
                <code>{{ basePackage.source.git.location.commit }}</code>
              </dds-structured-list-cell>
            </dds-structured-list-row>
            <dds-structured-list-row
              v-else-if="basePackage.source.git.location.branch != null"
            >
              <dds-structured-list-cell class="cds--col-sm-1"
                >Branch</dds-structured-list-cell
              ><dds-structured-list-cell class="cds--col-sm-3">
                <code>{{ basePackage.source.git.location.branch }}</code>
              </dds-structured-list-cell>
            </dds-structured-list-row>
            <dds-structured-list-row v-else>
              <dds-structured-list-cell class="cds--col-sm-1"
                >Tag</dds-structured-list-cell
              ><dds-structured-list-cell class="cds--col-sm-3">
                <code>{{ basePackage.source.git.location.tag }}</code>
              </dds-structured-list-cell>
            </dds-structured-list-row>
            <dds-structured-list-row>
              <dds-structured-list-cell class="cds--col-sm-1"
                >Report a problem</dds-structured-list-cell
              ><dds-structured-list-cell class="cds--col-sm-3">
                <bx-link
                  :href="
                    createIssueForGitPackage(experiment, basePackage.source.git)
                  "
                  >Open new issue &nbsp;
                  <!-- eslint-disable -->
                  <!-- linting disabled for web component slot attribute - can't use "eslint-disable-next-line vue/no-deprecated-slot-attribute" as it's multiline-->
                  <img
                    slot="icon"
                    width="20"
                    height="20"
                    class="arrow-link"
                    src="../../assets/arrow--right.svg"
                  />
                  <!-- eslint-enable -->
                </bx-link>
              </dds-structured-list-cell>
            </dds-structured-list-row>
          </dds-structured-list-group>
        </dds-structured-list-body>
      </dds-structured-list>
    </div>
  </div>
</template>

<script>
export default {
  name: "PackageInfoBase",
  props: {
    experiment: Object,
  },
  methods: {
    filterBasePackages(basePackages, sourceFilter) {
      var filtered = [];
      for (var i = 0; i < basePackages.length; i++) {
        if (sourceFilter in basePackages[i].source)
          filtered.push(basePackages[i]);
      }
      return filtered;
    },
    getUrl(gitEntry) {
      var url = gitEntry.location.url;
      if (gitEntry.location.url.endsWith(".git")) {
        url = gitEntry.location.url.slice(0, -4);
      }

      if (gitEntry.location.commit != null) {
        url += "/tree/" + gitEntry.location.commit;
      } else if (gitEntry.location.branch != null) {
        url += "/tree/" + gitEntry.location.branch;
      } else if (gitEntry.location.tag != null) {
        url += "/tree/" + gitEntry.location.tag;
      }

      return url;
    },
    createIssueForGitPackage(parameterisedPackage, gitPackage) {
      var title = "Issue report".replaceAll(" ", "+");
      var labels = "bug,parameterised-package-issue";
      var repoReference = "";
      if (gitPackage.location.commit != null) {
        repoReference = "%0A%0AReference commit: " + gitPackage.location.commit;
      } else if (gitPackage.location.branch != null) {
        repoReference = "%0A%0AReference branch: " + gitPackage.location.branch;
      } else {
        repoReference = "%0A%0AReference tag: " + gitPackage.location.tag;
      }

      var body = `Describe the problem
      ${repoReference}
      %0AParameterised package reference: ${
        parameterisedPackage.metadata.registry.digest
      }
      %0ALink: ${
        window.location.origin +
        this.$route.path +
        "@" +
        parameterisedPackage.metadata.registry.digest
      }
      `.replaceAll(" ", "+");

      var url = gitPackage.location.url;
      if (gitPackage.location.url.endsWith(".git")) {
        url = gitPackage.location.url.slice(0, -4);
      }
      url += "/issues/new?";
      url += "title=" + title + "&";
      url += "labels=" + labels + "&";
      url += "body=" + body;
      return url;
    },
  },
};
</script>
<style
  lang="css"
  scoped
  src="../../styles/structured-list-grid-column-styles.css"
></style>
