# Bookmark Backup
Chromium extension developed for [Helium](https://helium.surf) that auto-backs up your bookmarks whenever they change.

Helium is a browser built for privacy — no account, no sync, no cloud. That means your bookmarks only live on your device with no automatic backup. This extension fixes that without sending your data anywhere you didn't choose.

![License](https://img.shields.io/badge/license-GPL--3.0-blue)
![Helium](https://img.shields.io/badge/Helium-browser-blueviolet)
![Chromium](https://img.shields.io/badge/Chromium-compatible-orange)

## Features
- Auto-backup triggered by bookmark changes — not a timer
- 5 second debounce so rapid edits only trigger one backup
- Saves to `Downloads/Bookmark Backups/` as dated `.json` files
- Configurable number of backups to keep — oldest deleted automatically
- Manual backup button in the toolbar popup
- Toggle auto-backup on/off without uninstalling

## Installation

**Developed and tested on Helium. Also works on Chrome, Brave, Edge, Vivaldi and any other Chromium-based browser.**

1. Download and unzip this repo to a permanent location (e.g. `C:\Users\YourName\HeliumBackup\`)
2. In Helium go to `helium://extensions`
3. Enable **Developer mode** (toggle in the top right)
4. Click **Load unpacked** and select the unzipped folder

The Bookmark Backup icon will appear in your toolbar.

## Usage

Click the toolbar icon to:
- Turn auto-backup on or off
- Set how many backups to keep
- Trigger a manual backup

Backups are saved as `Bookmarks_YYYY-MM-DD.json` in `Downloads/Bookmark Backups/`.

## Contributing

Pull requests are welcome. Fork the repo, make your changes and open a PR.

## License

[GNU General Public License v3.0](https://www.gnu.org/licenses/gpl-3.0.en.html) — free to use, modify and distribute.
