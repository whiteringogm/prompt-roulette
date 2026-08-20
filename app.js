(() => {
  "use strict";

  const data = window.PROMPT_DATA;
  const core = window.PROMPT_ROULETTE_CORE;
  if (!data || !core) return;

  const DEFAULT_COPY_TEMPLATE = `以下のお題で、普段の関係性を保ったまま会話してください。

【メインお題｜{{category}}】
{{prompt}}

【補助条件】
{{modifiers}}`;

  const storageKeys = {
    settings: "prompt-roulette:settings",
    history: "prompt-roulette:history",
    favorites: "prompt-roulette:favorites"
  };

  const categoryMap = new Map(data.categories.map((category) => [category.id, category]));
  const modifierMap = new Map(data.modifiers.map((modifier) => [modifier.id, modifier]));
  const promptMap = new Map(data.prompts.map((prompt) => [prompt.id, prompt]));

  const defaults = {
    categories: data.categories.map((category) => category.id),
    modifiers: data.modifiers.map((modifier) => modifier.id),
    modifierCount: 4,
    copyTemplate: DEFAULT_COPY_TEMPLATE,
    blockedTerms: [],
    blockedPromptIds: []
  };

  const state = {
    settings: loadJson(storageKeys.settings, defaults),
    history: loadJson(storageKeys.history, []),
    favorites: loadJson(storageKeys.favorites, []),
    current: null,
    statusTimer: null,
    libraryMessageTimer: null
  };

  normalizeSettings();

  const elements = {
    versionLabel: document.querySelector("#versionLabel"),
    dataCount: document.querySelector("#dataCount"),
    headerPromptCount: document.querySelector("#headerPromptCount"),
    categoryBadge: document.querySelector("#categoryBadge"),
    resultHeading: document.querySelector("#resultHeading"),
    promptTags: document.querySelector("#promptTags"),
    modifierList: document.querySelector("#modifierList"),
    modifierCountLabel: document.querySelector("#modifierCountLabel"),
    rollButton: document.querySelector("#rollButton"),
    rerollMainButton: document.querySelector("#rerollMainButton"),
    favoriteButton: document.querySelector("#favoriteButton"),
    copyButton: document.querySelector("#copyButton"),
    statusMessage: document.querySelector("#statusMessage"),
    categoryFilters: document.querySelector("#categoryFilters"),
    modifierFilters: document.querySelector("#modifierFilters"),
    categorySelectionCount: document.querySelector("#categorySelectionCount"),
    modifierSelectionCount: document.querySelector("#modifierSelectionCount"),
    modifierCount: document.querySelector("#modifierCount"),
    modifierRangeValue: document.querySelector("#modifierRangeValue"),
    selectAllCategories: document.querySelector("#selectAllCategories"),
    clearCategories: document.querySelector("#clearCategories"),
    copyTemplateInput: document.querySelector("#copyTemplateInput"),
    saveCopyTemplateButton: document.querySelector("#saveCopyTemplateButton"),
    resetCopyTemplateButton: document.querySelector("#resetCopyTemplateButton"),
    templateSummaryState: document.querySelector("#templateSummaryState"),
    templateSaveState: document.querySelector("#templateSaveState"),
    blockedTermsInput: document.querySelector("#blockedTermsInput"),
    saveBlockedTermsButton: document.querySelector("#saveBlockedTermsButton"),
    clearBlockListButton: document.querySelector("#clearBlockListButton"),
    blockSummaryCount: document.querySelector("#blockSummaryCount"),
    blockStats: document.querySelector("#blockStats"),
    blockSaveState: document.querySelector("#blockSaveState"),
    blockedPromptList: document.querySelector("#blockedPromptList"),
    historyList: document.querySelector("#historyList"),
    historyCount: document.querySelector("#historyCount"),
    favoriteList: document.querySelector("#favoriteList"),
    favoriteCount: document.querySelector("#favoriteCount"),
    resetSettingsButton: document.querySelector("#resetSettingsButton"),
    modifierTemplate: document.querySelector("#modifierTemplate"),
    openPromptLibraryButton: document.querySelector("#openPromptLibraryButton"),
    closePromptLibraryButton: document.querySelector("#closePromptLibraryButton"),
    promptLibraryDialog: document.querySelector("#promptLibraryDialog"),
    promptLibrarySearch: document.querySelector("#promptLibrarySearch"),
    promptLibraryCategory: document.querySelector("#promptLibraryCategory"),
    promptLibraryStatus: document.querySelector("#promptLibraryStatus"),
    promptLibraryResultCount: document.querySelector("#promptLibraryResultCount"),
    promptLibraryMessage: document.querySelector("#promptLibraryMessage"),
    promptLibraryList: document.querySelector("#promptLibraryList")
  };

  init();

  function init() {
    elements.versionLabel.textContent = `v${data.version}`;
    elements.headerPromptCount.textContent = data.prompts.length;
    elements.dataCount.textContent = `${data.prompts.length} MAIN / ${countModifierValues()} EXTRA`;
    elements.copyTemplateInput.value = state.settings.copyTemplate;
    elements.blockedTermsInput.value = state.settings.blockedTerms.join("\n");
    renderCategoryFilters();
    renderModifierFilters();
    renderPromptLibraryCategories();
    syncSettingsUi();
    renderBlockSettings();
    renderSavedLists();
    bindEvents();
    rollAll(false);
    registerServiceWorker();
  }

  function normalizeSettings() {
    const validCategories = new Set(data.categories.map((item) => item.id));
    const validModifiers = new Set(data.modifiers.map((item) => item.id));
    const validPrompts = new Set(data.prompts.map((item) => item.id));

    if (!state.settings || typeof state.settings !== "object" || Array.isArray(state.settings)) {
      state.settings = {};
    }

    state.settings.categories = Array.isArray(state.settings.categories)
      ? state.settings.categories.filter((id) => validCategories.has(id))
      : [...defaults.categories];
    state.settings.modifiers = Array.isArray(state.settings.modifiers)
      ? state.settings.modifiers.filter((id) => validModifiers.has(id))
      : [...defaults.modifiers];

    if (!state.settings.categories.length) state.settings.categories = [...defaults.categories];
    if (!state.settings.modifiers.length) state.settings.modifiers = [...defaults.modifiers];

    const requestedCount = Number(state.settings.modifierCount) || defaults.modifierCount;
    state.settings.modifierCount = clamp(requestedCount, 1, Math.min(8, state.settings.modifiers.length));
    state.settings.copyTemplate =
      typeof state.settings.copyTemplate === "string" && core.hasPromptToken(state.settings.copyTemplate)
        ? state.settings.copyTemplate
        : DEFAULT_COPY_TEMPLATE;
    state.settings.blockedTerms = core.parseBlockedTerms(state.settings.blockedTerms);
    state.settings.blockedPromptIds = Array.isArray(state.settings.blockedPromptIds)
      ? [...new Set(state.settings.blockedPromptIds.filter((id) => validPrompts.has(id)))]
      : [];

    if (!Array.isArray(state.history)) state.history = [];
    if (!Array.isArray(state.favorites)) state.favorites = [];
  }

  function bindEvents() {
    elements.rollButton.addEventListener("click", () => rollAll(true));
    elements.rerollMainButton.addEventListener("click", rerollMain);
    elements.favoriteButton.addEventListener("click", toggleFavorite);
    elements.copyButton.addEventListener("click", copyCurrent);

    elements.modifierCount.addEventListener("input", (event) => {
      state.settings.modifierCount = clamp(Number(event.target.value), 1, state.settings.modifiers.length);
      elements.modifierRangeValue.textContent = state.settings.modifierCount;
      persistSettings();
      rerollModifiers();
    });

    elements.selectAllCategories.addEventListener("click", () => {
      state.settings.categories = [...defaults.categories];
      renderCategoryFilters();
      syncSettingsUi();
      persistSettings();
    });

    elements.clearCategories.addEventListener("click", () => {
      const currentCategory = state.current?.main?.category || defaults.categories[0];
      state.settings.categories = [currentCategory];
      renderCategoryFilters();
      syncSettingsUi();
      persistSettings();
      showStatus("表示中のお題と同じ種類だけ残した。", 1800);
    });

    elements.copyTemplateInput.addEventListener("input", () => {
      elements.templateSummaryState.textContent = "未保存";
      elements.templateSaveState.textContent = "変更はまだ保存されていません。";
    });
    elements.saveCopyTemplateButton.addEventListener("click", () => saveCopyTemplate(true));
    elements.resetCopyTemplateButton.addEventListener("click", () => {
      elements.copyTemplateInput.value = DEFAULT_COPY_TEMPLATE;
      saveCopyTemplate(true);
    });
    document.querySelectorAll("[data-template-token]").forEach((button) => {
      button.addEventListener("click", () => insertTemplateToken(button.dataset.templateToken));
    });

    elements.blockedTermsInput.addEventListener("input", () => {
      const draftTerms = core.parseBlockedTerms(elements.blockedTermsInput.value);
      updateBlockStats(draftTerms);
      elements.blockSaveState.textContent = "変更はまだ保存されていません。";
    });
    elements.saveBlockedTermsButton.addEventListener("click", saveBlockedTerms);
    elements.clearBlockListButton.addEventListener("click", clearBlockList);

    elements.openPromptLibraryButton.addEventListener("click", openPromptLibrary);
    elements.closePromptLibraryButton.addEventListener("click", closePromptLibrary);
    elements.promptLibrarySearch.addEventListener("input", () => {
      showLibraryMessage("");
      renderPromptLibrary();
    });
    elements.promptLibraryCategory.addEventListener("change", () => {
      showLibraryMessage("");
      renderPromptLibrary();
    });
    elements.promptLibraryStatus.addEventListener("change", () => {
      showLibraryMessage("");
      renderPromptLibrary();
    });
    elements.promptLibraryDialog.addEventListener("click", (event) => {
      if (event.target === elements.promptLibraryDialog) closePromptLibrary();
    });
    elements.promptLibraryDialog.addEventListener("close", () => {
      document.body.classList.remove("dialog-open");
    });

    elements.resetSettingsButton.addEventListener("click", resetEverything);
  }

  function renderCategoryFilters() {
    elements.categoryFilters.replaceChildren();
    data.categories.forEach((category) => {
      const wrapper = document.createElement("div");
      wrapper.className = "check-item";

      const input = document.createElement("input");
      input.type = "checkbox";
      input.id = `category-${category.id}`;
      input.value = category.id;
      input.checked = state.settings.categories.includes(category.id);
      input.addEventListener("change", () => handleCategoryChange(input));

      const label = document.createElement("label");
      label.htmlFor = input.id;
      label.textContent = category.label;

      wrapper.append(input, label);
      elements.categoryFilters.append(wrapper);
    });
  }

  function renderModifierFilters() {
    elements.modifierFilters.replaceChildren();
    data.modifiers.forEach((modifier) => {
      const wrapper = document.createElement("div");
      wrapper.className = "check-item";

      const input = document.createElement("input");
      input.type = "checkbox";
      input.id = `modifier-${modifier.id}`;
      input.value = modifier.id;
      input.checked = state.settings.modifiers.includes(modifier.id);
      input.addEventListener("change", () => handleModifierChange(input));

      const label = document.createElement("label");
      label.htmlFor = input.id;
      label.textContent = modifier.label;

      wrapper.append(input, label);
      elements.modifierFilters.append(wrapper);
    });
  }

  function handleCategoryChange(input) {
    const selected = checkedValues(elements.categoryFilters);
    if (!selected.length) {
      input.checked = true;
      showStatus("メインお題は最低一種類必要。そこまで全部捨てなくていい。", 2600);
      return;
    }

    const prospective = { ...state.settings, categories: selected };
    if (!getEligiblePrompts(prospective).length) {
      input.checked = !input.checked;
      showStatus("その組み合わせは地雷除外後の候補が0件。分類か地雷を少し戻して。", 3000);
      return;
    }

    state.settings.categories = selected;
    persistSettings();
    syncSettingsUi();
  }

  function handleModifierChange(input) {
    const selected = checkedValues(elements.modifierFilters);
    if (!selected.length) {
      input.checked = true;
      showStatus("補助条件は最低一種類必要。主題だけで走るには、まだ早い。", 2600);
      return;
    }

    state.settings.modifiers = selected;
    state.settings.modifierCount = Math.min(state.settings.modifierCount, selected.length);
    persistSettings();
    syncSettingsUi();
    rerollModifiers();
  }

  function syncSettingsUi() {
    elements.categorySelectionCount.textContent = `${state.settings.categories.length}/${data.categories.length}`;
    elements.modifierSelectionCount.textContent = `${state.settings.modifiers.length}/${data.modifiers.length}`;
    elements.modifierCount.max = Math.min(8, state.settings.modifiers.length);
    elements.modifierCount.value = state.settings.modifierCount;
    elements.modifierRangeValue.textContent = state.settings.modifierCount;
    elements.templateSummaryState.textContent = "保存済み";
    updateBlockSummary();
  }

  function saveCopyTemplate(showFeedback) {
    const template = elements.copyTemplateInput.value;
    if (!template.trim()) {
      elements.templateSaveState.textContent = "空のテンプレートは保存できません。";
      showStatus("コピー文が空。呼びかけだけでも置いて。", 2400);
      return false;
    }
    if (!core.hasPromptToken(template)) {
      elements.templateSaveState.textContent = "お題本文の差し込み「{{prompt}}」が必要です。";
      showStatus("{{prompt}} がないと、お題本人が置いていかれる。", 2800);
      return false;
    }

    state.settings.copyTemplate = template;
    persistSettings();
    elements.templateSummaryState.textContent = "保存済み";
    elements.templateSaveState.textContent = showFeedback ? "この端末に保存しました。" : "";
    if (showFeedback) showStatus("コピー文テンプレートを保存した。", 1800);
    return true;
  }

  function insertTemplateToken(token) {
    const input = elements.copyTemplateInput;
    const start = input.selectionStart ?? input.value.length;
    const end = input.selectionEnd ?? start;
    input.setRangeText(token, start, end, "end");
    input.dispatchEvent(new Event("input", { bubbles: true }));
    input.focus();
  }

  function saveBlockedTerms() {
    const terms = core.parseBlockedTerms(elements.blockedTermsInput.value);
    const prospective = { ...state.settings, blockedTerms: terms };

    if (!getEligiblePrompts(prospective).length) {
      elements.blockSaveState.textContent = "この内容では、選択中のメインお題が0件になります。";
      showStatus("全滅した。地雷ワードを一つ減らして。", 2800);
      return;
    }

    state.settings.blockedTerms = terms;
    elements.blockedTermsInput.value = terms.join("\n");
    persistSettings();
    renderBlockSettings();
    refreshAfterBlockChange();
    elements.blockSaveState.textContent = "この端末に保存しました。";
    showStatus("地雷リストを保存した。抽選から外しておく。", 2200);
  }

  function clearBlockList() {
    if (!state.settings.blockedTerms.length && !state.settings.blockedPromptIds.length) {
      elements.blockSaveState.textContent = "現在、地雷リストは空です。";
      return;
    }
    const confirmed = window.confirm("地雷ワードと個別除外をすべて解除しますか？");
    if (!confirmed) return;

    state.settings.blockedTerms = [];
    state.settings.blockedPromptIds = [];
    elements.blockedTermsInput.value = "";
    persistSettings();
    renderBlockSettings();
    rerollModifiers();
    renderSavedLists();
    renderPromptLibraryIfOpen();
    elements.blockSaveState.textContent = "地雷リストをすべて解除しました。";
    showStatus("地雷リストを空にした。全候補を抽選へ戻した。", 2200);
  }

  function refreshAfterBlockChange() {
    if (state.current && getPromptBlockInfo(state.current.main).blocked) {
      rollAll(false);
    } else {
      rerollModifiers();
    }
    renderSavedLists();
    renderPromptLibraryIfOpen();
  }

  function renderBlockSettings() {
    elements.blockedTermsInput.value = state.settings.blockedTerms.join("\n");
    updateBlockSummary();
    updateBlockStats(state.settings.blockedTerms);
    renderBlockedPromptList();
  }

  function updateBlockSummary() {
    const total = state.settings.blockedTerms.length + state.settings.blockedPromptIds.length;
    elements.blockSummaryCount.textContent = total ? `${total}件` : "なし";
  }

  function updateBlockStats(terms) {
    const prospective = { ...state.settings, blockedTerms: terms };
    const blockedMain = data.prompts.filter((prompt) => getPromptBlockInfo(prompt, prospective).blocked).length;
    const blockedExtra = data.modifiers.reduce(
      (total, modifier) => total + (modifier.values.length - getAllowedModifierValues(modifier, terms).length),
      0
    );
    const remaining = data.prompts.length - blockedMain;
    elements.blockStats.textContent = `除外予定：メイン ${blockedMain}件・補助 ${blockedExtra}件／メイン残り ${remaining}件`;
  }

  function renderBlockedPromptList() {
    elements.blockedPromptList.replaceChildren();
    const prompts = state.settings.blockedPromptIds.map((id) => promptMap.get(id)).filter(Boolean);

    if (!prompts.length) {
      const empty = document.createElement("p");
      empty.className = "exact-block-empty";
      empty.textContent = "お題一覧から個別に追加できます。";
      elements.blockedPromptList.append(empty);
      return;
    }

    prompts.forEach((prompt) => {
      const item = document.createElement("div");
      item.className = "exact-block-item";
      const text = document.createElement("span");
      text.textContent = prompt.text;
      const removeButton = document.createElement("button");
      removeButton.type = "button";
      removeButton.textContent = "×";
      removeButton.setAttribute("aria-label", "このお題の個別除外を解除");
      removeButton.addEventListener("click", () => togglePromptBlock(prompt));
      item.append(text, removeButton);
      elements.blockedPromptList.append(item);
    });
  }

  function togglePromptBlock(prompt) {
    const ids = new Set(state.settings.blockedPromptIds);
    const adding = !ids.has(prompt.id);
    if (adding) ids.add(prompt.id);
    else ids.delete(prompt.id);

    const prospective = { ...state.settings, blockedPromptIds: [...ids] };
    if (adding && !getEligiblePrompts(prospective).length) {
      showLibraryMessage("これを除外すると、選択中の候補が0件になる。", 3200);
      showStatus("最後の一件までは地雷に送れない。", 2500);
      return;
    }

    state.settings.blockedPromptIds = [...ids];
    persistSettings();
    renderBlockSettings();
    refreshAfterBlockChange();
    showLibraryMessage(adding ? "個別の地雷リストへ追加した。" : "個別除外を解除した。", 2200);
  }

  function getPromptBlockInfo(prompt, settings = state.settings) {
    const categoryLabel = categoryMap.get(prompt.category)?.label || "";
    return core.getPromptBlockInfo(
      prompt,
      categoryLabel,
      settings.blockedTerms,
      settings.blockedPromptIds
    );
  }

  function getEligiblePrompts(settings = state.settings) {
    return data.prompts.filter(
      (prompt) => settings.categories.includes(prompt.category) && !getPromptBlockInfo(prompt, settings).blocked
    );
  }

  function getAllowedModifierValues(modifier, terms = state.settings.blockedTerms) {
    return core.getAllowedModifierValues(modifier, terms);
  }

  function rollAll(addToHistory = true) {
    const main = pickMain(state.current?.main?.id);
    if (!main) {
      renderNoCandidates();
      showStatus("抽選できるメインお題が0件。分類か地雷リストを調整して。", 3200);
      return;
    }

    const modifiers = pickModifiers();
    state.current = { main, modifiers };
    renderCurrent();
    if (addToHistory) addHistory(state.current);
  }

  function rerollMain() {
    if (!state.current) {
      rollAll(false);
      return;
    }
    const main = pickMain(state.current.main.id);
    if (!main) {
      renderNoCandidates();
      return;
    }
    state.current.main = main;
    renderCurrent();
    showStatus("メインお題だけ引き直した。", 1500);
  }

  function rerollModifiers() {
    if (!state.current) return;
    state.current.modifiers = pickModifiers();
    renderCurrent();
  }

  function rerollOneModifier(index) {
    const item = state.current?.modifiers[index];
    if (!item) return;
    const source = modifierMap.get(item.typeId);
    if (!source) return;
    const allowed = getAllowedModifierValues(source);
    const candidates = allowed.filter((value) => value !== item.value);
    if (!candidates.length) {
      showStatus(`${item.label}は、地雷除外後の別候補がない。`, 2200);
      return;
    }
    state.current.modifiers[index] = { ...item, value: randomItem(candidates) };
    renderCurrent();
    showStatus(`${item.label}だけ引き直した。`, 1500);
  }

  function pickMain(excludeId) {
    const candidates = getEligiblePrompts();
    if (!candidates.length) return null;
    const withoutCurrent = candidates.filter((prompt) => prompt.id !== excludeId);
    return structuredCloneSafe(randomItem(withoutCurrent.length ? withoutCurrent : candidates));
  }

  function pickModifiers() {
    const enabled = shuffle(
      data.modifiers
        .filter((modifier) => state.settings.modifiers.includes(modifier.id))
        .map((modifier) => ({ ...modifier, allowedValues: getAllowedModifierValues(modifier) }))
        .filter((modifier) => modifier.allowedValues.length)
    );
    const count = Math.min(state.settings.modifierCount, enabled.length);

    return enabled.slice(0, count).map((modifier) => ({
      typeId: modifier.id,
      label: modifier.label,
      value: randomItem(modifier.allowedValues)
    }));
  }

  function renderCurrent() {
    if (!state.current) return;
    elements.copyButton.disabled = false;
    elements.favoriteButton.disabled = false;

    const category = categoryMap.get(state.current.main.category);
    elements.categoryBadge.textContent = category?.label || "その他";
    elements.resultHeading.textContent = state.current.main.text;

    elements.promptTags.replaceChildren();
    state.current.main.tags.forEach((tagText) => {
      const tag = document.createElement("span");
      tag.className = "tag";
      tag.textContent = `# ${tagText}`;
      elements.promptTags.append(tag);
    });

    elements.modifierList.replaceChildren();
    if (!state.current.modifiers.length) {
      const empty = document.createElement("p");
      empty.className = "modifier-empty";
      empty.textContent = "地雷設定により、表示できる補助条件がありません。";
      elements.modifierList.append(empty);
    } else {
      state.current.modifiers.forEach((modifier, index) => {
        const fragment = elements.modifierTemplate.content.cloneNode(true);
        fragment.querySelector(".modifier-card__label").textContent = modifier.label;
        fragment.querySelector(".modifier-card__value").textContent = modifier.value;
        fragment.querySelector(".modifier-card__reroll").addEventListener("click", () => rerollOneModifier(index));
        elements.modifierList.append(fragment);
      });
    }

    elements.modifierCountLabel.textContent = `${state.current.modifiers.length}件`;
    updateFavoriteButton();
  }

  function renderNoCandidates() {
    state.current = null;
    elements.categoryBadge.textContent = "候補なし";
    elements.resultHeading.textContent = "抽選できるお題がありません。分類か地雷リストを調整してください。";
    elements.promptTags.replaceChildren();
    elements.modifierList.replaceChildren();
    elements.modifierCountLabel.textContent = "0件";
    elements.copyButton.disabled = true;
    elements.favoriteButton.disabled = true;
    elements.favoriteButton.classList.remove("is-active");
    elements.favoriteButton.textContent = "♡";
  }

  function toggleFavorite() {
    if (!state.current) return;
    const signature = makeSignature(state.current);
    const existingIndex = state.favorites.findIndex((item) => makeSignature(item) === signature);

    if (existingIndex >= 0) {
      state.favorites.splice(existingIndex, 1);
      showStatus("お気に入りから外した。", 1600);
    } else {
      state.favorites.unshift(snapshot(state.current));
      showStatus("この組み合わせを保存した。", 1600);
    }

    persistList(storageKeys.favorites, state.favorites);
    renderSavedLists();
    updateFavoriteButton();
  }

  function updateFavoriteButton() {
    const isFavorite = state.current
      ? state.favorites.some((item) => makeSignature(item) === makeSignature(state.current))
      : false;
    elements.favoriteButton.classList.toggle("is-active", isFavorite);
    elements.favoriteButton.textContent = isFavorite ? "♥" : "♡";
    elements.favoriteButton.setAttribute(
      "aria-label",
      isFavorite ? "現在のお題をお気に入りから外す" : "現在のお題をお気に入りに保存"
    );
  }

  async function copyCurrent() {
    if (!state.current) return;
    if (!saveCopyTemplate(false)) return;

    const category = categoryMap.get(state.current.main.category)?.label || "お題";
    const extras = state.current.modifiers.length
      ? state.current.modifiers.map((item) => `・${item.label}：${item.value}`).join("\n")
      : "指定なし";
    const tags = state.current.main.tags.map((tag) => `#${tag}`).join(" ");
    const text = core.formatTemplate(state.settings.copyTemplate, {
      "{{category}}": category,
      "{{prompt}}": state.current.main.text,
      "{{modifiers}}": extras,
      "{{tags}}": tags
    });

    try {
      if (navigator.clipboard?.writeText) await navigator.clipboard.writeText(text);
      else fallbackCopy(text);
      showStatus("テンプレートどおりにコピーした。あとは相手に渡すだけ。", 2200);
    } catch (error) {
      fallbackCopy(text);
      showStatus("テンプレートどおりにコピーした。あとは相手に渡すだけ。", 2200);
    }
  }

  function addHistory(value) {
    const item = snapshot(value);
    const signature = makeSignature(item);
    if (state.history[0] && makeSignature(state.history[0]) === signature) return;
    state.history.unshift(item);
    state.history = state.history.slice(0, 20);
    persistList(storageKeys.history, state.history);
    renderSavedLists();
  }

  function renderSavedLists() {
    renderSavedList(elements.historyList, state.history, "history");
    renderSavedList(elements.favoriteList, state.favorites, "favorites");
    elements.historyCount.textContent = `${state.history.length}件`;
    elements.favoriteCount.textContent = `${state.favorites.length}件`;
  }

  function renderSavedList(container, items, listName) {
    container.replaceChildren();
    if (!items.length) {
      const empty = document.createElement("p");
      empty.className = "saved-empty";
      empty.textContent = listName === "history" ? "回すと、ここに直近20件を残します。" : "♡を押すと、組み合わせごと保存します。";
      container.append(empty);
      return;
    }

    items.forEach((item, index) => {
      const article = document.createElement("article");
      article.className = "saved-item";
      const blocked = !item.main || getPromptBlockInfo(item.main).blocked;
      article.classList.toggle("is-blocked", blocked);

      const loadButton = document.createElement("button");
      loadButton.className = "saved-item__button";
      loadButton.type = "button";
      loadButton.disabled = blocked;
      loadButton.addEventListener("click", () => {
        const safeModifiers = (item.modifiers || []).filter((modifier) => {
          const source = modifierMap.get(modifier.typeId);
          return source && getAllowedModifierValues(source).includes(modifier.value);
        });
        state.current = { main: structuredCloneSafe(item.main), modifiers: structuredCloneSafe(safeModifiers) };
        renderCurrent();
        window.scrollTo({ top: 0, behavior: "smooth" });
        showStatus("保存した組み合わせを呼び戻した。", 1700);
      });

      const category = document.createElement("span");
      category.className = "saved-item__category";
      const categoryName = categoryMap.get(item.main?.category)?.label || "お題";
      category.textContent = blocked ? `${categoryName}・除外中` : categoryName;

      const text = document.createElement("span");
      text.className = "saved-item__text";
      text.textContent = item.main?.text || "削除されたお題";
      loadButton.append(category, text);

      const deleteButton = document.createElement("button");
      deleteButton.className = "saved-item__delete";
      deleteButton.type = "button";
      deleteButton.textContent = "×";
      deleteButton.setAttribute("aria-label", "この保存項目を削除");
      deleteButton.addEventListener("click", () => {
        const target = listName === "history" ? state.history : state.favorites;
        target.splice(index, 1);
        persistList(storageKeys[listName], target);
        renderSavedLists();
        updateFavoriteButton();
      });

      article.append(loadButton, deleteButton);
      container.append(article);
    });
  }

  function renderPromptLibraryCategories() {
    data.categories.forEach((category) => {
      const option = document.createElement("option");
      option.value = category.id;
      option.textContent = category.label;
      elements.promptLibraryCategory.append(option);
    });
  }

  function openPromptLibrary() {
    renderPromptLibrary();
    document.body.classList.add("dialog-open");
    if (typeof elements.promptLibraryDialog.showModal === "function") {
      elements.promptLibraryDialog.showModal();
    } else {
      elements.promptLibraryDialog.setAttribute("open", "");
    }
    window.setTimeout(() => elements.promptLibrarySearch.focus(), 0);
  }

  function closePromptLibrary() {
    if (typeof elements.promptLibraryDialog.close === "function" && elements.promptLibraryDialog.open) {
      elements.promptLibraryDialog.close();
    } else {
      elements.promptLibraryDialog.removeAttribute("open");
      document.body.classList.remove("dialog-open");
    }
  }

  function renderPromptLibraryIfOpen() {
    if (elements.promptLibraryDialog.open || elements.promptLibraryDialog.hasAttribute("open")) {
      renderPromptLibrary();
    }
  }

  function renderPromptLibrary() {
    const previousScroll = elements.promptLibraryList.scrollTop;
    const query = core.normalizeText(elements.promptLibrarySearch.value);
    const categoryFilter = elements.promptLibraryCategory.value;
    const statusFilter = elements.promptLibraryStatus.value;

    const results = data.prompts.filter((prompt) => {
      const category = categoryMap.get(prompt.category)?.label || "";
      const info = getPromptBlockInfo(prompt);
      const searchable = core.normalizeText([category, prompt.text, ...(prompt.tags || [])].join(" "));
      if (query && !searchable.includes(query)) return false;
      if (categoryFilter !== "all" && prompt.category !== categoryFilter) return false;
      if (statusFilter === "eligible" && info.blocked) return false;
      if (statusFilter === "blocked" && !info.blocked) return false;
      return true;
    });

    elements.promptLibraryResultCount.textContent = `該当 ${results.length}件 / 全${data.prompts.length}件`;
    elements.promptLibraryList.replaceChildren();

    if (!results.length) {
      const empty = document.createElement("p");
      empty.className = "library-empty";
      empty.textContent = "条件に合うお題はありません。";
      elements.promptLibraryList.append(empty);
      return;
    }

    results.forEach((prompt) => elements.promptLibraryList.append(createLibraryItem(prompt)));
    window.requestAnimationFrame(() => {
      elements.promptLibraryList.scrollTop = previousScroll;
    });
  }

  function createLibraryItem(prompt) {
    const info = getPromptBlockInfo(prompt);
    const article = document.createElement("article");
    article.className = "library-item";
    article.classList.toggle("is-blocked", info.blocked);

    const topLine = document.createElement("div");
    topLine.className = "library-item__topline";
    const badges = document.createElement("div");
    badges.className = "library-item__badges";
    const category = document.createElement("span");
    category.className = "library-category";
    category.textContent = categoryMap.get(prompt.category)?.label || "その他";
    const status = document.createElement("span");
    status.className = `library-state${info.blocked ? " library-state--blocked" : ""}`;
    status.textContent = info.blocked ? "抽選から除外中" : "地雷なし";
    badges.append(category, status);
    topLine.append(badges);

    const text = document.createElement("p");
    text.className = "library-item__text";
    text.textContent = prompt.text;

    article.append(topLine, text);

    if (info.blocked) {
      const reason = document.createElement("p");
      reason.className = "library-item__reason";
      const reasons = [];
      if (info.exact) reasons.push("個別除外");
      if (info.matchedTerms.length) reasons.push(`地雷ワード：${info.matchedTerms.join("、")}`);
      reason.textContent = reasons.join(" / ");
      article.append(reason);
    }

    const tags = document.createElement("div");
    tags.className = "library-item__tags";
    prompt.tags.forEach((tag) => {
      const tagElement = document.createElement("span");
      tagElement.className = "library-item__tag";
      tagElement.textContent = `# ${tag}`;
      tags.append(tagElement);
    });

    const actions = document.createElement("div");
    actions.className = "library-item__actions";
    const loadButton = document.createElement("button");
    loadButton.type = "button";
    loadButton.className = "library-action-button library-action-button--primary";
    loadButton.textContent = info.blocked ? "除外中" : "このお題を表示";
    loadButton.disabled = info.blocked;
    loadButton.addEventListener("click", () => loadPromptFromLibrary(prompt));

    const blockButton = document.createElement("button");
    blockButton.type = "button";
    blockButton.className = "library-action-button";
    blockButton.textContent = info.exact ? "個別除外を解除" : "このお題を除外";
    blockButton.addEventListener("click", () => togglePromptBlock(prompt));
    actions.append(loadButton, blockButton);

    article.append(tags, actions);
    return article;
  }

  function loadPromptFromLibrary(prompt) {
    if (getPromptBlockInfo(prompt).blocked) return;
    state.current = { main: structuredCloneSafe(prompt), modifiers: pickModifiers() };
    renderCurrent();
    addHistory(state.current);
    closePromptLibrary();
    window.scrollTo({ top: 0, behavior: "smooth" });
    showStatus("一覧から選んだお題を表示した。", 1700);
  }

  function showLibraryMessage(message, duration = 0) {
    window.clearTimeout(state.libraryMessageTimer);
    elements.promptLibraryMessage.textContent = message;
    if (message && duration) {
      state.libraryMessageTimer = window.setTimeout(() => {
        elements.promptLibraryMessage.textContent = "";
      }, duration);
    }
  }

  function resetEverything() {
    const confirmed = window.confirm("抽選設定・コピー文・地雷リスト・履歴・お気に入りをすべて初期化しますか？");
    if (!confirmed) return;

    state.settings = structuredCloneSafe(defaults);
    state.history = [];
    state.favorites = [];
    elements.copyTemplateInput.value = state.settings.copyTemplate;
    elements.blockedTermsInput.value = "";
    persistSettings();
    persistList(storageKeys.history, state.history);
    persistList(storageKeys.favorites, state.favorites);
    renderCategoryFilters();
    renderModifierFilters();
    syncSettingsUi();
    renderBlockSettings();
    renderSavedLists();
    renderPromptLibraryIfOpen();
    rollAll(false);
    elements.templateSaveState.textContent = "";
    elements.blockSaveState.textContent = "";
    showStatus("初期状態に戻した。", 1800);
  }

  function snapshot(value) {
    return {
      main: structuredCloneSafe(value.main),
      modifiers: structuredCloneSafe(value.modifiers),
      savedAt: new Date().toISOString()
    };
  }

  function makeSignature(value) {
    const extras = (value.modifiers || [])
      .map((item) => `${item.typeId}:${item.value}`)
      .sort()
      .join("|");
    return `${value.main?.id || "missing"}::${extras}`;
  }

  function showStatus(message, duration = 1800) {
    window.clearTimeout(state.statusTimer);
    elements.statusMessage.textContent = message;
    state.statusTimer = window.setTimeout(() => {
      elements.statusMessage.textContent = "";
    }, duration);
  }

  function persistSettings() {
    try {
      localStorage.setItem(storageKeys.settings, JSON.stringify(state.settings));
    } catch (error) {
      // 保存できない環境でも、開いている間の抽選は続けられる。
    }
  }

  function persistList(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      // 保存できない環境でも、開いている間の抽選は続けられる。
    }
  }

  function loadJson(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : structuredCloneSafe(fallback);
    } catch (error) {
      return structuredCloneSafe(fallback);
    }
  }

  function checkedValues(container) {
    return [...container.querySelectorAll("input:checked")].map((input) => input.value);
  }

  function randomItem(items) {
    return items[Math.floor(Math.random() * items.length)];
  }

  function shuffle(items) {
    const copy = [...items];
    for (let index = copy.length - 1; index > 0; index -= 1) {
      const target = Math.floor(Math.random() * (index + 1));
      [copy[index], copy[target]] = [copy[target], copy[index]];
    }
    return copy;
  }

  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  function countModifierValues() {
    return data.modifiers.reduce((total, modifier) => total + modifier.values.length, 0);
  }

  function structuredCloneSafe(value) {
    return typeof structuredClone === "function"
      ? structuredClone(value)
      : JSON.parse(JSON.stringify(value));
  }

  function fallbackCopy(text) {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.append(textarea);
    textarea.select();
    document.execCommand("copy");
    textarea.remove();
  }

  function registerServiceWorker() {
    if (!("serviceWorker" in navigator) || window.location.protocol === "file:") return;
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("./sw.js").catch(() => {
        // オフライン機能が使えない環境でも、本体の抽選機能はそのまま動作する。
      });
    });
  }
})();
