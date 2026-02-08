/**
 * An notification plugin to alert user some information on thr page
 * @param {*} option Configuration of the toast
 * @returns {object} object contains render function
 */
export function toastsWindow(option = {}) {
  // defualt configuration of the notification
  const defaults = {
    message: "Notification",
    variant: "primary", // prefix bootstrap style
    position: "top-right",
    delay: 1500,
    closeButton: true,
  };

  const POSITION = {
    "top-right": "top-0 end-0",
    "top-left": "top-0 start-0",
    "bottom-right": "bottom-0 end-0",
    "bottom-left": "bottom-0 start-0",
    "top-center": "top-0 start-50 translate-middle-x",
    "bottom-center": "bottom-0 start-50 translate-middle-x",
    center: "top-50 start-50 translate-middle",
  };

  const config = { ...defaults, ...option };

  return {
    /**
     * Show the toast
     * @param {*} override optional configuration overrides
     */
    render(override = {}) {
      const opts = { ...config, ...override };

      const id = `toast-container__${opts.position}`;
      let container = document.getElementById(id);

      // if the toast window not exist, create one
      if (!container) {
        container = document.createElement("div");
        container.id = id;
        container.className = `toast-container position-fixed ${
          POSITION[opts.position] || POSITION["top-right"]
        } p-3`;
        // make sure the toast is above everything
        container.style.zIndex = "9999";
        document.body.appendChild(container);
      }

      // build toast
      const toast = document.createElement("div");
      // set background color
      toast.className = `toast text-bg-${opts.variant} border-0 show`;
      toast.setAttribute("role", "alert");
      toast.setAttribute("aria-live", "assertive");
      toast.setAttribute("aria-atomic", "true");

      toast.innerHTML = `
        <div class="d-flex">
          <div class="toast-body">${opts.message}</div>
          ${
            opts.closeButton
              ? `<button type="button"
                   class="btn-close btn-close-white me-2 m-auto"
                   aria-label="Close"></button>`
              : ""
          }
        </div>
      `;

      container.appendChild(toast);

      // close behavior
      const close = () => toast.remove();

      const btn = toast.querySelector(".btn-close");
      if (btn) btn.onclick = close;

      // auto hide
      if (opts.delay > 0) {
        setTimeout(close, opts.delay);
      }
    },
  };
}
