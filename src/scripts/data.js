
import { NIEMRuleType, NIEMDefinitionType } from "../assets/typedefs/index"; // eslint-disable-line no-unused-vars

import rulesImport from "../assets/data/niem-rules.json";
import defsImport from "../assets/data/niem-defs.json";

/** @type {NIEMRuleType[]} */
let rules = rulesImport;

/** @type {NIEMDefinitionType[]} */
let defs = defsImport;

/**
 * Returns a string array of supported NIEM releases for rules.
 * @returns {string[]}
 */
function getRulesAvailableReleases() {
  let niem = [];
  rules.forEach( rule => niem.push(...rule.specification.niem));
  return [...new Set(niem)];
}

function getRulesAvailableSpecs() {
  let specs = [];
  rules.forEach( rule => specs.push(rule.specification.version));
  return [...new Set(specs)];
}

function getRuleAvailableTargets() {
  let targets = [];
  rules.forEach( rule => targets.push(...rule.applicability));
  return [...new Set(targets)];
}

/**
 * Returns a string array of supported NIEM releases for definitions.
 * @returns {string[]}
 */
function getDefsAvailableReleases() {
  let niem = [];
  defs.forEach( def => niem.push(...def.specification.niem));
  return [...new Set(niem)];
}

let ruleMetadata = {
  availableReleases: getRulesAvailableReleases(),
  availableSpecs: getRulesAvailableSpecs(),
  availableTargets: getRuleAvailableTargets()
};

let defMetadata = {
  availableReleases: getDefsAvailableReleases()
};

export {
  rules,
  defs,
  ruleMetadata,
  defMetadata
};
