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

export function RichTextDisplay({ content, className = '' }: RichTextDisplayProps) {
  if (!content || content === '<p></p>') {
    return <p className="text-stone-400 text-sm italic">No content.</p>;
  }

  const sanitized = DOMPurify.sanitize(content, purifyConfig);

  return (
    <div
      className={`rich-text-content ${className}`}
      dangerouslySetInnerHTML={{ __html: sanitized }}
    />
  );
}
