/**
 * A confirmation window plugin
 * @param {*} options Default configuration of the confirmation window
 * @returns {object} object contains render function and getIsOpen function
 */
export function confirmWindow(options = {}) {
  const defaults = {
    title: "Confirm",
    message: "Are you sure?",
    yesText: "Yes",
    noText: "No",
    hidden: false,
    hideTargets: null, // a string or array with element needed to be hidden
  };

  const config = { ...defaults, ...options };
  let isOpen = false;

  function render() {
    if (isOpen) return Promise.resolve({ ok: false });
    isOpen = true;

    return new Promise((resolve) => {
      // determine what content needed to be hidden
      let targets = [];
      if (config.hidden) {
        if (typeof config.hideTargets === "string") {
          // target is a string
          targets = Array.from(document.querySelectorAll(config.hideTargets));
        } else if (Array.isArray(config.hideTargets)) {
          // target is an array
          targets = config.hideTargets.filter(Boolean);
        }
      }

      // hide targets
      const prevDisplay = new Map();
      if (config.hidden) {
        targets.forEach((el) => {
          prevDisplay.set(el, el.style.display);
          el.style.display = "none";
        });
      }

      const wrapper = document.createElement("div");
      wrapper.innerHTML = `
        <div class="modal" tabindex="-1">
          <div class="modal-dialog">
            <div class="modal-content">

              <div class="modal-header">
                <h5 class="modal-title">${config.title}</h5>
                <button type="button"
                        class="btn-close"
                        data-bs-dismiss="modal"
                        aria-label="Close"></button>
              </div>

              <div class="modal-body">
                <p>${config.message}</p>
              </div>

              <div class="modal-footer">
                <button type="button"
                        class="btn btn-secondary"
                        data-bs-dismiss="modal">
                  ${config.noText}
                </button>
                <button type="button"
                        class="btn btn-primary">
                  ${config.yesText}
                </button>
              </div>

            </div>
          </div>
        </div>
      `;
      document.body.appendChild(wrapper);

      const modalEl = wrapper.querySelector(".modal");
      const btnYes = wrapper.querySelector(".btn-primary");

      const modal = new bootstrap.Modal(modalEl, {
        // user click outside of the window will not close the window
        backdrop: "static",
        keyboard: false,
      });

      let resolved = false;
      const finish = (ok) => {
        if (resolved) return;
        resolved = true;
        resolve({ ok });
        modal.hide();
      };

      btnYes.onclick = () => finish(true);

      modalEl.addEventListener("hidden.bs.modal", () => {
        // restore targets
        if (config.hidden) {
          targets.forEach((el) => {
            el.style.display = prevDisplay.get(el) ?? "";
          });
        }

        isOpen = false;
        wrapper.remove();
        resolve({ ok: false });
      });

      modal.show();

      modalEl.addEventListener(
        "mousedown",
        (e) => {
          // If they clicked the backdrop (outside window), swallow the event
          if (e.target === modalEl) {
            e.preventDefault();
            e.stopPropagation();
          }
        },
        true,
      );

      modalEl.addEventListener(
        "click",
        (e) => {
          if (e.target === modalEl) {
            e.preventDefault();
            e.stopPropagation();
          }
        },
        true,
      );
    });
  }

  function getIsOpen() {
    return isOpen;
  }

  return { render, getIsOpen };
}
