import DOMPurify from 'dompurify';

interface RichTextDisplayProps {
  content: string;
  className?: string;
}

// Configure DOMPurify to allow safe HTML and open links in new tabs
const purifyConfig = {
  ALLOWED_TAGS: [
    'p', 'br', 'strong', 'b', 'em', 'i', 'u', 's', 'del',
    'h1', 'h2', 'h3', 'h4',
    'ul', 'ol', 'li',
    'blockquote', 'pre', 'code',
    'a', 'img', 'hr',
    'table', 'thead', 'tbody', 'tr', 'th', 'td',
    'span', 'div', 'sub', 'sup',
  ],
  ALLOWED_ATTR: [
    'href', 'target', 'rel', 'src', 'alt', 'width', 'height',
    'class', 'style', 'colspan', 'rowspan',
  ],
  ADD_ATTR: ['target'],
};

// After sanitization, ensure links open in new tab
DOMPurify.addHook('afterSanitizeAttributes', (node) => {
  if (node.tagName === 'A') {
    node.setAttribute('target', '_blank');
    node.setAttribute('rel', 'noopener noreferrer');
  }
});

/**
 * Detects whether a stored value is TipTap HTML or legacy plain text.
 *
 * Fields that predate the rich-text editors (session notes, character notes,
 * campaign descriptions…) hold plain text with real `\n` line breaks. Rendering
 * those as HTML silently collapses every newline into a space, so they need the
 * `whitespace-pre-wrap` path instead.
 *
 * Requires a real opening tag — `<name …>` — so prose containing a bare `<`
 * ("damage < 10", "a<b") is correctly treated as plain text.
 */
const HTML_TAG_RE =
  /<(?:p|br|h[1-6]|ul|ol|li|blockquote|pre|code|a|img|hr|table|thead|tbody|tr|th|td|span|div|strong|b|em|i|u|s|del|sub|sup)\b[^>]*>/i;

export function looksLikeHtml(value: string): boolean {
  return HTML_TAG_RE.test(value);
}

/**
 * True when a rich-text field holds something worth rendering. TipTap saves an
 * emptied field as `<p></p>` (and `<p><br></p>`), which is truthy as a string —
 * so callers must use this rather than a bare `!!value` when deciding whether
 * to show a section header, expand affordance, etc.
 */
export function hasRichTextContent(value: string | null | undefined): boolean {
  if (!value) return false;
  // Images, rules and tables are content in their own right, even with no text
  if (/<(?:img|hr|table)\b/i.test(value)) return true;
  return value.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim().length > 0;
}

export function RichTextDisplay({ content, className = '' }: RichTextDisplayProps) {
  if (!hasRichTextContent(content)) {
    return <p className="text-stone-400 text-sm italic">No content.</p>;
  }

  // Legacy plain text — render as-is, preserving its line breaks. React escapes
  // the string, so this path can't inject markup.
  if (!looksLikeHtml(content)) {
    return <p className={`whitespace-pre-wrap ${className}`}>{content}</p>;
  }

  const sanitized = DOMPurify.sanitize(content, purifyConfig);

  return (
    <div
      className={`rich-text-content ${className}`}
      dangerouslySetInnerHTML={{ __html: sanitized }}
    />
  );
}
