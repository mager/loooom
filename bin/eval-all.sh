#!/usr/bin/env bash
# Run all plugin evals locally
# Usage: ./bin/eval-all.sh [plugin-slug]
# Example: ./bin/eval-all.sh beginner-japanese

set -e

if [ -z "$GROQ_API_KEY" ]; then
  echo "❌ GROQ_API_KEY not set. Get a free key at console.groq.com"
  exit 1
fi

PLUGINS=(
  beginner-japanese
  kana-ascii
  learn-anything
  socratic-thinking
  persuasive-writing
  frontend-design
)

# If a specific plugin is passed, run only that one
if [ -n "$1" ]; then
  PLUGINS=("$1")
fi

for slug in "${PLUGINS[@]}"; do
  config="plugins/$slug/promptfooconfig.yaml"
  if [ ! -f "$config" ]; then
    echo "⚠️  No config found for $slug — skipping"
    continue
  fi
  echo ""
  echo "▶ $slug"
  npx promptfoo eval --config "$config"
done

echo ""
echo "✓ Done. Run 'npx promptfoo view' to see results."
