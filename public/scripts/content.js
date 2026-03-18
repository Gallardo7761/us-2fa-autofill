(async function() {
  // eslint-disable-next-line no-undef
  const api = typeof browser !== "undefined" ? browser : chrome;

  const fillCode = (code) => {
    const input = document.getElementById("input2factor");
    const button = document.getElementById('btn-login') || document.querySelector("#notification_2factor_button_ok");
    const error = document.querySelector("#otp_authn_wrong_code")?.offsetHeight > 0;

    if (!input || error) return;

    input.value = code;
    input.dispatchEvent(new Event('input', { bubbles: true }));
    
    setTimeout(() => {
      if (button) button.click();
    }, 200);
    console.log("Autofill");
  };

  api.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "autofill") {
      fillCode(request.code);
      sendResponse({ status: "ok" });
    }
  });

  const data = await api.storage.local.get(['shasecret']);
  if (data.shasecret) {
    const input = document.getElementById("input2factor");
    if (input && input.value.length === 0) {
      api.runtime.sendMessage({ action: "GENERATE_TOKEN" }, response => {
        if (response?.token) {
          fillCode(response.token);
        }
      });
    }
  }
})();