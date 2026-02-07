import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import MarkdownRenderer from './MarkdownRenderer';

describe('MarkdownRenderer', () => {
  it('should render plain text', () => {
    render(<MarkdownRenderer content="Hello World" />);
    expect(screen.getByText('Hello World')).toBeInTheDocument();
  });

  it('should render bold text', () => {
    render(<MarkdownRenderer content="**Bold Text**" />);
    const bold = screen.getByText('Bold Text');
    expect(bold.tagName).toBe('STRONG');
  });

  it('should render italic text', () => {
    render(<MarkdownRenderer content="*Italic Text*" />);
    const italic = screen.getByText('Italic Text');
    expect(italic.tagName).toBe('EM');
  });

  it('should render links', () => {
    render(<MarkdownRenderer content="[Reddit](https://reddit.com)" />);
    const link = screen.getByRole('link', { name: 'Reddit' });
    expect(link).toHaveAttribute('href', 'https://reddit.com');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('should render code blocks', () => {
    const codeContent = `\`\`\`js
const x = 1;
\`\`\``;
    render(<MarkdownRenderer content={codeContent} />);
    const code = screen.getByText('const x = 1;');
    expect(code.tagName).toBe('CODE');
  });

  it('should render inline code', () => {
    render(<MarkdownRenderer content="Use `console.log()` for debugging" />);
    const code = screen.getByText('console.log()');
    expect(code.tagName).toBe('CODE');
  });

  it('should render ordered lists', () => {
    render(
      <MarkdownRenderer
        content={`1. First item\n2. Second item\n3. Third item`}
      />
    );
    const list = screen.getByRole('list');
    expect(list.tagName).toBe('OL');
    expect(screen.getByText('First item')).toBeInTheDocument();
    expect(screen.getByText('Second item')).toBeInTheDocument();
    expect(screen.getByText('Third item')).toBeInTheDocument();
  });

  it('should render unordered lists', () => {
    render(
      <MarkdownRenderer
        content={`- First item\n- Second item\n- Third item`}
      />
    );
    const list = screen.getByRole('list');
    expect(list.tagName).toBe('UL');
    expect(screen.getByText('First item')).toBeInTheDocument();
  });

  it('should render blockquotes', () => {
    render(<MarkdownRenderer content="> This is a quote" />);
    const blockquote = screen.getByText('This is a quote').parentElement;
    expect(blockquote.tagName).toBe('BLOCKQUOTE');
  });

  it('should render headings', () => {
    const content = `# Heading 1
## Heading 2`;
    render(<MarkdownRenderer content={content} />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Heading 1');
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Heading 2');
  });

  it('should sanitize dangerous HTML', () => {
    // rehype-sanitize strips dangerous HTML tags and attributes
    // Test 1: Normal markdown works fine
    render(<MarkdownRenderer content="Safe text **bold**" />);
    expect(screen.getByText('Safe text')).toBeInTheDocument();
    expect(screen.getByText('bold')).toBeInTheDocument();
    
    // Test 2: Dangerous HTML elements are completely removed
    const { container } =  render(<MarkdownRenderer content="Text with <script>alert('xss')</script> inline script" />);
    // Script tag and all dangerous attributes are removed
    expect(container.querySelector('script')).not.toBeInTheDocument();
    expect(container.querySelector('[onclick]')).not.toBeInTheDocument();
  });

  it('should render strikethrough with GFM', () => {
    render(<MarkdownRenderer content="~~Strikethrough~~" />);
    const del = screen.getByText('Strikethrough');
    expect(del.tagName).toBe('DEL');
  });

  it('should render tables with GFM', () => {
    const tableMarkdown = `| Header 1 | Header 2 |
|----------|----------|
| Cell 1   | Cell 2   |`;
    
    render(<MarkdownRenderer content={tableMarkdown} />);
    expect(screen.getByRole('table')).toBeInTheDocument();
    expect(screen.getByText('Header 1')).toBeInTheDocument();
    expect(screen.getByText('Cell 1')).toBeInTheDocument();
  });

  it('should handle empty content', () => {
    render(<MarkdownRenderer content="" />);
    expect(screen.queryByText(/.+/)).not.toBeInTheDocument();
  });

  it('should handle null content', () => {
    render(<MarkdownRenderer content={null} />);
    expect(screen.queryByText(/.+/)).not.toBeInTheDocument();
  });

  it('should apply custom className', () => {
    const { container } = render(
      <MarkdownRenderer content="Test" className="custom-class" />
    );
    expect(container.firstChild).toHaveClass('custom-class');
  });
});
