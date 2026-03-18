import * as OTPAuth from 'otpauth';

// eslint-disable-next-line no-undef
const api = typeof browser !== "undefined" ? browser : chrome;

api.runtime.onMessage.addListener((request, _sender, sendResponse) => {
  if (request.action === "GENERATE_TOKEN") {
    api.storage.local.get(['shasecret'], (data) => {
      if (data.shasecret) {
        const totp = new OTPAuth.TOTP({
          issuer: 'US',
          label: '2FA',
          algorithm: 'SHA1',
          digits: 6,
          period: 30,
          secret: OTPAuth.Secret.fromBase32(data.shasecret.trim().toUpperCase()),
        });
        sendResponse({ token: totp.generate() });
      }
    });
    return true;
  }
});