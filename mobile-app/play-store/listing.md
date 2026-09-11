# Play Store Listing - Taleemaat-e-Islam

Copy-paste source for the Play Console store listing form. Nothing here is
sensitive - safe to keep in the repo (unlike the keystore/password, which
live outside git entirely).

## App details

- **App name:** Taleemaat-e-Islam
- **Package name:** com.taleemaateislam.app
- **Category:** Education (Lifestyle is a reasonable second choice if Google
  pushes back on Education - Islamic Tools + prayer times lean Lifestyle,
  but the Dars/teachings focus fits Education better)
- **Contact email:** mr.shahidamin@gmail.com (same as the site's privacy contact)
- **Website:** https://taleemaateislam.com
- **Privacy Policy URL:** https://taleemaateislam.com/privacy.html (already live)

## Short description (max 80 characters - currently 78)

```
Dars-e-Quran, Jummah Khutbah, Hajj guidance, free Islamic books & prayer times
```

## Full description (max 4000 characters)

```
Taleemaat-e-Islam brings authentic Quranic commentary and Sunni scholarly
guidance to your phone, building on the legacy of Sheikh Ahmad Sirhindi
(Mujaddid Alf Thani) and Shah Waliullah Dehlawi.

QURAN & DARS
- Dars-e-Quran: ayah-by-ayah audio tafseer by Mufti Shahid Mushtaq, covering
  Surah Taha, Maryam, Al-Kahf, Al-Isra, and more
- Dars-e-Quran Videos: the same series in video form
- Quran with Urdu Translation: clear Urdu translation of Quran passages
- Jummah Khutbah: weekly Friday sermon clips
- Islamic Knowledge & Quranic Stories: short reminders and timeless lessons

SEERAH & COMPANIONS
- Syed-ul-Bashar: the life of Prophet Muhammad (peace be upon him) and his
  companions
- Qasas-ul-Anbiya: stories of the Prophets
- Al-Salihin: biographies of righteous companions and scholars

CONNECT WITH ALLAH
- 16 free Islamic books in Urdu and English, including Khuda Mojood Hai and
  Yaqeen Ka Safar
- Daily Yaqeen Ka Safar short reminders on faith, prayer, and self-reform

HAJJ 2026 SPECIAL
- Hajj Q&A with Mufti Muhammad Tahir Masood
- Fazaail & Aadab (virtues and etiquettes) with Mufti Ahmed Ali
- A step-by-step English guide to Hajj

ISLAMIC TOOLS
- Accurate Namaz timings for Pakistan cities
- Hijri calendar
- Qibla direction

STAY UPDATED
Turn on notifications for just the categories you care about - Dars-e-Quran,
Quran with Urdu Translation, Yaqeen Ka Safar, or Jummah Khutbah - and get
notified the moment something new is published.

Free. No ads. No account required. Built as a non-commercial public service.
```

## Graphics

- `play-store-icon-512.png` - 512x512 app icon for the store listing
- `play-store-feature-graphic.png` - 1024x500 feature graphic banner
- **Phone screenshots (2-8 required):** not included here - grab 3-4 directly
  from your phone once you've reinstalled the latest build (Home, Dars-e-Quran,
  the bottom tab bar, and the notification toggle panel are good choices).
  Send them over and I'll check they meet Play's minimum size requirements
  before you upload.

## Data safety form (Play Console's own interactive questionnaire)

This section of Play Console is a guided form with specific checkboxes, not
free text - use this as your answer key when filling it in:

| Data type | Collected? | Purpose | Notes |
|---|---|---|---|
| App activity (analytics) | Yes | Analytics | Via Google Analytics (GA4), already disclosed at /privacy.html - anonymised, no PII |
| Device or other IDs | Yes | App functionality | Firebase push notification token - only if the user opts in via the in-app toggle |
| Approximate location | No | - | City for prayer times is a manual dropdown selection, not a device location permission |
| Personal info (name/email/etc.) | No | - | No account system, nothing to collect |
| Financial info | No | - | No payments, no purchases |

Data sharing: none of the above is sold or shared with third parties beyond
the service providers that process it on our behalf (Google Analytics,
Firebase/Google Cloud Messaging).
Data deletion: since nothing personally identifying is collected, there's no
user data to delete on request - state this plainly if the form asks.
Encryption in transit: yes (the whole site and API calls are HTTPS).

## Step-by-step: getting from here to submitted

1. Finish creating your Play Console account (developer.android.com/console) -
   $25 one-time fee, needs ID verification.
2. Create app -> fill in name/language/app-or-game/free-or-paid using the
   details above.
3. Play Console will prompt you to enroll in **Play App Signing** - accept
   this (it's the default and recommended path). It means Google holds the
   real signing key and re-signs what you upload; the `release.keystore` I
   generated is just your "upload key" to authenticate with Google, safer to
   lose than an app-signing key would be.
4. Under **Release > Production** (or start with **Internal testing** first,
   recommended for your very first release), upload `app-release.aab`.
5. Fill in the Store Listing tab with the copy and graphics above.
6. Fill in **App content**: Privacy policy URL, Data safety (table above),
   Content rating questionnaire (answer honestly - this app has no violence/
   mature content, should land in "Everyone"), Target audience, Ads
   declaration (none), Government apps declaration (no).
7. Once Play App Signing is active, go to **Release > Setup > App integrity**
   and copy the **App signing key certificate**'s SHA-256 fingerprint - send
   it to me and I'll add it to `.well-known/assetlinks.json` so deep links
   work for the actual Play Store build too (it'll differ from the upload
   key's fingerprint already in that file).
8. Submit for review. First review is typically a few hours to a few days.
