import { TEXT_FORMATS, OUTPUT_FORMATS } from './constants.js';

export function b64toBlob(base64Data, contentType) {
  const byteCharacters = atob(base64Data);
  const byteArrays = [];
  for (let offset = 0; offset < byteCharacters.length; offset += 512) {
    const slice = byteCharacters.slice(offset, offset + 512);
    const byteNumbers = Array.from(slice).map((ch) => ch.charCodeAt(0));
    byteArrays.push(new Uint8Array(byteNumbers));
  }
  return new Blob(byteArrays, { type: contentType });
}

export function handleDownload({ diagram, mimeType, outputFormat, filenameFallback }) {
  if (!diagram || !mimeType) return;
  const ext = (outputFormat || '').toLowerCase();
  let blob;

  // Check if format is text-based (not base64 encoded)
  const isText = TEXT_FORMATS.includes(ext);
  if (isText) {
    blob = new Blob([diagram], { type: mimeType || 'application/octet-stream' });
  } else {
    blob = b64toBlob(diagram, mimeType);
  }

  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filenameFallback || `diagram.${ext || OUTPUT_FORMATS.PNG}`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
