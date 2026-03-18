import { useState, useEffect } from "react";
import * as OTPAuth from 'otpauth';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleInfo } from "@fortawesome/free-solid-svg-icons";
import { ThemeToggle } from "./components/ThemeToggle";

// eslint-disable-next-line no-undef
const api = typeof browser !== "undefined" ? browser : chrome;

const App = () => {
    const [secret, setSecret] = useState('');
    const [token, setToken] = useState('000000');
    const [remaining, setRemaining] = useState(30);

    useEffect(() => {
        if (api?.storage?.local) {
            api.storage.local.get(['shasecret'], (result) => {
                if (result.shasecret) {
                    setSecret(result.shasecret);
                }
            });
        }
    }, []);

    useEffect(() => {
        if (!secret) return;

        const generateToken = () => {
            try {
                let totp = new OTPAuth.TOTP({
                    issuer: 'US',
                    label: '2FA',
                    algorithm: 'SHA1',
                    digits: 6,
                    period: 30,
                    secret: OTPAuth.Secret.fromBase32(secret.trim().toUpperCase()),
                });

                const newToken = totp.generate()
                setToken(newToken);

                if (api?.tabs?.query) {
                    api.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                        if (tabs[0]?.url?.includes("sso.us.es")) {
                            api.tabs.sendMessage(tabs[0].id, {
                                action: "autofill",
                                code: newToken
                            }).catch(() => {});
                        }
                    });
                } else {
                    console.debug("DevEnv");
                }

            } catch (err) {
                console.error("Invalid secret:", err);
                setToken("ERR!");
            }
        };

        generateToken();

        const timer = setInterval(() => {
            const now = Date.now() / 1000;
            const secondsInCycle = now % 30;
            const remainingTime = 30 - secondsInCycle;

            setRemaining(remainingTime);

            if (remainingTime > 29.9) generateToken();
        }, 41); // ~41.66ms = 24fps

        return () => clearInterval(timer);
    }, [secret]);

    const handleSaveSecret = (e) => {
        if (e.key === 'Enter') {
            const val = e.target.value.trim();
            if (api?.storage?.local) {
                api.storage.local.set({ 'shasecret': val }, () => {
                    setSecret(val);
                    console.log("Secret stored");
                });
            }
            e.target.value = '';
        }
    };

    const resetSecret = () => {
        if (api?.storage?.local) {
            api.storage.local.remove(['shasecret'], () => {
                setSecret('');
                setToken('000000');
            });
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(token);
    };

    return (
        <div className="container-app">
            <div className="top-actions">
                {!secret ? (
                    <div className="tooltip-container left">
                        <FontAwesomeIcon icon={faCircleInfo} className="info-icon" />
                        <div className="tooltip-text">
                            Para obtener tu secret ve <a href="https://2fa.us.es/a2f/otp/bind-device" target="_blank">aquí</a>
                            &nbsp;y dale a 'Mostrar' -&gt; 'Mostrar parámetros de configuración'
                        </div>
                    </div>
                ) : (
                    <div />
                )}
                <ThemeToggle className="right" />
            </div>

            {!secret && (
                <div className="header-wrapper">
                    <h3>US 2FA Autofill</h3>
                </div>
            )}

            {!secret ? (
                <div className="setup-view">
                    <span className="info-text">
                        Mete tu secret SHA-1 de la US y pulsa Enter
                    </span>
                    <input
                        type="text"
                        onKeyUp={handleSaveSecret}
                        placeholder="Introduce secret..."
                    />
                </div>
            ) : (
                <div className="token-view">
                    <div
                        id="codigo2FA"
                        onClick={copyToClipboard}
                        style={{
                            "--progress-smooth": `${(remaining / 30) * 100}%`
                        }}
                    >
                        {token}
                    </div>
                    <button className="btn-reset" onClick={resetSecret}>
                        Cambiar Secret
                    </button>
                </div>
            )}

            <footer className="app-footer">
                <small>Dev'd with &lt;3 by <a className="text-decoration-none" target="_blank" href="https://jose.miarma.net"><strong>Gallardo7761</strong></a></small>
            </footer>
        </div>
    );
}

export default App;