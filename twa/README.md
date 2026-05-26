# TWA — Integrálna mapa (Google Play)

Android obal pre PWA cez Trusted Web Activity (Bubblewrap).

## Prerekvizity

- Node.js 18+
- Java JDK 11+ (pre Android SDK)
- Android SDK (Build Tools 33+)

## Setup

```bash
npm install -g @bubblewrap/cli --registry=https://registry.npmjs.org/
bubblewrap init --manifest="https://dusanoravsky.github.io/numero/manifest.webmanifest"
```

Alebo z lokálneho manifest:
```bash
bubblewrap init --manifest=./twa-manifest.json
```

## Build APK

```bash
bubblewrap build
```

Výstup: `app-release-signed.apk` + `app-release-bundle.aab` (pre Play Store).

## Keystore

Pri prvom builde sa vygeneruje `keystore.jks`. **NIKDY ho nepushovať do gitu!**
Zálohovať bezpečne — bez neho nevieš updatovať appku na Play.

## Digital Asset Links

`assetlinks.json` je v `numero-app/public/.well-known/`.

Po prvom uploade na Play Console:
1. Play Console → App signing → Scroll dole → "SHA-256 certificate fingerprint"
2. Skopírovať fingerprint
3. Nahradiť PLACEHOLDER v `assetlinks.json`
4. Deploy web (GitHub Actions)
5. Verifikovať: https://dusanoravsky.github.io/.well-known/assetlinks.json

## Notifikácie

`enableNotifications: true` v manifeste = TWA deleguje push permission na web.
Service Worker push handler funguje rovnako ako v PWA.

## Verzia

Pri každom update na Play:
- Zvýšiť `appVersionCode` (integer, vždy +1)
- Updatnúť `appVersionName` (match s web verziou)
