#!/usr/bin/env bash
# blog-seo audit script
# Usage: bash audit.sh <path-to-blog-dir>
# Scans all .md posts and reports frontmatter issues grouped by type.

BLOG_DIR="${1:-./src/content/blog}"

if [ ! -d "$BLOG_DIR" ]; then
  echo "Error: directory not found: $BLOG_DIR"
  exit 1
fi

declare -a MISSING_KEYWORD=()
declare -a EMPTY_HERO=()
declare -a MISSING_HERO=()
declare -a MISSING_TAGS=()
declare -a SHORT_DESC=()
declare -a MISSING_DESC=()
declare -a BAD_TITLE=()

for file in "$BLOG_DIR"/*.md; do
  slug=$(basename "$file" .md)

  # Extract frontmatter block
  fm=$(awk '/^---/{c++; if(c==2) exit} c==1' "$file")

  # keyword
  kw=$(echo "$fm" | grep -E '^keyword:' | sed 's/keyword: *//')
  if [ -z "$kw" ]; then
    MISSING_KEYWORD+=("$slug")
  fi

  # heroImage
  hero=$(echo "$fm" | grep -E '^heroImage:' | sed 's/heroImage: *//')
  if [ -z "$hero" ]; then
    # check if field exists at all
    if echo "$fm" | grep -q '^heroImage:'; then
      EMPTY_HERO+=("$slug")
    else
      MISSING_HERO+=("$slug")
    fi
  elif [ "$hero" = '""' ] || [ "$hero" = "''" ]; then
    EMPTY_HERO+=("$slug")
  fi

  # tags
  if ! echo "$fm" | grep -q '^tags:'; then
    MISSING_TAGS+=("$slug")
  fi

  # description
  desc=$(echo "$fm" | grep -E '^description:' | sed 's/description: *//' | tr -d '"')
  if [ -z "$desc" ]; then
    MISSING_DESC+=("$slug")
  elif [ ${#desc} -lt 50 ]; then
    SHORT_DESC+=("$slug ($desc)")
  fi

  # title format — only enforce on code/tech posts
  category=$(echo "$fm" | grep -E '^category:' | sed 's/category: *//' | tr -d '"')
  if [[ "$category" == "code" || "$category" == "tech" ]]; then
    title=$(echo "$fm" | grep -E '^title:' | sed 's/title: *//' | tr -d '"')
    if ! echo "$title" | grep -qE '.+:.+'; then
      BAD_TITLE+=("$slug")
    fi
  fi
done

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
echo "  magerblog SEO Audit Report"
echo "  $(date '+%Y-%m-%d %H:%M')"
echo "  Dir: $BLOG_DIR"
echo "==============================="

print_section "Missing keyword field" "${MISSING_KEYWORD[@]}"
print_section "Empty heroImage" "${EMPTY_HERO[@]}"
print_section "Missing heroImage field" "${MISSING_HERO[@]}"
print_section "Missing tags" "${MISSING_TAGS[@]}"
print_section "Missing description" "${MISSING_DESC[@]}"
print_section "Description too short (<50 chars)" "${SHORT_DESC[@]}"
print_section "Title missing colon format" "${BAD_TITLE[@]}"

echo ""
total=$((${#MISSING_KEYWORD[@]} + ${#EMPTY_HERO[@]} + ${#MISSING_HERO[@]} + ${#MISSING_TAGS[@]} + ${#MISSING_DESC[@]} + ${#SHORT_DESC[@]} + ${#BAD_TITLE[@]}))
echo "Total issues: $total"
echo ""
