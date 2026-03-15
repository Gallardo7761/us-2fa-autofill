// eslint-disable-next-line no-undef
const api = typeof browser !== "undefined" ? browser : chrome;

api.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "autofill") {
    const input = document.getElementById('input2factor');
    const button = document.getElementById('btn-login');

    if (input) {
      input.focus();
      input.value = request.code;
      
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new Event('change', { bubbles: true }));

      if (button) {
        setTimeout(() => {
          button.click();
        }, 150);
      }
      sendResponse({ status: "bomba" });
    }
  }
  return true;
});