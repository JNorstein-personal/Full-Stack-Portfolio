"use strict";

/*
 * Focus Window Reader Aid 0.4.0
 * Phase 6 — Canonical State Model
 *
 * background.js is the authoritative owner of persistent tab-scoped state.
 *
 * Persistent state is keyed only by Firefox tab ID.
 * It is never keyed by URL, hostname, origin, or document.
 */

const LOG_PREFIX = "[Focus Window 0.4.0]";
const STORAGE_KEY_PREFIX = "focus-window-reader-aid:tab:";
const STATE_SCHEMA_VERSION = 1;

/*
 * The defaults below are the initial canonical-state defaults for Phase 6.
 *
 * They are state defaults only. The production renderer and production
 * interaction limits are introduced in later phases.
 */
const DEFAULT_STATE_TEMPLATE = {
  schemaVersion: STATE_SCHEMA_VERSION,

  active: true,
  persist: false,

  outer: {
    left: 100,
    top: 100,
    width: 900,
    height: 400
  },

  inner: {
    left: 140,
    top: 180,
    width: 820,
    height: 180
  },

  dimming: {
    outer: 0.75,
    ring: 0.35
  },

  filters: {
    brightness: 1.0,
    contrast: 1.0,
    invert: false
  },

  locks: {
    movement: false,
    overlay: false
  }
};

/**
 * Deep-clone state containing only JSON-compatible data.
 *
 * The canonical Focus Window state intentionally consists only of plain
 * serializable values.
 *
 * @param {object} value
 * @returns {object}
 */
function cloneState(value) {
  return JSON.parse(JSON.stringify(value));
}

/**
 * Create a fresh canonical default-state object.
 *
 * @returns {object}
 */
function createDefaultState() {
  return cloneState(DEFAULT_STATE_TEMPLATE);
}

/**
 * Clamp a finite numeric value.
 *
 * @param {*} value
 * @param {number} fallback
 * @param {number} minimum
 * @param {number} maximum
 * @returns {number}
 */
function normalizeNumber(
  value,
  fallback,
  minimum = Number.NEGATIVE_INFINITY,
  maximum = Number.POSITIVE_INFINITY
) {
  const numericValue = Number(value);

  if (!Number.isFinite(numericValue)) {
    return fallback;
  }

  return Math.min(maximum, Math.max(minimum, numericValue));
}

/**
 * Normalize a rectangle without applying document-specific viewport limits.
 *
 * Viewport-specific fitting belongs to the later rendering/geometry phase.
 * Phase 6 guarantees only that geometry is finite and structurally valid.
 *
 * @param {*} candidate
 * @param {object} fallback
 * @returns {{left:number, top:number, width:number, height:number}}
 */
function normalizeOuterRectangle(candidate, fallback) {
  return {
    left: normalizeNumber(candidate?.left, fallback.left, 0),
    top: normalizeNumber(candidate?.top, fallback.top, 0),
    width: normalizeNumber(candidate?.width, fallback.width, 1),
    height: normalizeNumber(candidate?.height, fallback.height, 1)
  };
}

/**
 * Normalize the inner rectangle and guarantee containment within the outer
 * rectangle.
 *
 * Exact production minimum dimensions are deliberately deferred until the
 * geometry interaction phase. Phase 6 guarantees positive dimensions and
 * containment only.
 *
 * @param {*} candidate
 * @param {object} fallback
 * @param {object} outer
 * @returns {{left:number, top:number, width:number, height:number}}
 */
function normalizeInnerRectangle(candidate, fallback, outer) {
  const width = normalizeNumber(
    candidate?.width,
    fallback.width,
    1,
    outer.width
  );

  const height = normalizeNumber(
    candidate?.height,
    fallback.height,
    1,
    outer.height
  );

  const maximumLeft = outer.left + outer.width - width;
  const maximumTop = outer.top + outer.height - height;

  const left = normalizeNumber(
    candidate?.left,
    fallback.left,
    outer.left,
    maximumLeft
  );

  const top = normalizeNumber(
    candidate?.top,
    fallback.top,
    outer.top,
    maximumTop
  );

  return {
    left,
    top,
    width,
    height
  };
}

