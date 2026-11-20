# lyricAdder (Geomitron fork)

Geo's fork of DarkAngel2096/lyricAdder, an Electron app that writes lyrics into a .chart or .mid. Its releases come from the branch `geomitron`, which starts from upstream's last public build, 1.2.2 (`149ed9b` on `dev`), without the unfinished redesign that follows it on `dev`.

## Boundaries

- Keep the label: the sidebar's version line reads "v <version> Geomitron", and the window title stays "Lyric Adding Thingy".
- Keep LICENSE (ISC, "Copyright (c) 2018, DarkAngel2096"): upstream has no license file, and the packaged app includes it.
- The selected chart's name and artist come from song.ini, as Clone Hero reads it (`songIni.js`), else from the .chart's `[Song]` values or a .mid's folder name.
- The app keeps its config and backups in `../lyricAdder_backups` beside its working folder, and Electron keeps its profile in `%APPDATA%\lyricadder`: test on copies of songs, from a working folder made for the test, and delete the profile afterwards.

## Commands

- `npm install`, then `node node_modules/electron/install.js` (Electron's binary downloads on first use). Electron 45 needs Windows 10 or later.
- Package: `npm run package-win` (x64, into `release-builds/lyricadder-win32-x64`).

## Versions and releases

- A version is upstream's plus a fourth part (`1.2.2.1`, `1.2.2.2`, ...), and a tag is the plain version.
- Release: commit the version; package; zip `release-builds/lyricadder-win32-x64` with 7-Zip (`a -tzip -mx=9`, then `rn` its top folder to "lyricAdder v<version> Geomitron"); test the exe extracted from the zip; push `geomitron`, then tag and push the tag; then `gh release create <version> -R Geomitron/lyricAdder --verify-tag --title "lyricAdder v<version> Geomitron" --notes-file <notes> <zip>`, with the asset named `lyricAdder.v<version>.Geomitron.Win64.zip`.
