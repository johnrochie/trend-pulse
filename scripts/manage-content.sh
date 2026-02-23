#!/bin/bash

# Content Management Script for Trend Pulse
# Simple CLI for managing site content

CONTENT_DIR="content"
PAGES_DIR="$CONTENT_DIR/pages"
CONFIG_DIR="$CONTENT_DIR/config"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[+]${NC} $1"
}

print_error() {
    echo -e "${RED}[!]${NC} $1"
}

print_info() {
    echo -e "${BLUE}[i]${NC} $1"
}

# Function to list all pages
list_pages() {
    echo -e "${YELLOW}=== Available Pages ===${NC}"
    for file in "$PAGES_DIR"/*.md; do
        if [ -f "$file" ]; then
            title=$(grep -m1 '^title:' "$file" | cut -d'"' -f2)
            slug=$(grep -m1 '^slug:' "$file" | awk '{print $2}')
            echo "  $(basename "$file")"
            echo "    Title: $title"
            echo "    Slug: $slug"
            echo "    URL: http://localhost:4002/$slug"
            echo ""
        fi
    done
}

# Function to create a new page
create_page() {
    if [ -z "$1" ]; then
        read -p "Enter page slug (e.g., 'faq'): " slug
    else
        slug="$1"
    fi
    
    if [ -z "$slug" ]; then
        print_error "Slug cannot be empty"
        exit 1
    fi
    
    filename="$PAGES_DIR/$slug.md"
    
    if [ -f "$filename" ]; then
        print_error "Page '$slug' already exists"
        exit 1
    fi
    
    read -p "Enter page title: " title
    read -p "Enter page description: " description
    
    # Get next order number
    max_order=0
    for file in "$PAGES_DIR"/*.md; do
        if [ -f "$file" ]; then
            order=$(grep -m1 '^order:' "$file" | awk '{print $2}')
            if [ ! -z "$order" ] && [ "$order" -gt "$max_order" ]; then
                max_order=$order
            fi
        fi
    done
    next_order=$((max_order + 1))
    
    # Create the page
    cat > "$filename" << EOF
---
title: "$title"
description: "$description"
slug: "$slug"
order: $next_order
---

# $title

Start writing your content here...

## Section 1

Your content goes here.

## Section 2

More content...

---

*Last updated: $(date +"%B %Y")*
EOF
    
    print_status "Created page: $filename"
    print_info "Edit the file: nano $filename"
    print_info "View at: http://localhost:4002/$slug"
}

# Function to edit a page
edit_page() {
    if [ -z "$1" ]; then
        list_pages
        read -p "Enter page slug to edit: " slug
    else
        slug="$1"
    fi
    
    filename="$PAGES_DIR/$slug.md"
    
    if [ ! -f "$filename" ]; then
        print_error "Page '$slug' not found"
        exit 1
    fi
    
    print_info "Editing: $filename"
    nano "$filename"
    
    print_status "Page updated: $slug"
}

# Function to delete a page
delete_page() {
    if [ -z "$1" ]; then
        list_pages
        read -p "Enter page slug to delete: " slug
    else
        slug="$1"
    fi
    
    filename="$PAGES_DIR/$slug.md"
    
    if [ ! -f "$filename" ]; then
        print_error "Page '$slug' not found"
        exit 1
    fi
    
    read -p "Are you sure you want to delete '$slug'? (y/n): " confirm
    if [ "$confirm" = "y" ] || [ "$confirm" = "Y" ]; then
        rm "$filename"
        print_status "Deleted page: $slug"
    else
        print_info "Deletion cancelled"
    fi
}

# Function to view site config
view_config() {
    echo -e "${YELLOW}=== Site Configuration ===${NC}"
    if [ -f "$CONFIG_DIR/site.json" ]; then
        cat "$CONFIG_DIR/site.json" | python3 -m json.tool 2>/dev/null || cat "$CONFIG_DIR/site.json"
    else
        print_error "Config file not found: $CONFIG_DIR/site.json"
    fi
}

# Function to edit site config
edit_config() {
    if [ -f "$CONFIG_DIR/site.json" ]; then
        print_info "Editing site configuration"
        nano "$CONFIG_DIR/site.json"
        print_status "Configuration updated"
    else
        print_error "Config file not found"
    fi
}

# Function to check content status
check_status() {
    echo -e "${YELLOW}=== Content Status ===${NC}"
    
    # Count pages
    page_count=$(ls -1 "$PAGES_DIR"/*.md 2>/dev/null | wc -l)
    echo "Pages: $page_count"
    
    # List pages
    for file in "$PAGES_DIR"/*.md; do
        if [ -f "$file" ]; then
            slug=$(grep -m1 '^slug:' "$file" | awk '{print $2}')
            echo "  - $slug"
        fi
    done
    
    # Check API
    echo -e "\n${YELLOW}=== API Status ===${NC}"
    if curl -s http://localhost:4002/api/pages?list=true > /dev/null; then
        echo "API: ✅ Running"
    else
        echo "API: ❌ Not responding"
    fi
}

# Function to show help
show_help() {
    echo -e "${YELLOW}=== Trend Pulse Content Manager ===${NC}"
    echo ""
    echo "Usage: ./manage-content.sh [command]"
    echo ""
    echo "Commands:"
    echo "  list              List all pages"
    echo "  create [slug]     Create a new page"
    echo "  edit [slug]       Edit a page"
    echo "  delete [slug]     Delete a page"
    echo "  config            View site configuration"
    echo "  edit-config       Edit site configuration"
    echo "  status            Check content status"
    echo "  help              Show this help"
    echo ""
    echo "Examples:"
    echo "  ./manage-content.sh list"
    echo "  ./manage-content.sh create faq"
    echo "  ./manage-content.sh edit about"
    echo ""
}

# Main script logic
case "$1" in
    "list")
        list_pages
        ;;
    "create")
        create_page "$2"
        ;;
    "edit")
        edit_page "$2"
        ;;
    "delete")
        delete_page "$2"
        ;;
    "config")
        view_config
        ;;
    "edit-config")
        edit_config
        ;;
    "status")
        check_status
        ;;
    "help"|"")
        show_help
        ;;
    *)
        print_error "Unknown command: $1"
        show_help
        exit 1
        ;;
esac