
import { NIEMRuleType, NIEMDefinitionType } from "../assets/typedefs/index"; // eslint-disable-line no-unused-vars

import rulesImport from "../assets/data/niem-rules.json";
import defsImport from "../assets/data/niem-defs.json";

/** @type {NIEMRuleType[]} */
let rules = rulesImport;

/** @type {NIEMDefinitionType[]} */
let defs = defsImport;

/**
 * Returns the NIEM rules JSON data.
 *
 * @returns {NIEMRuleType[]}
 */
function getRules() {
  rules.forEach( rule => {
    if (rule.specification.version === "CodeLists-4.0") {
      rule.specification.version = "CL-4.0";
    }
  })
  return rules;
}

/**
 * Returns the NIEM definitions JSON data.
 *
 * @returns {NIEMDefinitionType[]}
 */
function getDefs() {
  return defs;
}

/**
 * Returns a string array of supported NIEM releases for rules.
 * @returns {string[]}
 */
function getRulesAvailableNIEM() {
  let niem = [];
  rules.forEach( rule => niem.push(...rule.specification.niem));
  return [...new Set(niem)];
}

/**
 * Returns a string array of supported NIEM releases for definitions.
 * @returns {string[]}
 */
function getDefsAvailableNIEM() {
  let niem = [];
  defs.forEach( def => niem.push(...def.specification.niem));
  return [...new Set(niem)];
}

export {
  getRules,
  getDefs,
  getRulesAvailableNIEM,
  getDefsAvailableNIEM
};
