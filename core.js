(function attachPromptRouletteCore(root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  root.PROMPT_ROULETTE_CORE = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function createPromptRouletteCore() {
  "use strict";

  function normalizeText(value) {
    return String(value ?? "")
      .normalize("NFKC")
      .toLocaleLowerCase("ja-JP")
      .trim();
  }

  function parseBlockedTerms(value) {
    const source = Array.isArray(value) ? value.join("\n") : String(value ?? "");
    const seen = new Set();
    const terms = [];

    source.split(/[\r\n,、]+/).forEach((part) => {
      const term = part.trim();
      const key = normalizeText(term);
      if (!key || seen.has(key)) return;
      seen.add(key);
      terms.push(term);
    });

    return terms;
  }

  function findMatchingTerms(text, terms) {
    const haystack = normalizeText(text);
    return parseBlockedTerms(terms).filter((term) => haystack.includes(normalizeText(term)));
  }

  function getPromptBlockInfo(prompt, categoryLabel, blockedTerms, blockedPromptIds) {
    const exact = Array.isArray(blockedPromptIds) && blockedPromptIds.includes(prompt.id);
    const searchable = [categoryLabel, prompt.text, ...(prompt.tags || [])].join(" ");
    const matchedTerms = findMatchingTerms(searchable, blockedTerms);
    return {
      blocked: exact || matchedTerms.length > 0,
      exact,
      matchedTerms
    };
  }

  function getAllowedModifierValues(modifier, blockedTerms) {
    return modifier.values.filter((value) => {
      const searchable = `${modifier.label} ${value}`;
      return findMatchingTerms(searchable, blockedTerms).length === 0;
    });
  }

  function formatTemplate(template, replacements) {
    return Object.entries(replacements).reduce(
      (result, [token, value]) => result.split(token).join(String(value ?? "")),
      String(template ?? "")
    );
  }

  function hasPromptToken(template) {
    return String(template ?? "").includes("{{prompt}}");
  }

  return {
    normalizeText,
    parseBlockedTerms,
    findMatchingTerms,
    getPromptBlockInfo,
    getAllowedModifierValues,
    formatTemplate,
    hasPromptToken
  };
});