/**
 * Normalize and validate a complete canonical Focus Window state.
 *
 * This is the only function that constructs authoritative state from
 * untrusted or partially complete candidate state.
 *
 * @param {*} candidate
 * @returns {object}
 */
function normalizeCanonicalState(candidate = {}) {
  const defaults = createDefaultState();

  const outer = normalizeOuterRectangle(
    candidate?.outer,
    defaults.outer
  );

  const inner = normalizeInnerRectangle(
    candidate?.inner,
    defaults.inner,
    outer
  );

  return {
    schemaVersion: STATE_SCHEMA_VERSION,

    active:
      typeof candidate?.active === "boolean"
        ? candidate.active
        : defaults.active,

    persist:
      typeof candidate?.persist === "boolean"
        ? candidate.persist
        : defaults.persist,

    outer,

    inner,

    dimming: {
      outer: normalizeNumber(
        candidate?.dimming?.outer,
        defaults.dimming.outer,
        0,
        1
      ),

      ring: normalizeNumber(
        candidate?.dimming?.ring,
        defaults.dimming.ring,
        0,
        1
      )
    },

    filters: {
      brightness: normalizeNumber(
        candidate?.filters?.brightness,
        defaults.filters.brightness,
        0
      ),

      contrast: normalizeNumber(
        candidate?.filters?.contrast,
        defaults.filters.contrast,
        0
      ),

      invert:
        typeof candidate?.filters?.invert === "boolean"
          ? candidate.filters.invert
          : defaults.filters.invert
    },

    locks: {
      movement:
        typeof candidate?.locks?.movement === "boolean"
          ? candidate.locks.movement
          : defaults.locks.movement,

      overlay:
        typeof candidate?.locks?.overlay === "boolean"
          ? candidate.locks.overlay
          : defaults.locks.overlay
    }
  };
}

/**
 * Compare two canonical states.
 *
 * normalizeCanonicalState() always creates properties in a stable order, so
 * serialized equality is suitable for this Phase 6 development check.
 *
 * @param {object} first
 * @param {object} second
 * @returns {boolean}
 */
function statesEqual(first, second) {
  const normalizedFirst = normalizeCanonicalState(first);
  const normalizedSecond = normalizeCanonicalState(second);

  return (
    JSON.stringify(normalizedFirst) ===
    JSON.stringify(normalizedSecond)
  );
}

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
 * Return the sender's Firefox tab ID.
 *
 * @param {browser.runtime.MessageSender} sender
 * @returns {number|null}
 */
function getSenderTabId(sender) {
  const tabId = sender?.tab?.id;

  return Number.isInteger(tabId) ? tabId : null;
}

/**
 * Retrieve authoritative persistent state for a tab.
 *
 * A stored record is considered a persistent Focus Window session only when
 * its normalized Persist value is true.
 *
 * @param {number} tabId
 * @returns {Promise<object|null>}
 */
async function getPersistentState(tabId) {
  const key = getTabStorageKey(tabId);
  const result = await browser.storage.session.get(key);
  const storedCandidate = result[key];

  if (!storedCandidate) {
    return null;
  }

  const normalized = normalizeCanonicalState(storedCandidate);

  if (!normalized.persist) {
    return null;
  }

  return cloneState(normalized);
}

/**
 * Store authoritative persistent state for a tab.
 *
 * Calling this helper always represents an already-established persistent
 * session, so Persist is forced true.
 *
 * @param {number} tabId
 * @param {object} candidate
 * @returns {Promise<object>}
 */
async function setPersistentState(tabId, candidate) {
  const key = getTabStorageKey(tabId);

  const normalized = normalizeCanonicalState({
    ...candidate,
    persist: true
  });

  await browser.storage.session.set({
    [key]: cloneState(normalized)
  });

  return cloneState(normalized);
}

