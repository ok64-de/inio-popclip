# Inio for PopClip

Send selected text to [Inio](https://github.com/flegfleg/homebrew-inio) from the PopClip bar.

| Action | Does |
|---|---|
| Add to Today | Adds the text to the end of today's daily note. From a supported browser, the page's address follows as a link card. |
| Add Todo | Adds an open todo with the text to today's daily note. The page's address is not added. |

Each capture is one step in Inio's Edit ▸ Undo.

## Requirements

- PopClip.
- Inio, running.
- Inio's command-line tool, `inio`:

  ```sh
  brew install --cask flegfleg/inio/inio-cli
  ```

  If `inio` is not in `/opt/homebrew/bin`, `/usr/local/bin` or `~/.local/bin`, set **CLI path** in the extension's settings.

## Install

Download `Inio.popclipextz` from the latest release and double-click it. PopClip warns about an extension that it has not signed. Choose to install it.

## Build from source

```sh
./build.sh          # writes Inio.popclipextz
```

The extension is `Inio.popclipext`: `Config.json` and one JXA script, `capture.js`, which runs with the `osascript` that ships with macOS. It needs nothing else.

To try the script without PopClip:

```sh
POPCLIP_TEXT="Call the bank" POPCLIP_ACTION_IDENTIFIER=today Inio.popclipext/capture.js
```

## Errors

PopClip shows its failure X when the capture fails, for example when Inio does not answer. When the CLI cannot be found, it also opens the extension's settings. The failure has no message, and the text stays selected.

## License

MIT
