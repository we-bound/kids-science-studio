#!/usr/bin/env bash
set -euo pipefail

composition="${1:-TidesTest}"
output="${2:-out/${composition}.mp4}"

./node_modules/.bin/remotion render src/index.ts "$composition" "$output" --codec h264
