# Markdown text-style reference

This file compares semantic text styles that do not rely on headings (`#`) or bullet lists (`*`). The exact appearance depends on the site's stylesheet.

## Normal text

Source: `Normal body text.`  
Purpose: regular content.  
Type: standard Markdown.

Normal body text.

## Emphasis and strong text

Source: `*Emphasised text* and **strong text**.`  
Purpose: emphasis and importance.  
Type: standard Markdown.

*Emphasised text* and **strong text**.

## Inline code

Source: ``Use `inline code` for a command or identifier.``  
Purpose: code, commands, and identifiers.  
Type: standard Markdown with theme styling.

Use `inline code` for a command or identifier.

## Blockquote

Source: `> A quoted or secondary note.`  
Purpose: quoted or visually separated secondary content.  
Type: standard Markdown with theme styling.

> A quoted or secondary note.

## Small text

Source: `<small>Smaller secondary text.</small>`  
Purpose: brief secondary or explanatory text.  
Type: standard HTML.

<small>Smaller secondary text.</small>

## Small text in a blockquote

Source: `> <small>A compact secondary note.</small>`  
Purpose: a visually separated note with reduced emphasis.  
Type: standard Markdown and standard HTML with theme styling.

> <small>A compact secondary note.</small>

## Highlighted text

Source: `<mark>Highlighted text</mark>`  
Purpose: draw attention to a relevant passage.  
Type: standard HTML.

<mark>Highlighted text</mark>

## Deleted text

Source: `<del>Outdated text</del>`  
Purpose: show removed or superseded wording.  
Type: standard HTML.

<del>Outdated text</del>

## Subscript and superscript

Source: `CO<sub>2</sub> and m<sup>2</sup>`  
Purpose: scientific notation, formulae, and units.  
Type: standard HTML.

CO<sub>2</sub> and m<sup>2</sup>

## Keyboard input

Source: `<kbd>Ctrl</kbd> + <kbd>C</kbd>`  
Purpose: keyboard keys or user input.  
Type: standard HTML; appearance depends on browser or theme styling.

<kbd>Ctrl</kbd> + <kbd>C</kbd>

## Expandable details

Source:

```html
<details>
  <summary>Read more</summary>
  Additional explanatory text.
</details>
```

Purpose: optional detail that does not interrupt the main text.  
Type: standard HTML with browser behaviour.

<details>
  <summary>Read more</summary>
  Additional explanatory text.
</details>

## Line break and thematic break

Source: `First line.  ` followed by `Second line.`  
Purpose: force a line break without starting a list or heading.  
Type: standard Markdown.

First line.  
Second line.

Source: `---` on its own line.  
Purpose: separate sections with a horizontal rule.  
Type: standard Markdown with theme styling.

---

Text after the thematic break.

## Links

Source: `[Descriptive link text](https://example.com)`  
Purpose: link to another resource.  
Type: standard Markdown with theme styling.

[Descriptive link text](https://example.com)
