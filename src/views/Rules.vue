
<template>
  <div class="container">

    <b-row id="tableHeaderRow">
      <b-col sm="6">
        <h2>Search NIEM Rules</h2>
      </b-col>
      <b-col sm="6">
        <div class="form-group form-inline" id="selectedNIEMGroup">
          <label for="selectNIEM" id="selectedNIEMLabel">NIEM release:</label>
          <b-form-select
            id="selectedNIEM" size="sm"
            v-model="selectedNIEM"
            :options="availableNIEM"
          />
        </div>
      </b-col>
    </b-row>

    <vue-good-table
      :columns="columns"
      :rows="compatibleRules"
      :search-options="{
        enabled: true,
        skipDiacritics: true,
        placeholder: 'Search'
      }"
      :sort-options="{
        enabled: true
      }"
      :pagination-options="{
        enabled: true,
        mode: 'pages',
        perPage: 50,
        position: 'top'
      }"
      >
    </vue-good-table>

  </div>
</template>

<script>

import * as data from "../scripts/data.js";

function formatApplicability(arr) {
  return arr.join(", ");
}

function sortRuleNumber(num1, num2) {
  let x = parseFloat(num1.replace("-", "."));
  let y = parseFloat(num2.replace("-", "."));
  return (x < y) ? -1 : 1;
}

export default {
  name: "Rules",

  data() {
    return {
      allRules: data.getRules(),
      availableNIEM: data.getRulesAvailableNIEM(),
      selectedNIEM: "4.1",
      columns: [
        { label: "Spec", field: "specification.version" },
        { label: "Number", field: "number", sortFn: sortRuleNumber },
        { label: "Applicability", field: "applicability", formatFn: formatApplicability },
        { label: "Title", field: "title" }
      ]
    }
  },
  computed: {
    compatibleRules () {
      return this.allRules.filter( rule => {
        return rule.specification.niem.includes(this.selectedNIEM)
      });
    },
    compatibleSpecs() {
      let specs = this.compatibleRules.map( rule => rule.specification.id );
      return [...new Set(specs)];
    },
    compatibleSpecVersions() {
      let specs = this.compatibleRules.map( rule => rule.specification.version );
      return [...new Set(specs)];
    },
    compatibleApplicability() {
      let apps = [];
      this.compatibleRules.forEach( rule => apps.push(...rule.applicability));
      return [...new Set(apps)];
    }
  }

}
</script>

<style scoped>

#selectedNIEMLabel {
  float: right;
  padding-right: 15px;
}

#selectedNIEM {
  margin: 0;
}

#selectedNIEMGroup {
  margin: 0;
  float: right;
}

#tableHeaderRow {
  margin-bottom: 15px;
  margin-left: 0;
  margin-right: 0;
  align-items: center;
}

#tableHeaderRow div {
  padding: 0;
}

h2, select {
  margin: 0;
}
</style>

