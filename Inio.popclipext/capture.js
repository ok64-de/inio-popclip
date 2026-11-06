#!/usr/bin/osascript -l JavaScript
// Inio for PopClip — both actions. PopClip passes the selection in POPCLIP_*
// variables. Every capture goes through the `inio` CLI, so the extension never
// touches the library and gets the app's own rules, and one Undo per capture.
//
// JXA because it ships with macOS: no jq, no python, and JSON for the block form
// with no shell quoting.
//
// Exit codes, PopClip's meaning: 0 success; 1 the shaking X; 2 the X, and it opens
// this extension's settings. Only a CLI that cannot be found is a settings problem.

ObjC.import("Foundation")
ObjC.import("stdlib")

const CANDIDATES = ["/opt/homebrew/bin/inio", "/usr/local/bin/inio", "~/.local/bin/inio"]

function env(name) {
  const value = $.NSProcessInfo.processInfo.environment.objectForKey(name)
  return value ? ObjC.unwrap(value) : ""
}

function expand(path) {
  return ObjC.unwrap($(path).stringByExpandingTildeInPath)
}

function isExecutable(path) {
  return $.NSFileManager.defaultManager.isExecutableFileAtPath(path)
}

/** The CLI: the configured path, else the first install location that exists. */
function cliPath() {
  const configured = env("POPCLIP_OPTION_PATH").trim()
  if (configured) return isExecutable(expand(configured)) ? expand(configured) : ""
  return CANDIDATES.map(expand).find(isExecutable) || ""
}

/** The capture for this action. A page's address lands as a link card after the text. */
function captureArguments(action, text, pageURL) {
  if (action === "todo") return ["capture", "--today", "--todo", "--text", text]
  if (pageURL) return ["capture", "--today", "--blocks-json", JSON.stringify([{ text }, { url: pageURL }])]
  return ["capture", "--today", "--text", text]
}

function run() {
  const text = env("POPCLIP_TEXT")
  if (!text.trim()) $.exit(1)
  const cli = cliPath()
  if (!cli) $.exit(2)

  const task = $.NSTask.alloc.init
  task.executableURL = $.NSURL.fileURLWithPath(cli)
  task.arguments = $(captureArguments(env("POPCLIP_ACTION_IDENTIFIER"), text, env("POPCLIP_BROWSER_URL")))
  task.standardOutput = $.NSFileHandle.fileHandleWithNullDevice
  task.standardError = $.NSFileHandle.fileHandleWithNullDevice
  if (!task.launchAndReturnError(null)) $.exit(1)
  task.waitUntilExit
  $.exit(task.terminationStatus === 0 ? 0 : 1)
}
