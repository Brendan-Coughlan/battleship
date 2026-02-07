/**
 * A pop up window plugin that let the user select a number
 * @param {*} options Configuration of the window
 * @returns {object} object contains render function and getIsOpen function
 *
 */
export function selNumWindow(options = {}) {
  // default configuration of the window
  const defaults = {
    title: "Title",
    message: "message",
    yesText: "Yes",
    noText: "No",
    lockScroll: true,
    min: 1,
    max: 10,
    defaultValue: 1,
  };

  // merge options config with default config
  // if not provided in options, use default
  const config = { ...defaults, ...options };
  // flag to check if the pop up window is active
  // if the window is still active, no game interaction is allowed
  let isOpen = false;

  /**
   * show the pop up window based on the configuration
   * @param {*} param0
   * @returns
   */
  function render() {
    if (isOpen) return Promise.resolve({ ok: false, value: null });
    isOpen = true;

    const prevOverflow = document.body.style.overflow;
    if (config.lockScroll) document.body.style.overflow = "hidden";

    const min = config.min;
    const max = config.max;

    // pick a safe default
    let initial;
    if (
      Number.isInteger(config.defaultValue) &&
      config.defaultValue >= config.min &&
      config.defaultValue <= config.max
    ) {
      initial = config.defaultValue;
    } else {
      initial = config.min;
    }

    // build <option> list
    const optionsHtml = Array.from({ length: max - min + 1 }, (_, i) => {
      const n = min + i;
      return `<option value="${n}" ${n === initial ? "selected" : ""}>${n}</option>`;
    }).join("");

    return new Promise((resolve) => {
      const overlay = document.createElement("div");
      overlay.className = "ipp-overlay";

      const modal = document.createElement("div");
      modal.className = "ipp-modal";

      modal.innerHTML = `
        <h3 class="ipp-title">${config.title}</h3>
        <p class="ipp-message">${config.message}</p>

        <select class="ipp-input" aria-label="Choose a number">
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
        const value = parseInt(select.value, 10);
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

  function getIsOpen() {
    return isOpen;
  }

  return { render, getIsOpen };
}
