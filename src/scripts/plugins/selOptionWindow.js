/**
 * A pop-up window plugin that lets the user select a number.
 * @module plugins/selOptionWindow
 * @param {Object} [options={}] Configuration of the window.
 * @param {string} [options.title="Title"] Modal title.
 * @param {string} [options.message="message"] Modal message.
 * @param {string} [options.yesText="Yes"] Confirm button text.
 * @param {string} [options.noText="No"] Cancel button text.
 * @param {boolean} [options.lockScroll=true] Whether to lock page scrolling while open.
 * @param {Array} [options.options=[]] List of selectable options.
 * @param {*} [options.defaultValue=null] Default selected value.
 *
 * @returns {{ render: function(): Promise<{ok: boolean, value: (number|null)}>, getIsOpen: function(): boolean }}
 * An object containing:
 * - render(): opens the modal and resolves with the user's choice
 * - getIsOpen(): returns whether the modal is currently open
 */
export function selOptionWindow(options = {}) {
  // default configuration of the window
  const defaults = {
    title: "Title",
    message: "message",
    yesText: "Yes",
    noText: "No",
    lockScroll: true,
    options: [],
    defaultValue: null,
  };

  // merge options config with default config
  // if not provided in options, use default
  const config = { ...defaults, ...options };
  // flag to check if the pop up window is active
  // if the window is still active, no game interaction is allowed
  let isOpen = false;

  /**
   * Shows the pop-up window and resolves with the user's selection.
   * @returns {Promise<{ok: boolean, value: (number|null)}>} User choice result.
   */
  function render() {
    if (isOpen) return Promise.resolve({ ok: false, value: null });
    isOpen = true;

    const prevOverflow = document.body.style.overflow;
    if (config.lockScroll) document.body.style.overflow = "hidden";

    const choices = config.options;

    // pick a safe default
    let initialIndex = choices.findIndex((opt) =>
      typeof opt === "object"
        ? opt.value === config.defaultValue
        : opt === config.defaultValue,
    );

    if (initialIndex === -1) initialIndex = 0;

    // build <option> list
    const optionsHtml = choices
      .map((opt, i) => {
        const label = typeof opt === "object" ? opt.label : opt;
        const value = typeof opt === "object" ? opt.value : opt;

        return `<option value="${i}" ${i === initialIndex ? "selected" : ""}>${label}</option>`;
      })
      .join("");

    return new Promise((resolve) => {
      const overlay = document.createElement("div");
      overlay.className = "ipp-overlay";

      const modal = document.createElement("div");
      modal.className = "ipp-modal";

      modal.innerHTML = `
        <h3 class="ipp-title">${config.title}</h3>
        <p class="ipp-message">${config.message}</p>

        <select class="ipp-input" aria-label="Choose an option">
          ${optionsHtml}
        </select>

        <div class="ipp-actions">
          <button class="ipp-btn ipp-btn-yes">${config.yesText}</button>
          <button class="ipp-btn ipp-btn-no">${config.noText}</button>
        </div>
      `;

      overlay.append(modal);
      document.body.appendChild(overlay);

      const select = modal.querySelector("select.ipp-input");
      const btnYes = modal.querySelector(".ipp-btn-yes");
      const btnNo = modal.querySelector(".ipp-btn-no");

      // focus dropdown
      select.focus();

      const cleanup = () => {
        document.removeEventListener("keydown", onKeyDown, true);
        isOpen = false;
        if (config.lockScroll) document.body.style.overflow = prevOverflow;
        overlay.remove();
      };

      const finish = (ok) => {
        const selectedIndex = parseInt(select.value, 10);
        const selected = choices[selectedIndex];
        const value = typeof selected === "object" ? selected.value : selected;

        cleanup();
        // return an object that records user's choice
        resolve({ ok, value });
      };

      btnYes.onclick = () => finish(true);
      btnNo.onclick = () => finish(false);

      // capture keydown so p5 doesn't receive it
      const onKeyDown = (e) => {
        e.stopPropagation();
        if (e.key === "Enter") finish(true);
        if (e.key === "Escape") finish(false);
      };
      document.addEventListener("keydown", onKeyDown, true);
    });
  }

  /**
   * Returns whether the pop-up is currently open.
   * @returns {boolean} True if open, otherwise false.
   */
  function getIsOpen() {
    return isOpen;
  }

  return { render, getIsOpen };
}
