import { ansiToHtml } from '../../utils/ansi.js';

function AnsiText({ text, defaultColor, className = '' }) {
  const html = ansiToHtml(text || '', defaultColor);
  return (
    <div
      className={`font-mono whitespace-pre-wrap break-words ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

export default AnsiText;
