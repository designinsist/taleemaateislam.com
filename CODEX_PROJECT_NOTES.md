# Codex Project Notes

## Project

Taleemaat-e-Islam static website.

Main repo path used on this machine:
`/Users/mr.khatana/Downloads/taleemaateislam.com-main`

Git flow:
- Local branch: `deploy-clean`
- Push target: `origin main`
- Usual push command: `git push origin deploy-clean:main`
- Do not commit `.DS_Store`.

## Daily Sync Workflow

The recurring task is to fetch all public YouTube playlists, update website pages with missing public videos or remove stale videos no longer in playlists, validate, commit, and push.

Common steps:
1. Run `git status -sb`.
2. Run `git fetch origin`.
3. If remote moved, preserve local `dars-e-quran.html` edits and rebase:
   - `git stash push -m codex-dars-audio dars-e-quran.html`
   - `git stash push -m codex-ds .DS_Store`
   - `git rebase origin/main`
   - pop the stashes back.
4. Fetch playlists with `yt-dlp --flat-playlist --no-warnings --print '%(id)s|||%(title)s'`.
5. Compare playlist IDs to local page arrays.
6. Patch missing/stale IDs and update counts, latest thumbnails, and sitemap dates.
7. Preserve and commit valid daily audio rows added by the user in `dars-e-quran.html`.
8. Validate.
9. Commit with a dated message.
10. Push to GitHub.

## Public YouTube Playlists

- Hajj Q&A: `PLdujDev9jtVYGkOfaOEu80pbTtaPKPY7Q` -> `hajj-2026.html`
- Hajj Fazaail/Aadab: `PLdujDev9jtVaN5r4y0gQ0xp1_ImFjfQj_` -> `hajj-2026-mufti-ahmed-ali.html`
- Hajj English: `PLdujDev9jtVbbXiI58qU-n9zRH7ZOljSZ` -> `hajj-2026-step-by-step-english.html`
- Jummah Khutbah: `PLdujDev9jtVZm37FyiWT_bX7Pt24b7gam` -> `jummah-khutbah.html`
- Yaqeen Ka Safar: `PLdujDev9jtVYtRi2Ef_X85JaqfhMPT0Ai` -> `yaqeen-ka-safar-shorts.html` and `daily-shorts.js`
- Islamic Knowledge: `PLTrTk_fdnvMA` -> `islamic-knowledge.html`
- Dars Taha: `PLf3p6vt-01vk` -> `dars-e-quran-videos.html`
- Dars Maryam: `PLb9F2UZzrMqo` -> `dars-e-quran-videos.html`
- Dars Kahf: `PLdujDev9jtVYteodb2c4DpSj_ESdjYb-G` -> `dars-e-quran-videos.html`
- Dars Isra: `PLdujDev9jtVa_X_RmQNXyPQrSTn2M1MM9` -> `dars-e-quran-videos.html`
- Dars Nahal: `PLdujDev9jtVb4vxiTa3RxH34684mB0YLN` -> `dars-e-quran-videos.html`
- Finality of Prophethood: `PLyKJKwnd-x9I5uXx9SkoT09iIYgTCFVjo` -> `finality-of-prophethood.html`

Known unavailable video:
- `YK_wMxPgnng` in Maryam playlist is unavailable/deleted; exclude it from comparison and do not re-add it.

## Page Conventions

- Video/shorts pages should show newest first.
- Update `og:image` and `twitter:image` to the newest video thumbnail when a page changes.
- `finality-of-prophethood.html` shows all videos immediately, newest first.
- `daily-shorts.js` stores Yaqeen IDs in chronological order; the page logic reverses them for display.
- `yaqeen-ka-safar-shorts.html` stores objects newest first.
- `jummah-khutbah.html` stores the `shorts` ID array newest first and has a `shortTitles` map.
- `dars-e-quran-videos.html` stores Dars playlist objects newest first.
- Update `latest-updates.html` counts when Yaqeen, Dars, Jummah, or Finality counts change.
- Update `sitemap.xml` `lastmod` for changed public pages and usually `/` and `latest-updates.html`.

## Validation Commands

Playlist parity should show `miss=0 extra=0` for all managed playlists.

Basic validation:
```sh
xmllint --noout sitemap.xml
osascript -l JavaScript -e "ObjC.import('Foundation'); ['components.js','search-index.js','daily-shorts.js'].forEach(function(f){new Function($.NSString.stringWithContentsOfFileEncodingError(f,$.NSUTF8StringEncoding,null).js)}); 'ok';"
git diff --check
```

## Commit Style

Use clear commit messages, for example:
- `Sync latest YouTube playlist updates for September 1`
- `Show all Finality playlist videos by default`
- `Add Codex project handoff notes`

Before committing:
- Stage explicit files only.
- Never use `git add .`.
- Leave `.DS_Store` uncommitted.

