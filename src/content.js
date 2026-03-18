(async function() {
  // eslint-disable-next-line no-undef
  const api = typeof browser !== "undefined" ? browser : chrome;

  const fillAndSubmit = (code) => {
    const input = document.getElementById("input2factor");
    const button = document.getElementById("notification_2factor_button_ok");

    const errorMsg = document.querySelector(".ui-state-error");
    const isErrorVisible = errorMsg && errorMsg.style.display !== "none";

    if (!input || input.value.length > 0 || isErrorVisible) {
      return;
    }

    console.log("Autofill");
    
    input.focus();
    input.value = code;
    ['input', 'change', 'keyup', 'keydown'].forEach(evt => {
      input.dispatchEvent(new Event(evt, { bubbles: true }));
    });

    setTimeout(() => {
      if (button) {
        console.log("Clicking 'Aceptar'");
        const clickEvent = new MouseEvent('click', {
          view: window,
          bubbles: true,
          cancelable: true
        });
        button.dispatchEvent(clickEvent);
      }
    }, 400);
  };

  const tryAutofill = async () => {
    const data = await api.storage.local.get(['shasecret']);
    if (data.shasecret) {
      api.runtime.sendMessage({ action: "GENERATE_TOKEN" }, response => {
        if (response?.token) {
          fillAndSubmit(response.token);
        }
      });
    }
  };

  const observer = new MutationObserver(() => {
    if (document.getElementById("input2factor")) {
      tryAutofill();
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });

  api.runtime.onMessage.addListener((request) => {
    if (request.action === "autofill") {
      fillAndSubmit(request.code);
    }
  });

  tryAutofill();
})();