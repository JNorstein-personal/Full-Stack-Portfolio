"use strict";

/*
 * Focus Window Reader Aid 0.4.0
 * Production content renderer and interaction layer.
 */

(() => {
  const LOG_PREFIX = "[Focus Window 0.4.0]";
  const ROOT_ID = "fwra-root";

  const MIN_OUTER_WIDTH = 200;
  const MIN_OUTER_HEIGHT = 120;
  const MIN_INNER_WIDTH = 100;
  const MIN_INNER_HEIGHT = 60;

  const FILTER_MINIMUM = 0;
  const FILTER_MAXIMUM = 2;

  const SELECTORS = {
    root: `#${ROOT_ID}`,

    outerDim: '[data-fwra-role="outer-dim"]',
    ringContainer: '[data-fwra-role="ring-container"]',
    ringHole: '[data-fwra-role="ring-hole"]',
    filterLayer: '[data-fwra-role="filter-layer"]',

    outerFrame: '[data-fwra-role="outer-frame"]',
    innerFrame: '[data-fwra-role="inner-frame"]',

    toolbar: '[data-fwra-role="toolbar"]',

    moveButton: '[data-fwra-action="movement-lock"]',

    outerDimInput: '[data-fwra-control="outer-dim"]',
    outerDimValue: '[data-fwra-value="outer-dim"]',

    ringDimInput: '[data-fwra-control="ring-dim"]',
    ringDimValue: '[data-fwra-value="ring-dim"]',

    brightnessInput: '[data-fwra-control="brightness"]',
    brightnessValue: '[data-fwra-value="brightness"]',

    contrastInput: '[data-fwra-control="contrast"]',
    contrastValue: '[data-fwra-value="contrast"]',

    invertButton: '[data-fwra-action="invert"]',
    closeButton: '[data-fwra-action="close"]',

    filterStatus: '[data-fwra-role="filter-status"]',

    overlayLockButton:
      '[data-fwra-action="overlay-lock"]',

    persistButton:
      '[data-fwra-action="persist"]',

    geometryStatus:
      '[data-fwra-role="geometry-status"]'
  };

  let state = null;

  let visible = false;

  /*
   * Current-document-only suppression.
   *
   * This value is deliberately NOT written to background state.
   * A full navigation creates a new content-script instance, resetting this
   * to false and allowing a valid persistent tab session to render again.
   */
  let renderSuppressed = false;

  let busy = false;

  let interaction = null;

  let viewportResizeTimer = null;

  let persistentWriteQueue =
    Promise.resolve();

  function detectBackdropFilterSupport() {
    try {
      return (
        typeof CSS !== "undefined" &&
        typeof CSS.supports === "function" &&
        (
          CSS.supports(
            "backdrop-filter",
            "brightness(1)"
          ) ||
          CSS.supports(
            "-webkit-backdrop-filter",
            "brightness(1)"
          )
        )
      );
    } catch {
      return false;
    }
  }

  const BACKDROP_FILTER_SUPPORTED =
    detectBackdropFilterSupport();

  function cloneState(value) {
    return JSON.parse(
      JSON.stringify(value)
    );
  }

  function clamp(
    value,
    minimum,
    maximum
  ) {
    return Math.min(
      maximum,
      Math.max(
        minimum,
        value
      )
    );
  }

  function roundGeometryValue(value) {
    return Math.round(value);
  }

  function normalizeDimmingValue(
    value,
    fallback
  ) {
    const numericValue =
      Number(value);

    if (!Number.isFinite(numericValue)) {
      return fallback;
    }

    return clamp(
      Math.round(
        numericValue * 100
      ) / 100,
      0,
      1
    );
  }

  function normalizeFilterValue(
    value,
    fallback
  ) {
    const numericValue =
      Number(value);

    if (!Number.isFinite(numericValue)) {
      return fallback;
    }

    return clamp(
      Math.round(
        numericValue * 100
      ) / 100,
      FILTER_MINIMUM,
      FILTER_MAXIMUM
    );
  }

  function px(value) {
    return `${value}px`;
  }

  function percent(value) {
    return `${Math.round(
      value * 100
    )}%`;
  }

  function filterPercent(value) {
    return `${Math.round(
      value * 100
    )}%`;
  }

  function getViewportBounds() {
    const width =
      Math.max(
        1,
        document.documentElement.clientWidth ||
          window.innerWidth ||
          1
      );

    const height =
      Math.max(
        1,
        document.documentElement.clientHeight ||
          window.innerHeight ||
          1
      );

    return {
      left: 0,
      top: 0,
      right: width,
      bottom: height,
      width,
      height
    };
  }

  function normalizeOuterRect(rect) {
    const viewport =
      getViewportBounds();

    const minimumWidth =
      Math.min(
        MIN_OUTER_WIDTH,
        viewport.width
      );

    const minimumHeight =
      Math.min(
        MIN_OUTER_HEIGHT,
        viewport.height
      );

    const width =
      clamp(
        Number(rect?.width) ||
          minimumWidth,
        minimumWidth,
        viewport.width
      );

    const height =
      clamp(
        Number(rect?.height) ||
          minimumHeight,
        minimumHeight,
        viewport.height
      );

    const left =
      clamp(
        Number(rect?.left) || 0,
        viewport.left,
        viewport.right - width
      );

    const top =
      clamp(
        Number(rect?.top) || 0,
        viewport.top,
        viewport.bottom - height
      );

    return {
      left:
        roundGeometryValue(left),

      top:
        roundGeometryValue(top),

      width:
        roundGeometryValue(width),

      height:
        roundGeometryValue(height)
    };
  }

  function normalizeInnerRect(
    rect,
    outer
  ) {
    const minimumWidth =
      Math.min(
        MIN_INNER_WIDTH,
        outer.width
      );

    const minimumHeight =
      Math.min(
        MIN_INNER_HEIGHT,
        outer.height
      );

    const width =
      clamp(
        Number(rect?.width) ||
          minimumWidth,
        minimumWidth,
        outer.width
      );

    const height =
      clamp(
        Number(rect?.height) ||
          minimumHeight,
        minimumHeight,
        outer.height
      );

    const left =
      clamp(
        Number(rect?.left) ||
          outer.left,
        outer.left,
        outer.left +
          outer.width -
          width
      );

    const top =
      clamp(
        Number(rect?.top) ||
          outer.top,
        outer.top,
        outer.top +
          outer.height -
          height
      );

    return {
      left:
        roundGeometryValue(left),

      top:
        roundGeometryValue(top),

      width:
        roundGeometryValue(width),

      height:
        roundGeometryValue(height)
    };
  }

  function normalizeStateGeometry(
    candidateState
  ) {
    const normalized =
      cloneState(candidateState);

    normalized.outer =
      normalizeOuterRect(
        normalized.outer
      );

    normalized.inner =
      normalizeInnerRect(
        normalized.inner,
        normalized.outer
      );

    return normalized;
  }

  function geometrySignature(
    candidateState
  ) {
    return JSON.stringify({
      outer:
        candidateState.outer,

      inner:
        candidateState.inner
    });
  }

  function getRoot() {
    return document.getElementById(
      ROOT_ID
    );
  }

  function ensureRoot() {
    const existingRoot =
      getRoot();

    if (existingRoot) {
      return existingRoot;
    }

    const root =
      document.createElement("div");

    root.id =
      ROOT_ID;

    root.setAttribute(
      "data-fwra-extension-root",
      "true"
    );

    root.setAttribute(
      "aria-label",
      "Focus Window Reader Aid"
    );

    root.innerHTML = `
      <div
        class="fwra-outer-dim"
        data-fwra-role="outer-dim"
        aria-hidden="true"
      ></div>

      <div
        class="fwra-ring-container"
        data-fwra-role="ring-container"
        aria-hidden="true"
      >
        <div
          class="fwra-ring-hole"
          data-fwra-role="ring-hole"
        ></div>
      </div>

      <div
        class="fwra-filter-layer"
        data-fwra-role="filter-layer"
        aria-hidden="true"
      ></div>

      <div
        class="fwra-frame fwra-outer-frame"
        data-fwra-role="outer-frame"
        aria-label="Outer focus frame"
      >
        <button
          type="button"
          class="fwra-drag-grip fwra-drag-grip--outer"
          data-fwra-drag-frame="outer"
          aria-label="Move outer focus frame"
          title="Drag to move outer frame"
        ></button>

        <button
          type="button"
          class="fwra-resize-handle fwra-resize-handle--nw"
          data-fwra-resize-frame="outer"
          data-fwra-corner="nw"
          aria-label="Resize outer frame from top left"
          title="Drag to resize outer frame; hold Ctrl to resize inner frame"
        ></button>

        <button
          type="button"
          class="fwra-resize-handle fwra-resize-handle--ne"
          data-fwra-resize-frame="outer"
          data-fwra-corner="ne"
          aria-label="Resize outer frame from top right"
          title="Drag to resize outer frame; hold Ctrl to resize inner frame"
        ></button>

        <button
          type="button"
          class="fwra-resize-handle fwra-resize-handle--sw"
          data-fwra-resize-frame="outer"
          data-fwra-corner="sw"
          aria-label="Resize outer frame from bottom left"
          title="Drag to resize outer frame; hold Ctrl to resize inner frame"
        ></button>

        <button
          type="button"
          class="fwra-resize-handle fwra-resize-handle--se"
          data-fwra-resize-frame="outer"
          data-fwra-corner="se"
          aria-label="Resize outer frame from bottom right"
          title="Drag to resize outer frame; hold Ctrl to resize inner frame"
        ></button>
      </div>

      <div
        class="fwra-frame fwra-inner-frame"
        data-fwra-role="inner-frame"
        aria-label="Inner reading window"
      >
        <button
          type="button"
          class="fwra-drag-grip fwra-drag-grip--inner"
          data-fwra-drag-frame="inner"
          aria-label="Move inner reading window"
          title="Drag to move inner window"
        ></button>

        <button
          type="button"
          class="fwra-resize-handle fwra-resize-handle--nw"
          data-fwra-resize-frame="inner"
          data-fwra-corner="nw"
          aria-label="Resize inner window from top left"
          title="Drag to resize inner window; hold Ctrl to resize outer frame"
        ></button>

        <button
          type="button"
          class="fwra-resize-handle fwra-resize-handle--ne"
          data-fwra-resize-frame="inner"
          data-fwra-corner="ne"
          aria-label="Resize inner window from top right"
          title="Drag to resize inner window; hold Ctrl to resize outer frame"
        ></button>

        <button
          type="button"
          class="fwra-resize-handle fwra-resize-handle--sw"
          data-fwra-resize-frame="inner"
          data-fwra-corner="sw"
          aria-label="Resize inner window from bottom left"
          title="Drag to resize inner window; hold Ctrl to resize outer frame"
        ></button>

        <button
          type="button"
          class="fwra-resize-handle fwra-resize-handle--se"
          data-fwra-resize-frame="inner"
          data-fwra-corner="se"
          aria-label="Resize inner window from bottom right"
          title="Drag to resize inner window; hold Ctrl to resize outer frame"
        ></button>
      </div>

      <section
        class="fwra-toolbar"
        data-fwra-role="toolbar"
        aria-label="Focus Window settings"
      >
        <div class="fwra-toolbar__title">
          Focus Window
        </div>

        <button
          type="button"
          class="fwra-control-button"
          data-fwra-action="movement-lock"
          aria-pressed="false"
        >
          Move: Free
        </button>

        <label class="fwra-control-group">
          <span class="fwra-control-group__label">
            Outer dim
          </span>

          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            data-fwra-control="outer-dim"
          >

          <output data-fwra-value="outer-dim">
            —
          </output>
        </label>

        <label class="fwra-control-group">
          <span class="fwra-control-group__label">
            Ring dim
          </span>

          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            data-fwra-control="ring-dim"
          >

          <output data-fwra-value="ring-dim">
            —
          </output>
        </label>

        <label class="fwra-control-group">
          <span class="fwra-control-group__label">
            Brightness
          </span>

          <input
            type="range"
            min="0"
            max="2"
            step="0.05"
            data-fwra-control="brightness"
          >

          <output data-fwra-value="brightness">
            —
          </output>
        </label>

        <label class="fwra-control-group">
          <span class="fwra-control-group__label">
            Contrast
          </span>

          <input
            type="range"
            min="0"
            max="2"
            step="0.05"
            data-fwra-control="contrast"
          >

          <output data-fwra-value="contrast">
            —
          </output>
        </label>

        <button
          type="button"
          class="fwra-control-button"
          data-fwra-action="invert"
          aria-pressed="false"
        >
          Invert: Off
        </button>

        <button
          type="button"
          class="fwra-control-button"
          data-fwra-action="close"
        >
          Close
        </button>

        <div class="fwra-toolbar__instructions">
          Close, Escape, or the Firefox toolbar button can suppress
          Focus Window for the current document without ending a
          persistent tab session.
        </div>

        <div
          class="fwra-geometry-status"
          data-fwra-role="filter-status"
        ></div>

        <div
          class="fwra-geometry-status"
          data-fwra-role="geometry-status"
        ></div>
      </section>

      <div
        class="fwra-upper-controls"
        data-fwra-role="upper-controls"
        aria-label="Focus Window session controls"
      >
        <button
          type="button"
          class="fwra-control-button"
          data-fwra-action="overlay-lock"
          aria-pressed="false"
        >
          Overlay: Unlocked
        </button>

        <button
          type="button"
          class="fwra-control-button"
          data-fwra-action="persist"
          aria-pressed="false"
        >
          Persist: Off
        </button>
      </div>
    `;

    root.addEventListener(
      "click",
      handleRootClick
    );

    root.addEventListener(
      "pointerdown",
      handleRootPointerDown
    );

    root.addEventListener(
      "input",
      handleRootInput
    );

    root.addEventListener(
      "change",
      handleRootChange
    );

    document.documentElement.appendChild(
      root
    );

    return root;
  }

  function destroyFocusWindow() {
    const root =
      getRoot();

    /*
     * Ensure temporary pointer listeners are removed even if the root has
     * already disappeared.
     */
    cancelGeometryInteraction();

    if (!root) {
      return;
    }

    root.removeEventListener(
      "click",
      handleRootClick
    );

    root.removeEventListener(
      "pointerdown",
      handleRootPointerDown
    );

    root.removeEventListener(
      "input",
      handleRootInput
    );

    root.removeEventListener(
      "change",
      handleRootChange
    );

    root.remove();
  }

  function renderGeometry(
    root,
    canonicalState
  ) {
    const {
      outer,
      inner
    } = canonicalState;

    const outerDim =
      root.querySelector(
        SELECTORS.outerDim
      );

    const ringContainer =
      root.querySelector(
        SELECTORS.ringContainer
      );

    const ringHole =
      root.querySelector(
        SELECTORS.ringHole
      );

    const filterLayer =
      root.querySelector(
        SELECTORS.filterLayer
      );

    const outerFrame =
      root.querySelector(
        SELECTORS.outerFrame
      );

    const innerFrame =
      root.querySelector(
        SELECTORS.innerFrame
      );

    for (
      const element of [
        outerDim,
        ringContainer,
        outerFrame
      ]
    ) {
      element.style.left =
        px(outer.left);

      element.style.top =
        px(outer.top);

      element.style.width =
        px(outer.width);

      element.style.height =
        px(outer.height);
    }

    for (
      const element of [
        filterLayer,
        innerFrame
      ]
    ) {
      element.style.left =
        px(inner.left);

      element.style.top =
        px(inner.top);

      element.style.width =
        px(inner.width);

      element.style.height =
        px(inner.height);
    }

    ringHole.style.left =
      px(
        inner.left -
          outer.left
      );

    ringHole.style.top =
      px(
        inner.top -
          outer.top
      );

    ringHole.style.width =
      px(inner.width);

    ringHole.style.height =
      px(inner.height);
  }

  function renderDimming(
    root,
    canonicalState
  ) {
    const outerDim =
      root.querySelector(
        SELECTORS.outerDim
      );

    const ringHole =
      root.querySelector(
        SELECTORS.ringHole
      );

    outerDim.style.boxShadow =
      `0 0 0 100vmax rgba(0, 0, 0, ${canonicalState.dimming.outer})`;

    ringHole.style.boxShadow =
      `0 0 0 100vmax rgba(0, 0, 0, ${canonicalState.dimming.ring})`;
  }

  function renderFilters(
    root,
    canonicalState
  ) {
    const filterLayer =
      root.querySelector(
        SELECTORS.filterLayer
      );

    if (!BACKDROP_FILTER_SUPPORTED) {
      filterLayer.style.backdropFilter =
        "";

      filterLayer.style.webkitBackdropFilter =
        "";

      return;
    }

    const brightness =
      normalizeFilterValue(
        canonicalState.filters.brightness,
        1
      );

    const contrast =
      normalizeFilterValue(
        canonicalState.filters.contrast,
        1
      );

    const invert =
      canonicalState.filters.invert ===
      true;

    const filterValue =
      `brightness(${brightness}) ` +
      `contrast(${contrast}) ` +
      `invert(${invert ? 1 : 0})`;

    filterLayer.style.backdropFilter =
      filterValue;

    filterLayer.style.webkitBackdropFilter =
      filterValue;
  }

  function renderControls(
    root,
    canonicalState
  ) {
    const toolbar =
      root.querySelector(
        SELECTORS.toolbar
      );

    const moveButton =
      root.querySelector(
        SELECTORS.moveButton
      );

    const outerDimInput =
      root.querySelector(
        SELECTORS.outerDimInput
      );

    const outerDimValue =
      root.querySelector(
        SELECTORS.outerDimValue
      );

    const ringDimInput =
      root.querySelector(
        SELECTORS.ringDimInput
      );

    const ringDimValue =
      root.querySelector(
        SELECTORS.ringDimValue
      );

    const brightnessInput =
      root.querySelector(
        SELECTORS.brightnessInput
      );

    const brightnessValue =
      root.querySelector(
        SELECTORS.brightnessValue
      );

    const contrastInput =
      root.querySelector(
        SELECTORS.contrastInput
      );

    const contrastValue =
      root.querySelector(
        SELECTORS.contrastValue
      );

    const invertButton =
      root.querySelector(
        SELECTORS.invertButton
      );

    const closeButton =
      root.querySelector(
        SELECTORS.closeButton
      );

    const filterStatusElement =
      root.querySelector(
        SELECTORS.filterStatus
      );

    const overlayLockButton =
      root.querySelector(
        SELECTORS.overlayLockButton
      );

    const persistButton =
      root.querySelector(
        SELECTORS.persistButton
      );

    const geometryStatusElement =
      root.querySelector(
        SELECTORS.geometryStatus
      );

    const movementLocked =
      canonicalState.locks.movement ===
      true;

    const overlayLocked =
      canonicalState.locks.overlay ===
      true;

    const toolbarControlsDisabled =
      busy ||
      interaction !== null ||
      overlayLocked;

    moveButton.textContent =
      movementLocked
        ? "Move: Locked"
        : "Move: Free";

    moveButton.setAttribute(
      "aria-pressed",
      movementLocked
        ? "true"
        : "false"
    );

    moveButton.disabled =
      toolbarControlsDisabled;

    outerDimInput.value =
      String(
        canonicalState.dimming.outer
      );

    outerDimValue.value =
      percent(
        canonicalState.dimming.outer
      );

    ringDimInput.value =
      String(
        canonicalState.dimming.ring
      );

    ringDimValue.value =
      percent(
        canonicalState.dimming.ring
      );

    outerDimInput.disabled =
      toolbarControlsDisabled;

    ringDimInput.disabled =
      toolbarControlsDisabled;

    const brightness =
      normalizeFilterValue(
        canonicalState.filters.brightness,
        1
      );

    const contrast =
      normalizeFilterValue(
        canonicalState.filters.contrast,
        1
      );

    brightnessInput.value =
      String(brightness);

    brightnessValue.value =
      filterPercent(
        brightness
      );

    contrastInput.value =
      String(contrast);

    contrastValue.value =
      filterPercent(
        contrast
      );

    const filterControlsDisabled =
      toolbarControlsDisabled ||
      !BACKDROP_FILTER_SUPPORTED;

    brightnessInput.disabled =
      filterControlsDisabled;

    contrastInput.disabled =
      filterControlsDisabled;

    invertButton.disabled =
      filterControlsDisabled;

    invertButton.textContent =
      canonicalState.filters.invert
        ? "Invert: On"
        : "Invert: Off";

    invertButton.setAttribute(
      "aria-pressed",
      canonicalState.filters.invert
        ? "true"
        : "false"
    );

    /*
     * Close is available whenever the ordinary toolbar itself is available.
     * Overlay Lock hides the toolbar, so Escape remains the suppression path
     * while Overlay Lock is active.
     */
    closeButton.disabled =
      busy ||
      interaction !== null ||
      overlayLocked;

    if (BACKDROP_FILTER_SUPPORTED) {
      filterStatusElement.textContent =
        `Filters available · Brightness ${filterPercent(brightness)} · ` +
        `Contrast ${filterPercent(contrast)} · ` +
        `Invert ${canonicalState.filters.invert ? "On" : "Off"}`;
    } else {
      filterStatusElement.textContent =
        "Visual filters unavailable in this browser; core Focus Window functionality remains active.";
    }

    overlayLockButton.textContent =
      overlayLocked
        ? "Overlay: Locked"
        : "Overlay: Unlocked";

    overlayLockButton.setAttribute(
      "aria-pressed",
      overlayLocked
        ? "true"
        : "false"
    );

    overlayLockButton.disabled =
      busy ||
      interaction !== null;

    persistButton.textContent =
      canonicalState.persist
        ? "Persist: On"
        : "Persist: Off";

    persistButton.setAttribute(
      "aria-pressed",
      canonicalState.persist
        ? "true"
        : "false"
    );

    persistButton.disabled =
      busy ||
      interaction !== null;

    geometryStatusElement.textContent =
      `Outer ${canonicalState.outer.left},${canonicalState.outer.top} · ` +
      `${canonicalState.outer.width}×${canonicalState.outer.height} | ` +
      `Inner ${canonicalState.inner.left},${canonicalState.inner.top} · ` +
      `${canonicalState.inner.width}×${canonicalState.inner.height}`;

    toolbar.setAttribute(
      "aria-hidden",
      overlayLocked
        ? "true"
        : "false"
    );

    root.dataset.fwraPersist =
      canonicalState.persist
        ? "on"
        : "off";

    root.dataset.fwraInteracting =
      interaction
        ? "true"
        : "false";

    root.dataset.fwraFilterSupport =
      BACKDROP_FILTER_SUPPORTED
        ? "supported"
        : "unsupported";

    root.dataset.fwraMovementLocked =
      movementLocked
        ? "true"
        : "false";

    root.dataset.fwraOverlayLocked =
      overlayLocked
        ? "true"
        : "false";
  }

  function renderFocusWindow(
    canonicalState
  ) {
    if (
      !visible ||
      renderSuppressed
    ) {
      destroyFocusWindow();
      return;
    }

    if (!canonicalState) {
      return;
    }

    const root =
      ensureRoot();

    renderGeometry(
      root,
      canonicalState
    );

    renderDimming(
      root,
      canonicalState
    );

    renderFilters(
      root,
      canonicalState
    );

    renderControls(
      root,
      canonicalState
    );
  }

  function updateFocusWindow(
    canonicalState
  ) {
    renderFocusWindow(
      canonicalState
    );
  }

  function queuePersistentStateWrite(
    snapshot,
    reason
  ) {
    if (!snapshot.persist) {
      return;
    }

    const payload =
      cloneState(snapshot);

    persistentWriteQueue =
      persistentWriteQueue
        .catch(() => {
          /*
           * Preserve queue usability after a failed earlier write.
           */
        })
        .then(async () => {
          const response =
            await browser.runtime.sendMessage({
              type:
                "FOCUS_WINDOW_REPLACE_STATE",

              state:
                payload
            });

          if (!response?.ok) {
            throw new Error(
              response?.error ??
                "Persistent state update was rejected."
            );
          }
        })
        .catch((error) => {
          console.error(
            `${LOG_PREFIX} Persistent state update failed (${reason}).`,
            error
          );
        });
  }

  function handleRootInput(event) {
    if (
      !state ||
      busy ||
      interaction ||
      state.locks.overlay
    ) {
      return;
    }

    const target =
      event.target instanceof HTMLInputElement
        ? event.target
        : null;

    if (!target) {
      return;
    }

    const control =
      target.getAttribute(
        "data-fwra-control"
      );

    switch (control) {
      case "outer-dim":
        state.dimming.outer =
          normalizeDimmingValue(
            target.value,
            state.dimming.outer
          );
        break;

      case "ring-dim":
        state.dimming.ring =
          normalizeDimmingValue(
            target.value,
            state.dimming.ring
          );
        break;

      case "brightness":
        if (!BACKDROP_FILTER_SUPPORTED) {
          return;
        }

        state.filters.brightness =
          normalizeFilterValue(
            target.value,
            state.filters.brightness
          );
        break;

      case "contrast":
        if (!BACKDROP_FILTER_SUPPORTED) {
          return;
        }

        state.filters.contrast =
          normalizeFilterValue(
            target.value,
            state.filters.contrast
          );
        break;

      default:
        return;
    }

    renderFocusWindow(state);
  }

  function handleRootChange(event) {
    if (
      !state ||
      busy ||
      interaction ||
      state.locks.overlay
    ) {
      return;
    }

    const target =
      event.target instanceof HTMLInputElement
        ? event.target
        : null;

    if (!target) {
      return;
    }

    const control =
      target.getAttribute(
        "data-fwra-control"
      );

    let persistenceReason =
      null;

    switch (control) {
      case "outer-dim":
        state.dimming.outer =
          normalizeDimmingValue(
            target.value,
            state.dimming.outer
          );

        persistenceReason =
          "outer-dim";
        break;

      case "ring-dim":
        state.dimming.ring =
          normalizeDimmingValue(
            target.value,
            state.dimming.ring
          );

        persistenceReason =
          "ring-dim";
        break;

      case "brightness":
        if (!BACKDROP_FILTER_SUPPORTED) {
          return;
        }

        state.filters.brightness =
          normalizeFilterValue(
            target.value,
            state.filters.brightness
          );

        persistenceReason =
          "brightness";
        break;

      case "contrast":
        if (!BACKDROP_FILTER_SUPPORTED) {
          return;
        }

        state.filters.contrast =
          normalizeFilterValue(
            target.value,
            state.filters.contrast
          );

        persistenceReason =
          "contrast";
        break;

      default:
        return;
    }

    renderFocusWindow(state);

    if (
      persistenceReason &&
      state.persist
    ) {
      queuePersistentStateWrite(
        state,
        persistenceReason
      );
    }
  }

  function toggleInvert() {
    if (
      !state ||
      busy ||
      interaction ||
      state.locks.overlay ||
      !BACKDROP_FILTER_SUPPORTED
    ) {
      return;
    }

    state.filters.invert =
      !state.filters.invert;

    renderFocusWindow(state);

    if (state.persist) {
      queuePersistentStateWrite(
        state,
        "invert"
      );
    }
  }

  function toggleMovementLock() {
    if (
      !state ||
      busy ||
      interaction ||
      state.locks.overlay
    ) {
      return;
    }

    state.locks.movement =
      !state.locks.movement;

    renderFocusWindow(state);

    if (state.persist) {
      queuePersistentStateWrite(
        state,
        "movement-lock"
      );
    }
  }

  function toggleOverlayLock() {
    if (
      !state ||
      busy ||
      interaction
    ) {
      return;
    }

    state.locks.overlay =
      !state.locks.overlay;

    renderFocusWindow(state);

    if (state.persist) {
      queuePersistentStateWrite(
        state,
        "overlay-lock"
      );
    }
  }

  /*
   * Suppression affects this document only.
   *
   * It must never be sent to background.js or written to browser storage.
   */
  function suppressCurrentDocument() {
    if (
      !state ||
      renderSuppressed
    ) {
      return;
    }

    renderSuppressed =
      true;

    visible =
      false;

    cancelGeometryInteraction();

    destroyFocusWindow();
  }

  /*
   * Firefox's toolbar button is a true toggle.
   *
   * Therefore a second toolbar click on the same suppressed document may
   * explicitly render it again without altering persistent ownership.
   */
  function showCurrentDocument() {
    if (!state) {
      return;
    }

    renderSuppressed =
      false;

    visible =
      true;

    renderFocusWindow(state);
  }

  function handleDocumentKeyDown(
    event
  ) {
    if (
      event.key !== "Escape"
    ) {
      return;
    }

    if (
      !visible ||
      renderSuppressed ||
      !getRoot()
    ) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();

    suppressCurrentDocument();
  }

  function alternateFrame(
    frameName
  ) {
    return frameName === "outer"
      ? "inner"
      : "outer";
  }

  function beginDrag(
    frameName,
    event,
    captureElement
  ) {
    if (
      !state ||
      !visible ||
      renderSuppressed ||
      busy ||
      interaction ||
      state.locks.overlay ||
      state.locks.movement
    ) {
      return;
    }

    interaction = {
      kind: "drag",

      frame:
        frameName,

      pointerId:
        event.pointerId,

      startX:
        event.clientX,

      startY:
        event.clientY,

      startState:
        cloneState(state),

      moved:
        false,

      captureElement
    };

    captureElement.setPointerCapture?.(
      event.pointerId
    );

    window.addEventListener(
      "pointermove",
      handleGeometryPointerMove,
      true
    );

    window.addEventListener(
      "pointerup",
      finishGeometryInteraction,
      true
    );

    window.addEventListener(
      "pointercancel",
      finishGeometryInteraction,
      true
    );

    renderFocusWindow(state);
  }

  function beginResize(
    requestedFrame,
    corner,
    event,
    captureElement
  ) {
    if (
      !state ||
      !visible ||
      renderSuppressed ||
      busy ||
      interaction ||
      state.locks.overlay
    ) {
      return;
    }

    const targetFrame =
      event.ctrlKey
        ? alternateFrame(
            requestedFrame
          )
        : requestedFrame;

    interaction = {
      kind: "resize",

      requestedFrame,
      targetFrame,
      corner,

      pointerId:
        event.pointerId,

      startX:
        event.clientX,

      startY:
        event.clientY,

      startState:
        cloneState(state),

      moved:
        false,

      captureElement
    };

    captureElement.setPointerCapture?.(
      event.pointerId
    );

    window.addEventListener(
      "pointermove",
      handleGeometryPointerMove,
      true
    );

    window.addEventListener(
      "pointerup",
      finishGeometryInteraction,
      true
    );

    window.addEventListener(
      "pointercancel",
      finishGeometryInteraction,
      true
    );

    renderFocusWindow(state);
  }

  function resizeRectByCorner(
    startRect,
    corner,
    dx,
    dy,
    bounds,
    minimumWidth,
    minimumHeight
  ) {
    const startRight =
      startRect.left +
      startRect.width;

    const startBottom =
      startRect.top +
      startRect.height;

    let left =
      startRect.left;

    let top =
      startRect.top;

    let right =
      startRight;

    let bottom =
      startBottom;

    if (
      corner.includes("w")
    ) {
      left =
        clamp(
          startRect.left + dx,
          bounds.left,
          startRight -
            minimumWidth
        );
    }

    if (
      corner.includes("e")
    ) {
      right =
        clamp(
          startRight + dx,
          startRect.left +
            minimumWidth,
          bounds.right
        );
    }

    if (
      corner.includes("n")
    ) {
      top =
        clamp(
          startRect.top + dy,
          bounds.top,
          startBottom -
            minimumHeight
        );
    }

    if (
      corner.includes("s")
    ) {
      bottom =
        clamp(
          startBottom + dy,
          startRect.top +
            minimumHeight,
          bounds.bottom
        );
    }

    return {
      left:
        roundGeometryValue(left),

      top:
        roundGeometryValue(top),

      width:
        roundGeometryValue(
          right - left
        ),

      height:
        roundGeometryValue(
          bottom - top
        )
    };
  }

  function applyDrag(
    interactionState,
    dx,
    dy
  ) {
    const nextState =
      cloneState(
        interactionState.startState
      );

    if (
      interactionState.frame ===
      "outer"
    ) {
      const viewport =
        getViewportBounds();

      const outer =
        interactionState
          .startState
          .outer;

      const nextLeft =
        clamp(
          outer.left + dx,
          viewport.left,
          viewport.right -
            outer.width
        );

      const nextTop =
        clamp(
          outer.top + dy,
          viewport.top,
          viewport.bottom -
            outer.height
        );

      const appliedDx =
        nextLeft -
        outer.left;

      const appliedDy =
        nextTop -
        outer.top;

      nextState.outer.left =
        roundGeometryValue(
          nextLeft
        );

      nextState.outer.top =
        roundGeometryValue(
          nextTop
        );

      nextState.inner.left =
        roundGeometryValue(
          interactionState
            .startState
            .inner
            .left +
            appliedDx
        );

      nextState.inner.top =
        roundGeometryValue(
          interactionState
            .startState
            .inner
            .top +
            appliedDy
        );
    } else {
      const inner =
        interactionState
          .startState
          .inner;

      const outer =
        interactionState
          .startState
          .outer;

      nextState.inner.left =
        roundGeometryValue(
          clamp(
            inner.left + dx,
            outer.left,
            outer.left +
              outer.width -
              inner.width
          )
        );

      nextState.inner.top =
        roundGeometryValue(
          clamp(
            inner.top + dy,
            outer.top,
            outer.top +
              outer.height -
              inner.height
          )
        );
    }

    return normalizeStateGeometry(
      nextState
    );
  }

  function applyResize(
    interactionState,
    dx,
    dy
  ) {
    const nextState =
      cloneState(
        interactionState.startState
      );

    if (
      interactionState.targetFrame ===
      "outer"
    ) {
      const viewport =
        getViewportBounds();

      const minimumWidth =
        Math.min(
          MIN_OUTER_WIDTH,
          viewport.width
        );

      const minimumHeight =
        Math.min(
          MIN_OUTER_HEIGHT,
          viewport.height
        );

      nextState.outer =
        resizeRectByCorner(
          interactionState
            .startState
            .outer,

          interactionState.corner,

          dx,
          dy,

          viewport,

          minimumWidth,
          minimumHeight
        );

      nextState.inner =
        normalizeInnerRect(
          interactionState
            .startState
            .inner,
          nextState.outer
        );
    } else {
      const outer =
        interactionState
          .startState
          .outer;

      const bounds = {
        left:
          outer.left,

        top:
          outer.top,

        right:
          outer.left +
          outer.width,

        bottom:
          outer.top +
          outer.height
      };

      const minimumWidth =
        Math.min(
          MIN_INNER_WIDTH,
          outer.width
        );

      const minimumHeight =
        Math.min(
          MIN_INNER_HEIGHT,
          outer.height
        );

      nextState.inner =
        resizeRectByCorner(
          interactionState
            .startState
            .inner,

          interactionState.corner,

          dx,
          dy,

          bounds,

          minimumWidth,
          minimumHeight
        );
    }

    return normalizeStateGeometry(
      nextState
    );
  }

  function handleGeometryPointerMove(
    event
  ) {
    if (
      !interaction ||
      event.pointerId !==
        interaction.pointerId
    ) {
      return;
    }

    if (
      !state ||
      renderSuppressed ||
      state.locks.overlay ||
      (
        interaction.kind ===
          "drag" &&
        state.locks.movement
      )
    ) {
      cancelGeometryInteraction();
      return;
    }

    event.preventDefault();

    const dx =
      event.clientX -
      interaction.startX;

    const dy =
      event.clientY -
      interaction.startY;

    const before =
      geometrySignature(state);

    state =
      interaction.kind ===
        "drag"
        ? applyDrag(
            interaction,
            dx,
            dy
          )
        : applyResize(
            interaction,
            dx,
            dy
          );

    interaction.moved =
      interaction.moved ||
      before !==
        geometrySignature(state);

    updateFocusWindow(state);
  }

  function cancelGeometryInteraction() {
    if (!interaction) {
      return;
    }

    const cancelledInteraction =
      interaction;

    interaction =
      null;

    window.removeEventListener(
      "pointermove",
      handleGeometryPointerMove,
      true
    );

    window.removeEventListener(
      "pointerup",
      finishGeometryInteraction,
      true
    );

    window.removeEventListener(
      "pointercancel",
      finishGeometryInteraction,
      true
    );

    try {
      cancelledInteraction
        .captureElement
        ?.releasePointerCapture?.(
          cancelledInteraction.pointerId
        );
    } catch {
      /*
       * Capture may already have been released.
       */
    }
  }

  function finishGeometryInteraction(
    event
  ) {
    if (
      !interaction ||
      event.pointerId !==
        interaction.pointerId
    ) {
      return;
    }

    event.preventDefault();

    const completedInteraction =
      interaction;

    interaction =
      null;

    window.removeEventListener(
      "pointermove",
      handleGeometryPointerMove,
      true
    );

    window.removeEventListener(
      "pointerup",
      finishGeometryInteraction,
      true
    );

    window.removeEventListener(
      "pointercancel",
      finishGeometryInteraction,
      true
    );

    try {
      completedInteraction
        .captureElement
        ?.releasePointerCapture?.(
          event.pointerId
        );
    } catch {
      /*
       * Capture may already have been released.
       */
    }

    state =
      normalizeStateGeometry(
        state
      );

    renderFocusWindow(state);

    if (
      completedInteraction.moved &&
      state.persist
    ) {
      const target =
        completedInteraction.kind ===
          "resize"
          ? completedInteraction
              .targetFrame
          : completedInteraction
              .frame;

      queuePersistentStateWrite(
        state,
        `${completedInteraction.kind}:${target}`
      );
    }
  }

  function handleRootPointerDown(
    event
  ) {
    if (
      event.button !== 0 ||
      !state ||
      renderSuppressed ||
      state.locks.overlay
    ) {
      return;
    }

    const target =
      event.target instanceof Element
        ? event.target
        : null;

    if (!target) {
      return;
    }

    const resizeTarget =
      target.closest(
        "[data-fwra-resize-frame][data-fwra-corner]"
      );

    if (resizeTarget) {
      event.preventDefault();
      event.stopPropagation();

      beginResize(
        resizeTarget.getAttribute(
          "data-fwra-resize-frame"
        ),

        resizeTarget.getAttribute(
          "data-fwra-corner"
        ),

        event,
        resizeTarget
      );

      return;
    }

    const dragTarget =
      target.closest(
        "[data-fwra-drag-frame]"
      );

    if (!dragTarget) {
      return;
    }

    if (state.locks.movement) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }

    event.preventDefault();
    event.stopPropagation();

    beginDrag(
      dragTarget.getAttribute(
        "data-fwra-drag-frame"
      ),

      event,
      dragTarget
    );
  }

  async function togglePersist() {
    if (
      busy ||
      interaction ||
      !state
    ) {
      return;
    }

    busy =
      true;

    renderFocusWindow(state);

    try {
      if (!state.persist) {
        const candidate =
          normalizeStateGeometry(
            cloneState(state)
          );

        candidate.persist =
          true;

        const response =
          await browser.runtime.sendMessage({
            type:
              "FOCUS_WINDOW_SET_PERSIST",

            enabled:
              true,

            state:
              candidate
          });

        if (
          !response?.ok ||
          !response.state
        ) {
          throw new Error(
            response?.error ??
              "Could not establish persistent tab state."
          );
        }

        state =
          normalizeStateGeometry(
            response.state
          );
      } else {
        const response =
          await browser.runtime.sendMessage({
            type:
              "FOCUS_WINDOW_SET_PERSIST",

            enabled:
              false
          });

        if (!response?.ok) {
          throw new Error(
            response?.error ??
              "Could not disable persistent tab state."
          );
        }

        state = {
          ...state,
          persist: false
        };
      }
    } catch (error) {
      console.error(
        `${LOG_PREFIX} Persist toggle failed.`,
        error
      );
    } finally {
      busy =
        false;

      renderFocusWindow(state);
    }
  }

  function handleRootClick(event) {
    const target =
      event.target instanceof Element
        ? event.target.closest(
            "[data-fwra-action]"
          )
        : null;

    if (!target) {
      return;
    }

    const action =
      target.getAttribute(
        "data-fwra-action"
      );

    if (
      state?.locks?.overlay &&
      action !== "overlay-lock" &&
      action !== "persist"
    ) {
      return;
    }

    switch (action) {
      case "persist":
        void togglePersist();
        break;

      case "movement-lock":
        toggleMovementLock();
        break;

      case "overlay-lock":
        toggleOverlayLock();
        break;

      case "invert":
        toggleInvert();
        break;

      case "close":
        suppressCurrentDocument();
        break;

      default:
        break;
    }
  }

  function normalizeForCurrentViewport(
    reason
  ) {
    if (!state) {
      return;
    }

    const before =
      geometrySignature(state);

    const normalized =
      normalizeStateGeometry(
        state
      );

    const changed =
      before !==
      geometrySignature(
        normalized
      );

    state =
      normalized;

    /*
     * Suppression must survive viewport events in this same document.
     */
    if (!renderSuppressed) {
      renderFocusWindow(state);
    }

    if (
      changed &&
      state.persist
    ) {
      queuePersistentStateWrite(
        state,
        reason
      );
    }
  }

  function handleViewportResize() {
    window.clearTimeout(
      viewportResizeTimer
    );

    viewportResizeTimer =
      window.setTimeout(
        () => {
          normalizeForCurrentViewport(
            "viewport-normalization"
          );
        },
        100
      );
  }

  async function initialize() {
    try {
      const response =
        await browser.runtime.sendMessage({
          type:
            "FOCUS_WINDOW_CONTENT_READY"
        });

      if (!response?.ok) {
        throw new Error(
          response?.error ??
            "Background initialization failed."
        );
      }

      /*
       * Every newly loaded supported document starts unsuppressed.
       * Suppression is intentionally never restored from storage.
       */
      renderSuppressed =
        false;

      if (
        response.state?.persist ===
        true
      ) {
        state =
          normalizeStateGeometry(
            response.state
          );

        visible =
          true;

        if (
          geometrySignature(state) !==
          geometrySignature(
            response.state
          )
        ) {
          queuePersistentStateWrite(
            state,
            "destination-viewport-normalization"
          );
        }
      } else {
        state =
          normalizeStateGeometry(
            response.defaultState
          );

        visible =
          false;
      }

      renderFocusWindow(state);
    } catch (error) {
      console.error(
        `${LOG_PREFIX} Content initialization failed.`,
        error
      );
    }
  }

  browser.runtime.onMessage.addListener(
    (message) => {
      if (
        message?.type !==
        "FOCUS_WINDOW_ACTION_TOGGLE"
      ) {
        return undefined;
      }

      if (!state) {
        return Promise.resolve({
          ok: false,

          error:
            "Canonical state has not initialized yet."
        });
      }

      if (interaction) {
        return Promise.resolve({
          ok: false,

          error:
            "A geometry interaction is currently active."
        });
      }

      /*
       * Firefox toolbar toggle semantics:
       *
       * Visible -> suppress current document.
       * Suppressed/hidden -> explicitly show current document again.
       *
       * Neither direction changes Persist.
       */
      if (
        visible &&
        !renderSuppressed &&
        getRoot()
      ) {
        suppressCurrentDocument();
      } else {
        showCurrentDocument();
      }

      return Promise.resolve({
        ok: true,

        visible,

        renderSuppressed,

        persist:
          state.persist
      });
    }
  );

  window.addEventListener(
    "resize",
    handleViewportResize,
    {
      passive: true
    }
  );

  /*
   * Capture-phase listener allows Escape to remain available even when a
   * webpage component has focus.
   */
  document.addEventListener(
    "keydown",
    handleDocumentKeyDown,
    true
  );

  void initialize();
})();