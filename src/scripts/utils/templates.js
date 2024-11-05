export function generateMaskImageTemplate(imageUrl, index = 0) {
  if (!imageUrl) {
    return `
      <img src="images/placeholder-image.jpg" alt="Placeholder">
    `;
  }

  return `
    <img src="${imageUrl}" alt="Tangkapan Gambar ${index + 1}">
  `;
}
