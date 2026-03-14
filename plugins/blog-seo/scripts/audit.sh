#!/usr/bin/env bash
# blog-seo audit script v2.0
# Usage: bash audit.sh <path-to-blog-dir>
# Scans all .md / .mdx posts and reports frontmatter issues grouped by type.
# Works with Astro, Hugo, Jekyll, Next.js MDX, or any frontmatter-based markdown.

BLOG_DIR="${1:-./src/content/blog}"

if [ ! -d "$BLOG_DIR" ]; then
  echo "Error: directory not found: $BLOG_DIR"
  echo "Usage: bash audit.sh <path-to-blog-dir>"
  exit 1
fi

declare -a MISSING_KEYWORD=()
declare -a EMPTY_HERO=()
declare -a MISSING_HERO=()
declare -a MISSING_TAGS=()
declare -a SHORT_DESC=()
declare -a MISSING_DESC=()
declare -a BAD_TITLE=()
declare -a DRAFT_POSTS=()

# Count total posts scanned
TOTAL=0

for file in "$BLOG_DIR"/*.md "$BLOG_DIR"/*.mdx; do
  [ -f "$file" ] || continue
  slug=$(basename "$file" .mdx)
  slug=$(basename "$slug" .md)
  TOTAL=$((TOTAL + 1))

  # Extract frontmatter block (between first two --- lines)
  fm=$(awk '/^---/{c++; if(c==2) exit} c==1' "$file")

  # ── keyword / keywords ─────────────────────────────────
  kw=$(echo "$fm" | grep -E '^keywords?:' | sed 's/keywords\?: *//')
  if [ -z "$kw" ]; then
    MISSING_KEYWORD+=("$slug")
  fi

  # ── heroImage / image / cover / thumbnail ──────────────
  hero=$(echo "$fm" | grep -E '^(heroImage|image|cover|thumbnail):' | head -1 | sed 's/^[^:]*: *//')
  if [ -z "$hero" ]; then
    MISSING_HERO+=("$slug")
  elif [ "$hero" = '""' ] || [ "$hero" = "''" ] || [ "$hero" = "" ]; then
    EMPTY_HERO+=("$slug")
  fi

  # ── tags / categories ──────────────────────────────────
  if ! echo "$fm" | grep -qE '^(tags|categories):'; then
    MISSING_TAGS+=("$slug")
  fi

  # ── description / summary / excerpt ────────────────────
  desc=$(echo "$fm" | grep -E '^(description|summary|excerpt):' | head -1 | sed 's/^[^:]*: *//' | tr -d '"')
  if [ -z "$desc" ]; then
    MISSING_DESC+=("$slug")
  elif [ ${#desc} -lt 50 ]; then
    SHORT_DESC+=("$slug (${#desc} chars)")
  fi

  # ── title format — colon pattern check ─────────────────
  # Skip cooking/recipe/life categories — only enforce on code/tech
  category=$(echo "$fm" | grep -E '^category:' | sed 's/category: *//' | tr -d '"')
  if [[ -z "$category" || "$category" == "code" || "$category" == "tech" ]]; then
    title=$(echo "$fm" | grep -E '^title:' | sed 's/title: *//' | tr -d '"')
    if [ -n "$title" ] && ! echo "$title" | grep -qE '.+:.+'; then
      BAD_TITLE+=("$slug")
    fi
  fi

  # ── draft posts ────────────────────────────────────────
  draft=$(echo "$fm" | grep -E '^draft:' | sed 's/draft: *//' | tr -d '"')
  if [ "$draft" = "true" ]; then
    DRAFT_POSTS+=("$slug")
  fi
done

# ── Report ─────────────────────────────────────────────────────────────────

print_section() {
  local label="$1"
  shift
  local items=("$@")
  if [ ${#items[@]} -gt 0 ]; then
    echo ""
    echo "## $label (${#items[@]})"
    for item in "${items[@]}"; do
      echo "  • $item"
    done
  fi
}

echo "==============================="
echo "  Blog SEO Audit Report"
echo "  $(date '+%Y-%m-%d %H:%M')"
echo "  Dir: $BLOG_DIR"
echo "  Posts scanned: $TOTAL"
echo "==============================="

print_section "Missing keyword/keywords field" "${MISSING_KEYWORD[@]}"
print_section "Empty hero image" "${EMPTY_HERO[@]}"
print_section "Missing hero image field" "${MISSING_HERO[@]}"
print_section "Missing tags/categories" "${MISSING_TAGS[@]}"
print_section "Missing description" "${MISSING_DESC[@]}"
print_section "Description too short (<50 chars)" "${SHORT_DESC[@]}"
print_section "Title missing colon format (code/tech only)" "${BAD_TITLE[@]}"

if [ ${#DRAFT_POSTS[@]} -gt 0 ]; then
  echo ""
  echo "## Draft posts (not audited for SEO, FYI) (${#DRAFT_POSTS[@]})"
  for item in "${DRAFT_POSTS[@]}"; do
    echo "  • $item"
  done
fi

echo ""
total_issues=$((${#MISSING_KEYWORD[@]} + ${#EMPTY_HERO[@]} + ${#MISSING_HERO[@]} + ${#MISSING_TAGS[@]} + ${#MISSING_DESC[@]} + ${#SHORT_DESC[@]} + ${#BAD_TITLE[@]}))
echo "Total issues: $total_issues across $TOTAL posts"
echo ""
