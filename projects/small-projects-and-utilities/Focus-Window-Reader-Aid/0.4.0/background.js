"use strict";

/*
 * Focus Window Reader Aid 0.4.0
 * Phase 2-4 clean-rewrite persistence proof of concept.
 *
 * This background script is the authoritative owner of persistent
 * tab-scoped state.
 *
 * IMPORTANT:
 * Persistent state is keyed only by Firefox tab ID.
 * It is never keyed by URL, hostname, origin, or document.
 */

const LOG_PREFIX = "[Focus Window 0.4.0 POC]";
const STORAGE_KEY_PREFIX = "focus-window-reader-aid:tab:";
const STATE_SCHEMA_VERSION = 1;

/**
 * Return the storage key belonging to one Firefox tab.
 *
 * @param {number} tabId
 * @returns {string}
 */
function getTabStorageKey(tabId) {
  return `${STORAGE_KEY_PREFIX}${tabId}`;
}

/**
 * Keep the temporary development counter within a predictable range.
 *
 * The counter exists only to prove that arbitrary tab-owned state can
 * survive navigation. It is not part of the production Focus Window state.
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
 * Construct a validated minimal persistent-state object.
 *
 * @param {object} candidate
 * @returns {object}
 */
function normalizePersistentState(candidate = {}) {
  return {
    schemaVersion: STATE_SCHEMA_VERSION,
    persist: true,
    counter: normalizeCounter(candidate.counter)
  };
}

/**
 * Retrieve the persistent session belonging to a tab.
 *
 * @param {number} tabId
 * @returns {Promise<object|null>}
 */
async function getPersistentState(tabId) {
  const key = getTabStorageKey(tabId);
  const stored = await browser.storage.session.get(key);
  const candidate = stored[key];

  if (!candidate || candidate.persist !== true) {
    return null;
  }

  return normalizePersistentState(candidate);
}

/**
 * Save the persistent session belonging to a tab.
 *
 * @param {number} tabId
 * @param {object} state
 * @returns {Promise<object>}
 */
async function setPersistentState(tabId, state) {
  const key = getTabStorageKey(tabId);
  const normalized = normalizePersistentState(state);

  await browser.storage.session.set({
    [key]: normalized
  });

  return normalized;
}

/**
 * Remove persistent state belonging to one tab.
 *
 * @param {number} tabId
 * @returns {Promise<void>}
 */
async function clearPersistentState(tabId) {
  const key = getTabStorageKey(tabId);

  await browser.storage.session.remove(key);
}

/**
 * Verify that a runtime message originated from an ordinary Firefox tab.
 *
 * @param {browser.runtime.MessageSender} sender
 * @returns {number|null}
 */
function getSenderTabId(sender) {
  const tabId = sender?.tab?.id;

  return Number.isInteger(tabId) ? tabId : null;
}

/**
 * Handle messages sent by content.js.
 *
 * Returning tabId in development responses makes tab ownership visually
 * obvious during the proof-of-concept phase.
 *
 * @param {object} message
 * @param {browser.runtime.MessageSender} sender
 * @returns {Promise<object>}
 */
async function handleContentMessage(message, sender) {
  const tabId = getSenderTabId(sender);

  if (tabId === null) {
    return {
      ok: false,
      error: "Message did not originate from a Firefox tab."
    };
  }

  switch (message?.type) {
    case "FOCUS_WINDOW_CONTENT_READY": {
      const persistentState = await getPersistentState(tabId);

      console.log(
        `${LOG_PREFIX} Tab ${tabId} content ready.`,
        persistentState
          ? `Persistent state found; counter=${persistentState.counter}.`
          : "No persistent state."
      );

      return {
        ok: true,
        tabId,
        state: persistentState
      };
    }

    case "FOCUS_WINDOW_SET_PERSIST": {
      if (message.enabled === true) {
        const persistentState = await setPersistentState(tabId, {
          counter: message.counter
        });

        console.log(
          `${LOG_PREFIX} Tab ${tabId} Persist ON; counter=${persistentState.counter}.`
        );

        return {
          ok: true,
          tabId,
          state: persistentState
        };
      }

      await clearPersistentState(tabId);

      console.log(
        `${LOG_PREFIX} Tab ${tabId} Persist OFF; tab-owned record removed.`
      );

      return {
        ok: true,
        tabId,
        state: null
      };
    }

    case "FOCUS_WINDOW_SET_COUNTER": {
      const existingState = await getPersistentState(tabId);

      /*
       * A counter update must never recreate persistence after Persist
       * has been turned off. Only an explicit SET_PERSIST enabled=true
       * operation may establish a persistent session.
       */
      if (!existingState) {
        return {
          ok: false,
          tabId,
          error: "Tab does not currently own a persistent session."
        };
      }

      const persistentState = await setPersistentState(tabId, {
        ...existingState,
        counter: message.counter
      });

      console.log(
        `${LOG_PREFIX} Tab ${tabId} persistent counter updated to ${persistentState.counter}.`
      );

      return {
        ok: true,
        tabId,
        state: persistentState
      };
    }

    default:
      return {
        ok: false,
        tabId,
        error: `Unknown message type: ${String(message?.type)}`
      };
  }
}

/*
 * Content-script messages.
 *
 * The promise returned by handleContentMessage becomes the reply delivered
 * to browser.runtime.sendMessage() in content.js.
 */
browser.runtime.onMessage.addListener((message, sender) => {
  return handleContentMessage(message, sender).catch((error) => {
    console.error(`${LOG_PREFIX} Message handling failed.`, error);

    return {
      ok: false,
      error: error instanceof Error ? error.message : String(error)
    };
  });
});

/*
 * Firefox toolbar button.
 *
 * The background layer identifies the target tab from the action event and
 * sends a toggle instruction only to that tab's content script.
 */
browser.action.onClicked.addListener((tab) => {
  if (!Number.isInteger(tab?.id)) {
    return;
  }

  const tabId = tab.id;

  browser.tabs
    .sendMessage(tabId, {
      type: "FOCUS_WINDOW_ACTION_TOGGLE"
    })
    .then((response) => {
      console.log(
        `${LOG_PREFIX} Toolbar toggle delivered to Tab ${tabId}.`,
        response ?? ""
      );
    })
    .catch((error) => {
      /*
       * This is expected on Firefox-protected pages or other documents
       * where the content script is not permitted to run.
       *
       * Failing to reach the page must not destroy tab-owned persistence.
       */
      console.debug(
        `${LOG_PREFIX} Toolbar message could not reach Tab ${tabId}.`,
        error
      );
    });
});

/*
 * Persistent state belongs to the lifetime of the live Firefox tab.
 *
 * When the tab closes, explicitly remove its state so the record cannot
 * later become associated with an unrelated tab.
 */
browser.tabs.onRemoved.addListener((tabId) => {
  clearPersistentState(tabId)
    .then(() => {
      console.log(
        `${LOG_PREFIX} Tab ${tabId} closed; tab-owned persistent state removed.`
      );
    })
    .catch((error) => {
      console.error(
        `${LOG_PREFIX} Failed to clean state for closed Tab ${tabId}.`,
        error
      );
    });
});

console.log(`${LOG_PREFIX} Background state layer initialized.`);