/**
 * Remove a tab-owned persistent session.
 *
 * @param {number} tabId
 * @returns {Promise<void>}
 */
async function clearPersistentState(tabId) {
  await browser.storage.session.remove(
    getTabStorageKey(tabId)
  );
}

/**
 * Phase 6 development test:
 *
 * Save -> retrieve -> normalize/reconstruct -> compare.
 *
 * The test operates only on a tab that already owns a persistent session.
 *
 * @param {number} tabId
 * @param {object} candidate
 * @returns {Promise<object>}
 */
async function runCanonicalRoundTripTest(tabId, candidate) {
  const existingState = await getPersistentState(tabId);

  if (!existingState) {
    return {
      ok: false,
      passed: false,
      error: "Enable Persist before running the canonical state round-trip test."
    };
  }

  const expected = normalizeCanonicalState({
    ...candidate,
    persist: true
  });

  await setPersistentState(tabId, expected);

  const retrieved = await getPersistentState(tabId);

  const passed =
    retrieved !== null &&
    statesEqual(expected, retrieved);

  return {
    ok: true,
    passed,
    state: retrieved,
    expected: cloneState(expected),
    retrieved: cloneState(retrieved)
  };
}

/**
 * Handle content-script messages.
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
          ? "Persistent canonical state found."
          : "No persistent session."
      );

      return {
        ok: true,
        tabId,
        state: persistentState,
        defaultState: createDefaultState()
      };
    }

    case "FOCUS_WINDOW_SET_PERSIST": {
      if (message.enabled === true) {
        const state = await setPersistentState(
          tabId,
          message.state ?? createDefaultState()
        );

        console.log(
          `${LOG_PREFIX} Tab ${tabId} Persist ON.`
        );

        return {
          ok: true,
          tabId,
          state
        };
      }

      await clearPersistentState(tabId);

      console.log(
        `${LOG_PREFIX} Tab ${tabId} Persist OFF; tab-owned state removed.`
      );

      return {
        ok: true,
        tabId,
        state: null
      };
    }

    case "FOCUS_WINDOW_REPLACE_STATE": {
      /*
       * An ordinary state update may replace an existing persistent session,
       * but it may never create persistence after Persist has been disabled.
       */
      const existingState = await getPersistentState(tabId);

      if (!existingState) {
        return {
          ok: false,
          tabId,
          error: "Tab does not currently own a persistent session."
        };
      }

      const state = await setPersistentState(
        tabId,
        message.state
      );

      return {
        ok: true,
        tabId,
        state
      };
    }

    case "FOCUS_WINDOW_DEV_ROUND_TRIP_STATE": {
      const result = await runCanonicalRoundTripTest(
        tabId,
        message.state
      );

      console.log(
        `${LOG_PREFIX} Tab ${tabId} canonical round trip:`,
        result.passed ? "PASS" : "FAIL"
      );

      return {
        tabId,
        ...result
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
 * Content/background messaging.
 */
browser.runtime.onMessage.addListener((message, sender) => {
  return handleContentMessage(message, sender).catch((error) => {
    console.error(
      `${LOG_PREFIX} Message handling failed.`,
      error
    );

    return {
      ok: false,
      error:
        error instanceof Error
          ? error.message
          : String(error)
    };
  });
});

/*
 * Firefox toolbar toggle.
 *
 * Failure to reach a content script on a protected page does not modify
 * persistent tab state.
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
      console.debug(
        `${LOG_PREFIX} Toolbar message could not reach Tab ${tabId}.`,
        error
      );
    });
});

/*
 * Tab-lifetime cleanup.
 */
browser.tabs.onRemoved.addListener((tabId) => {
  clearPersistentState(tabId)
    .then(() => {
      console.log(
        `${LOG_PREFIX} Tab ${tabId} closed; persistent state removed.`
      );
    })
    .catch((error) => {
      console.error(
        `${LOG_PREFIX} Failed to clean state for closed Tab ${tabId}.`,
        error
      );
    });
});

console.log(
  `${LOG_PREFIX} Canonical-state background layer initialized.`
);