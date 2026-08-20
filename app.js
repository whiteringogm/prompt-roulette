(() => {
  "use strict";

  const data = window.PROMPT_DATA;
  if (!data) return;

  const storageKeys = {
    settings: "prompt-roulette:settings",
    history: "prompt-roulette:history",
    favorites: "prompt-roulette:favorites"
  };

  const categoryMap = new Map(data.categories.map((category) => [category.id, category]));
  const modifierMap = new Map(data.modifiers.map((modifier) => [modifier.id, modifier]));

  const defaults = {
    categories: data.categories.map((category) => category.id),
    modifiers: data.modifiers.map((modifier) => modifier.id),
    modifierCount: 4
  };

  const state = {
    settings: loadJson(storageKeys.settings, defaults),
    history: loadJson(storageKeys.history, []),
    favorites: loadJson(storageKeys.favorites, []),
    current: null,
    statusTimer: null
  };

  normalizeSettings();

  const elements = {
    versionLabel: document.querySelector("#versionLabel"),
    dataCount: document.querySelector("#dataCount"),
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
    historyList: document.querySelector("#historyList"),
    historyCount: document.querySelector("#historyCount"),
    favoriteList: document.querySelector("#favoriteList"),
    favoriteCount: document.querySelector("#favoriteCount"),
    resetSettingsButton: document.querySelector("#resetSettingsButton"),
    modifierTemplate: document.querySelector("#modifierTemplate")
  };

  init();

  function init() {
    elements.versionLabel.textContent = `v${data.version}`;
    elements.dataCount.textContent = `${data.prompts.length} MAIN / ${countModifierValues()} EXTRA`;
    renderCategoryFilters();
    renderModifierFilters();
    syncSettingsUi();
    renderSavedLists();
    bindEvents();
    rollAll(false);
    registerServiceWorker();
  }

  function normalizeSettings() {
    const validCategories = new Set(data.categories.map((item) => item.id));
    const validModifiers = new Set(data.modifiers.map((item) => item.id));

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

    elements.resetSettingsButton.addEventListener("click", () => {
      const confirmed = window.confirm("抽選設定・履歴・お気に入りをすべて初期化しますか？");
      if (!confirmed) return;

      state.settings = structuredCloneSafe(defaults);
      state.history = [];
      state.favorites = [];
      persistSettings();
      persistList(storageKeys.history, state.history);
      persistList(storageKeys.favorites, state.favorites);
      renderCategoryFilters();
      renderModifierFilters();
      syncSettingsUi();
      renderSavedLists();
      rollAll(false);
      showStatus("初期状態に戻した。", 1800);
    });
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
  }

  function rollAll(addToHistory = true) {
    const main = pickMain(state.current?.main?.id);
    const modifiers = pickModifiers();
    state.current = { main, modifiers };
    renderCurrent();
    if (addToHistory) addHistory(state.current);
  }

  function rerollMain() {
    if (!state.current) return;
    state.current.main = pickMain(state.current.main.id);
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
    const candidates = source.values.filter((value) => value !== item.value);
    state.current.modifiers[index] = {
      ...item,
      value: randomItem(candidates.length ? candidates : source.values)
    };
    renderCurrent();
    showStatus(`${item.label}だけ引き直した。`, 1500);
  }

  function pickMain(excludeId) {
    const candidates = data.prompts.filter((prompt) => state.settings.categories.includes(prompt.category));
    const withoutCurrent = candidates.filter((prompt) => prompt.id !== excludeId);
    return structuredCloneSafe(randomItem(withoutCurrent.length ? withoutCurrent : candidates));
  }

  function pickModifiers() {
    const enabled = shuffle(
      data.modifiers.filter((modifier) => state.settings.modifiers.includes(modifier.id))
    );
    const count = Math.min(state.settings.modifierCount, enabled.length);

    return enabled.slice(0, count).map((modifier) => ({
      typeId: modifier.id,
      label: modifier.label,
      value: randomItem(modifier.values)
    }));
  }

  function renderCurrent() {
    if (!state.current) return;

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
    state.current.modifiers.forEach((modifier, index) => {
      const fragment = elements.modifierTemplate.content.cloneNode(true);
      fragment.querySelector(".modifier-card__label").textContent = modifier.label;
      fragment.querySelector(".modifier-card__value").textContent = modifier.value;
      fragment.querySelector(".modifier-card__reroll").addEventListener("click", () => rerollOneModifier(index));
      elements.modifierList.append(fragment);
    });

    elements.modifierCountLabel.textContent = `${state.current.modifiers.length}件`;
    updateFavoriteButton();
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
    const category = categoryMap.get(state.current.main.category)?.label || "お題";
    const extras = state.current.modifiers.map((item) => `・${item.label}：${item.value}`).join("\n");
    const text = `以下のお題で、普段の関係性を保ったまま会話してください。\n\n【メインお題｜${category}】\n${state.current.main.text}\n\n【補助条件】\n${extras}`;

    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        fallbackCopy(text);
      }
      showStatus("コピーした。あとは相手に渡すだけ。", 2000);
    } catch (error) {
      fallbackCopy(text);
      showStatus("コピーした。あとは相手に渡すだけ。", 2000);
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

      const loadButton = document.createElement("button");
      loadButton.className = "saved-item__button";
      loadButton.type = "button";
      loadButton.addEventListener("click", () => {
        state.current = structuredCloneSafe(item);
        renderCurrent();
        window.scrollTo({ top: 0, behavior: "smooth" });
        showStatus("保存した組み合わせを呼び戻した。", 1700);
      });

      const category = document.createElement("span");
      category.className = "saved-item__category";
      category.textContent = categoryMap.get(item.main.category)?.label || "お題";

      const text = document.createElement("span");
      text.className = "saved-item__text";
      text.textContent = item.main.text;
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

  function snapshot(value) {
    return {
      main: structuredCloneSafe(value.main),
      modifiers: structuredCloneSafe(value.modifiers),
      savedAt: new Date().toISOString()
    };
  }

  function makeSignature(value) {
    const extras = value.modifiers
      .map((item) => `${item.typeId}:${item.value}`)
      .sort()
      .join("|");
    return `${value.main.id}::${extras}`;
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
