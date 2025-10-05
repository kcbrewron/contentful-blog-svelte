# Contentful Rich Text Editor Guide

## Important: Rich Text vs Markdown

Contentful's Rich Text field uses a **WYSIWYG editor**, not raw markdown. You don't type `#`, `##`, `###` - instead, you use the toolbar or keyboard shortcuts.

## How to Add Headings in Contentful

### Method 1: Using the Toolbar
1. Select the text you want to make a heading
2. Click the paragraph dropdown in the toolbar
3. Select "Heading 1", "Heading 2", or "Heading 3"

### Method 2: Keyboard Shortcuts
- **Heading 1**: Type `/h1` or use the format menu
- **Heading 2**: Type `/h2` or use the format menu
- **Heading 3**: Type `/h3` or use the format menu

### Method 3: Slash Commands
1. Type `/` at the beginning of a line
2. Select the heading level from the dropdown

## Text Formatting

### Bold Text
- **Toolbar**: Click the **B** button
- **Keyboard**: `Cmd/Ctrl + B`

### Italic Text
- **Toolbar**: Click the *I* button
- **Keyboard**: `Cmd/Ctrl + I`

### Underline Text
- **Toolbar**: Click the U button
- **Keyboard**: `Cmd/Ctrl + U`

## Lists

### Bulleted List
- **Toolbar**: Click the bullet list icon
- **Keyboard**: `Cmd/Ctrl + Shift + 8`

### Numbered List
- **Toolbar**: Click the numbered list icon
- **Keyboard**: `Cmd/Ctrl + Shift + 7`

## Links

1. Select the text you want to link
2. Click the link icon in the toolbar
3. Enter the URL
4. Click "Insert"

**Keyboard**: `Cmd/Ctrl + K`

## How Content Will Render

When you use the Rich Text editor in Contentful:

- **Heading 1** → Large heading (2.25rem, 800 weight)
- **Heading 2** → Medium heading (1.875rem, 700 weight)
- **Heading 3** → Small heading (1.5rem, 600 weight)
- **Bold** → Strong emphasis
- **Italic** → Emphasis
- **Underline** → Underlined text
- **Links** → Blue, underlined on hover
- **Bulleted lists** → Disc bullets with proper spacing
- **Numbered lists** → Decimal numbers with proper spacing

## Example Rich Text Content

Instead of typing:
```
# This is a heading
## This is a subheading
This is **bold** text
```

In Contentful, you would:
1. Type "This is a heading" and format it as Heading 1
2. Type "This is a subheading" and format it as Heading 2
3. Type "This is bold text" and select "bold" to make it bold

## Tips

- Use headings to structure your content hierarchically
- Don't skip heading levels (e.g., don't go from H1 to H3)
- Use bold for emphasis, not for headings
- Keep lists concise and well-organized
- Test your content in preview mode to see how it will look

## Fields That Support Rich Text

In your blog, these fields use Rich Text:
- **Paragraph Block** → `richContent` field
- **Image Content Block** → `richContent` field

The old `content` fields (plain text) are deprecated and disabled.
