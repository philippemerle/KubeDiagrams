const COLOR_MAP = {
  30: 'black',
  31: 'red',
  32: 'green',
  33: 'orange',
  34: 'blue',
  35: 'magenta',
  36: 'cyan',
  37: 'white',
  90: 'gray',
  91: 'red',
  92: 'green',
  93: 'orange',
  94: 'blue',
  95: 'magenta',
  96: 'cyan',
  97: 'white',
};

function escapeHtml(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

export function ansiToHtml(input, defaultColor = null) {
  if (!input) return '';

  const parts = String(input).split(/\x1b\[/);
  let html = '';
  let openSpans = 0;

  const closeAll = () => {
    while (openSpans-- > 0) html += '</span>';
    openSpans = 0;
  };

  html += escapeHtml(parts.shift() || '');

  for (const chunk of parts) {
    const m = chunk.match(/^([0-9;]+)m([\s\S]*)$/);
    if (!m) {
      html += escapeHtml(chunk);
      continue;
    }
    const codes = m[1].split(';').map(Number);
    const text = m[2];

    for (const code of codes) {
      if (code === 0) {
        closeAll();
      } else if (code === 1) {
        html += `<span style="font-weight:bold">`;
        openSpans++;
      } else if (COLOR_MAP[code]) {
        html += `<span style="color:${COLOR_MAP[code]}">`;
        openSpans++;
      }
    }
    html += escapeHtml(text);
  }

  closeAll();

  if (defaultColor && !/\x1b\[[0-9;]*m/.test(String(input))) {
    return `<span style="color:${defaultColor}">${html}</span>`;
  }
  return html;
}
