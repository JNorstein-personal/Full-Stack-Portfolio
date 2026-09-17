"use strict";

/*
 * Focus Window Reader Aid 0.4.0
 * Phase 2-4 clean-rewrite persistence proof of concept.
 *
 * This content script is a rendering/client layer.
 *
 * It does NOT own persistent state.
 * It does NOT store state by URL.
 * It asks background.js whether the Firefox tab in which this document
 * is running owns a persistent session.
 */

(() => {
  const LOG_PREFIX = "[Focus Window 0.4.0 POC]";
  const ROOT_ID = "fwra-persistence-test-root";

  /*
   * Local state belongs only to this document.
   *
   * If Persist is Off, these values disappear naturally when navigation
   * replaces this document.
   *
   * If Persist is On, background.js owns the authoritative state and the
   * next document retrieves it using the Firefox tab identity.
   */
  const state = {
    visible: false,
    persist: false,
    counter: 0,
    tabId: null
  };

  let persistToggleBusy = false;

  /*
   * Serialize counter writes so rapid button presses cannot cause older
   * asynchronous writes to arrive after newer ones.
   */
  let persistentWriteQueue = Promise.resolve();

  /**
   * Normalize the temporary proof-of-concept counter.
   *
   * @param {*} value
   * @returns {number}
   */
  function normalizeCounter(value) {
    const numericValue = Number(value);

    if (!Number.isFinite(numericValue)) {
      return 0;
    }

    const integerValue = Math.trunc(numericValue);

    return Math.max(-999999, Math.min(999999, integerValue));
  }

  /**
   * Return the current prototype root if it exists.
   *
   * @returns {HTMLElement|null}
   */
  function getRoot() {
    return document.getElementById(ROOT_ID);
  }

  /**
   * Create the test UI only if it does not already exist.
   *
   * This makes creation idempotent: repeated render requests cannot produce
   * two roots.
   *
   * @returns {HTMLElement}
   */
  function ensureRoot() {
    const existingRoot = getRoot();

    if (existingRoot) {
      return existingRoot;
    }

    const root = document.createElement("section");

    root.id = ROOT_ID;
    root.setAttribute("aria-label", "Focus Window Reader Aid persistence test");

    root.innerHTML = `
      <div class="fwra-test__heading">
        Focus Window Persistence Test
      </div>

      <div class="fwra-test__row fwra-test__status-row">
        <span data-role="tab-id">Tab: —</span>
        <span data-role="ownership">State: Local</span>
      </div>

      <div class="fwra-test__counter-row">
        <button
          type="button"
          class="fwra-test__button fwra-test__counter-button"
          data-action="decrement"
          aria-label="Decrease test counter"
        >
          −
        </button>

        <span
          class="fwra-test__counter"
          data-role="counter"
          aria-live="polite"
        >
          0
        </span>

        <button
          type="button"
          class="fwra-test__button fwra-test__counter-button"
          data-action="increment"
          aria-label="Increase test counter"
        >
          +
        </button>
      </div>

      <button
        type="button"
        class="fwra-test__button fwra-test__persist-button"
        data-action="persist"
        aria-pressed="false"
      >
        Persist: Off
      </button>

      <div class="fwra-test__instructions">
        Change the counter, enable Persist, then navigate this same Firefox tab.
      </div>
    `;

    root.addEventListener("click", handleRootClick);

    /*
     * Append directly to documentElement rather than depending on any
     * particular webpage layout container.
     */
    document.documentElement.appendChild(root);

    return root;
  }

  /**
   * Remove only the prototype UI belonging to this document.
   *
   * Persistent tab state, if any, remains owned by background.js.
   */
  function destroyRoot() {
    const root = getRoot();

    if (!root) {
      return;
    }

    root.removeEventListener("click", handleRootClick);
    root.remove();
  }

  /**
   * Render current local state.
   *
   * Calling this repeatedly with the same state must produce exactly the
   * same visible result and never duplicate the root.
   */
  function render() {
    if (!state.visible) {
      destroyRoot();
      return;
    }

    const root = ensureRoot();

    const tabIdElement = root.querySelector('[data-role="tab-id"]');
    const ownershipElement = root.querySelector('[data-role="ownership"]');
    const counterElement = root.querySelector('[data-role="counter"]');
    const persistButton = root.querySelector('[data-action="persist"]');

    if (tabIdElement) {
      tabIdElement.textContent =
        state.tabId === null ? "Tab: —" : `Tab: ${state.tabId}`;
    }

    if (ownershipElement) {
      ownershipElement.textContent = state.persist
        ? "State: Tab-owned"
        : "State: Local";
    }

    if (counterElement) {
      counterElement.textContent = String(state.counter);
    }

    if (persistButton) {
      persistButton.textContent = state.persist
        ? "Persist: On"
        : "Persist: Off";

      persistButton.setAttribute(
        "aria-pressed",
        state.persist ? "true" : "false"
      );

      persistButton.disabled = persistToggleBusy;
    }

    root.dataset.persist = state.persist ? "on" : "off";
  }

  /**
   * Queue a persistent counter update.
   *
   * The local UI updates immediately. Persistent writes happen in order.
   *
   * @param {number} counterSnapshot
   */
  function queuePersistentCounterWrite(counterSnapshot) {
    if (!state.persist) {
      return;
    }

    persistentWriteQueue = persistentWriteQueue
      .catch(() => {
        /*
         * Keep the queue usable even if a previous write failed.
         */
      })
      .then(async () => {
        const response = await browser.runtime.sendMessage({
          type: "FOCUS_WINDOW_SET_COUNTER",
          counter: counterSnapshot
        });

        if (!response?.ok) {
          throw new Error(
            response?.error ?? "Background rejected persistent counter update."
          );
        }
      })
      .catch((error) => {
        console.error(
          `${LOG_PREFIX} Persistent counter update failed.`,
          error
        );
      });
  }

  /**
   * Change the temporary counter.
   *
   * @param {number} delta
   */
  function changeCounter(delta) {
    state.counter = normalizeCounter(state.counter + delta);

    render();

    if (state.persist) {
      queuePersistentCounterWrite(state.counter);
    }
  }

  /**
   * Enable or disable tab-owned persistence.
   */
  async function togglePersist() {
    if (persistToggleBusy) {
      return;
    }

    persistToggleBusy = true;
    render();

    try {
      if (!state.persist) {
        /*
         * Persist On establishes the current Firefox tab as owner of a
         * persistent session and immediately saves the current value.
         */
        const response = await browser.runtime.sendMessage({
          type: "FOCUS_WINDOW_SET_PERSIST",
          enabled: true,
          counter: state.counter
        });

        if (!response?.ok || !response.state) {
          throw new Error(
            response?.error ?? "Could not establish persistent tab state."
          );
        }

        state.tabId = response.tabId;
        state.persist = true;
        state.counter = normalizeCounter(response.state.counter);

        console.log(
          `${LOG_PREFIX} Tab ${state.tabId} Persist enabled.`
        );
      } else {
        /*
         * Persist Off removes the authoritative background record but
         * deliberately leaves the currently displayed test UI visible.
         *
         * Navigating after this point creates a new document with no
         * persistent state to restore.
         */
        const response = await browser.runtime.sendMessage({
          type: "FOCUS_WINDOW_SET_PERSIST",
          enabled: false,
          counter: state.counter
        });

        if (!response?.ok) {
          throw new Error(
            response?.error ?? "Could not disable persistent tab state."
          );
        }

        state.tabId = response.tabId;
        state.persist = false;

        console.log(
          `${LOG_PREFIX} Tab ${state.tabId} Persist disabled.`
        );
      }
    } catch (error) {
      console.error(`${LOG_PREFIX} Persist toggle failed.`, error);
    } finally {
      persistToggleBusy = false;
      render();
    }
  }

  /**
   * Handle controls inside the prototype UI.
   *
   * @param {MouseEvent} event
   */
  function handleRootClick(event) {
    const target =
      event.target instanceof Element
        ? event.target.closest("[data-action]")
        : null;

    if (!target) {
      return;
    }

    const action = target.getAttribute("data-action");

    switch (action) {
      case "increment":
        changeCounter(1);
        break;

      case "decrement":
        changeCounter(-1);
        break;

      case "persist":
        void togglePersist();
        break;

      default:
        break;
    }
  }

  /**
   * Initialize this newly loaded document.
   *
   * The background layer determines tab identity from sender.tab.id.
   * The content script never invents or derives its own tab identity.
   */
  async function initialize() {
    try {
      const response = await browser.runtime.sendMessage({
        type: "FOCUS_WINDOW_CONTENT_READY"
      });

      if (!response?.ok) {
        throw new Error(
          response?.error ?? "Background initialization request failed."
        );
      }

      state.tabId = response.tabId;

      if (response.state?.persist === true) {
        /*
         * This tab already owns a persistent session.
         *
         * Render it automatically in this new document.
         */
        state.persist = true;
        state.counter = normalizeCounter(response.state.counter);
        state.visible = true;

        console.log(
          `${LOG_PREFIX} Tab ${state.tabId}: persistent state restored; counter=${state.counter}.`
        );
      } else {
        /*
         * No persistent tab-owned session exists.
         *
         * Remain invisible until the Firefox toolbar button is clicked.
         */
        state.persist = false;
        state.counter = 0;
        state.visible = false;

        console.log(
          `${LOG_PREFIX} Tab ${state.tabId}: no persistent session.`
        );
      }

      render();
    } catch (error) {
      console.error(`${LOG_PREFIX} Content initialization failed.`, error);
    }
  }

  /*
   * Messages from the browser toolbar action arrive here.
   *
   * Hiding this document's prototype does not modify persistent ownership.
   * If Persist remains enabled, a later full navigation will therefore
   * restore the tab-owned session in the next document.
   */
  browser.runtime.onMessage.addListener((message) => {
    if (message?.type !== "FOCUS_WINDOW_ACTION_TOGGLE") {
      return undefined;
    }

    state.visible = !state.visible;
    render();

    console.log(
      `${LOG_PREFIX} Tab ${state.tabId ?? "?"}: toolbar visibility -> ${state.visible}.`
    );

    return Promise.resolve({
      ok: true,
      visible: state.visible,
      persist: state.persist
    });
  });

  void initialize();
})();