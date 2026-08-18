# Fingerprint playground research

## Scope and guardrails

The playground will show only browser-exposed signals to the current visitor, with an explicit local consent step. It will not attempt to bypass permissions, probe private network addresses, read files, access sensors, enumerate hardware beyond standard exposed APIs, or send raw fingerprint data to a server. Any identifier is computed locally for demonstration and is not persisted by the site.

## Findings

- Browser fingerprinting combines distinguishing browser and operating-system characteristics; common examples include browser version, timezone, preferred language, available codecs, installed fonts, browser settings, display size, and resolution.
- JavaScript and CSS can retrieve some of these signals, but web standards and browsers intentionally reduce identifying information and add protections.
- Modern privacy guidance recommends using only the data needed, respecting permission gateways, and avoiding covert cross-site identification.
- The implementation should separate signals into: browser/runtime, locale/time, display, media capability, storage/privacy settings, network hints exposed to the page, and optional capability checks.
- Permission-gated sources such as geolocation, camera, microphone, MIDI, Bluetooth, USB, serial, and clipboard contents must not be accessed automatically. If shown at all, they should be marked as available/denied/unsupported without requesting permission.
- The AI summary should explain what the page can infer from the collected signals, distinguish high/medium/low uniqueness, and include mitigation guidance. It should not claim to identify a person, exact location, IP, installed font list, or hardware model unless the browser explicitly exposes that information.

## Sources

1. https://web.dev/learn/privacy/fingerprinting — Google web.dev, Fingerprinting.
2. https://developer.mozilla.org/en-US/docs/Glossary/Fingerprinting — MDN, Fingerprinting glossary.
3. https://www.eff.org/pages/cover-your-tracks — EFF, Cover Your Tracks.
4. https://docs.fingerprint.com/docs/introduction — Fingerprint documentation, overview of browser fingerprinting.
5. https://w3c.github.io/fingerprinting-guidance/ — W3C fingerprinting guidance.

## Additional findings

- EFF frames fingerprinting as a test of how trackers see a browser and how uniquely configured it is; the user-facing output should therefore emphasize identifiability/uniqueness rather than pretend to identify a named person.
- Commercial fingerprint products combine browser/device signals with server-side intelligence and machine learning to create persistent visitor IDs. That is outside this playground's scope because it would require sending data to a third party or server.
- The playground should explicitly distinguish a local demonstration hash from a persistent visitor ID. No raw signal or generated hash should be posted to an API, cookie, localStorage, or analytics event.

## Local smoke test

The route `/playground/fingerprint-audit` rendered successfully in Astro dev. Before consent, the page shows the privacy disclosure, disabled audit action, and an empty AI summary state. After consent, the audit rendered 14 signal groups, a local SHA-256 demo hash, an exposure score, and `Raw data sent: 0`. The browser showed the inventory locally, while the AI fallback summary correctly stated that the result describes browser configuration rather than a person's identity. Permission states were read without opening permission prompts.
