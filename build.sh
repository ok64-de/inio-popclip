#!/bin/sh
# Package Inio.popclipext as Inio.popclipextz (a zip PopClip installs on double-click).
# The release job attaches the same file to a GitHub release.
set -eu
here=$(cd "$(dirname "$0")" && pwd)
out="$here/Inio.popclipextz"
rm -f "$out"
(cd "$here" && zip -q -r -X "$out" Inio.popclipext)
echo "$out"
