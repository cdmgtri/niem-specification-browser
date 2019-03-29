
<template>
  <div>

    <b-row id="tableHeaderRow">

      <b-col sm="3">
        <h2>Search NIEM Rules</h2>
      </b-col>

      <b-col sm="9">
        <div class="form-group form-inline" id="selectedNIEMGroup">
          <label for="selectNIEM" class="selectLabel">NIEM release: </label>
          <b-form-select id="selectNIEM" size="sm"
            v-model="selectedRelease"
            :options="ruleMetadata.availableReleases"
          />

          <label for="selectSpec" class="selectLabel">Specification: </label>
          <b-form-select id="selectSpec" size="sm"
            v-model="selectedSpec"
            :options="compatibleSpecs"
          />

          <label for="selectTarget" class="selectLabel">Target: </label>
          <b-form-select id="selectTarget" size="sm"
            v-model="selectedTarget"
            :options="compatibleTargets"
          />

          <label for="selectExclusive" class="selectLabel"
            title="Check box for an exclusive match on the conformance target, e.g., 'EXT' rules only. Uncheck if results can also match additional conformance targets, e.g., 'REF, EXT'."
            >Exclusive?
          </label>
          <input id="selectExclusive" type="checkbox" v-model="selectedExclusive"/>

          <label for="selectStyle" class="selectLabel">Style: </label>
          <b-form-select id="selectStyle" size="sm"
            v-model="selectedStyle"
            :options="compatibleStyles"
          />

        </div>
      </b-col>
    </b-row>

    <b-row>
      <small>Results: {{ resultRules.length }}</small>
    </b-row>

    <b-table striped hover bordered
      :items="resultRules"
      :fields="fields"
    >

      <!-- Buttons to display more info below and to open IEPD -->
      <template slot="details" slot-scope="row">
        <div class="btn-group">

          <!-- Button to display more info -->
          <button class="btn btn-outline-secondary btn-sm" @click.stop="row.toggleDetails">
            <i v-if="!row.detailsShowing" class="fa fa-chevron-circle-down"/>
            <i v-else class="fa fa-chevron-circle-up"/>
          </button>

        </div>
      </template>

      <!-- Additional IEPD metadata for row -->
      <template slot="row-details" slot-scope="row">

        <p>
          <strong>
            <a :href="row.item.link" target="_blank">Rule {{ row.item.number }}</a>
          </strong>
          ({{ row.item.applicability.join(", ") }})
          ({{ row.item.classification }})
        </p>

        <p><strong>{{ row.item.text }}</strong></p>

        <p>
          Specification:
          <a :href="row.item.specification.link" target="_blank">
            {{ row.item.specification.name }},
            version {{ row.item.specification.versionLabel}}
          </a>
          <br/>
          Section:
          <a :href="row.item.section.link" target="_blank">
            {{ row.item.section.name }}
          </a>
        </p>

        <p v-if="row.item.schematron">
          Schematron:
          <pre lang="xml"><code>{{ formatXML(row.item.schematron) }}</code></pre>
        </p>

      </template>

    </b-table>

  </div>
</template>

<script>

import vkbeautify from "vkbeautify";
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
      allRules: data.rules,
      ruleMetadata: data.ruleMetadata,
      selectedRelease: "4.1",
      selectedSpec: "NDR",
      selectedTarget: "(all)",
      selectedExclusive: false,
      selectedStyle: "",
      fields: [
        { label: "Spec", key: "specification.version", sortable: true },
        { label: "Rule", key: "number", sortFn: sortRuleNumber, sortable: true },
        { label: "Target", key: "applicability", formatter: formatApplicability, sortable: true },
        { label: "Style", key: "style", sortable: true },
        { label: "Title", key: "title", sortable: true },
        { label: "Details", key: "details" }
      ]
    }
  },
  computed: {
    /**
     * NIEM rules compatible with the user-selected release.
     */
    releaseRules() {
      return this.allRules.filter( rule => rule.specification.niem.includes(this.selectedRelease));
    },

    /**
     * NIEM specification IDs (e.g., "NDR") compatible with the user-selected release.
     */
    compatibleSpecs() {
      let specs = this.releaseRules.map( rule => rule.specification.id );
      return [...new Set(specs)];
    },

    /**
     * NIEM specification versions (e.g., "NDR-4.0") compatible with the user-selected release.
     */
    compatibleSpecVersions() {
      let specs = this.compatibleRules.map( rule => rule.specification.version );
      return [...new Set(specs)];
    },

    /**
     * NIEM rules compatible with the user-selected release and specification.
     */
    specRules() {
      return this.releaseRules.filter( rule => rule.specification.id === this.selectedSpec );
    },

    /**
     * NIEM conformance targets compatible with the user-selected release and specification.
     */
    compatibleTargets() {
      let targets = ["(all)"];
      this.specRules.forEach( rule => targets.push(...rule.applicability));
      return [...new Set(targets)].sort();
    },

    /**
     * NIEM rules compatible with the user-selected release, spec, and conformance target.
     *
     * Note: If exclusive is selected, then the results will contain only those rules with that one and only conformance target (e.g., EXT only).  Otherwise, the results will contain rules that include the selected conformance target, along with additional possible conformance targets (e.g., REF, EXT).
     */
    targetRules() {
      if (this.selectedTarget === "(all)") {
        return this.specRules;
      }

      if (this.selectedExclusive == true) {
        return this.specRules.filter( rule => rule.applicability == this.selectedTarget );
      }

      return this.specRules.filter( rule => rule.applicability.includes(this.selectedTarget));
    },

    compatibleStyles() {
      let styles = [];
      this.targetRules.forEach( rule => styles.push(rule.style) );
      return [...new Set(styles)].sort();
    },

    /**
     * NIEM rules compatible with the user-selected release, spec, conformance target, and search terms.
    */
    resultRules () {
      if (this.selectedStyle === "(all)" || this.selectedStyle ==="" ) {
        return this.targetRules;
      }
      return this.targetRules.filter( rule => rule.style === this.selectedStyle);
    }
  },
  methods: {
    formatXML: (schematron) => {
      return vkbeautify.xml(schematron, 2);
    }
  },
  created() {

  }

}
</script>

<style scoped>

.selectLabel {
  float: right;
  padding-left: 15px;
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

small {
  padding-left: 20px;
}

input[type="checkbox"] {
  vertical-align:middle;
}

pre {
  border: 1px solid gainsboro;
  padding: 10px;

  white-space: pre-wrap;       /* Since CSS 2.1 */
  white-space: -moz-pre-wrap;  /* Mozilla, since 1999 */
  white-space: -pre-wrap;      /* Opera 4-6 */
  white-space: -o-pre-wrap;    /* Opera 7 */
  word-wrap: break-word;       /* Internet Explorer 5.5+ */
}

</style>

