/**
 * Normalizes any image Data URL (including SVG samples and large camera photos)
 * into a clean raster PNG/JPEG Data URL suitable for vision AI analysis.
 */
export async function prepareImageForAnalysis(dataUrl: string): Promise<{
  uploadDataUrl: string;
  previewDataUrl: string;
}> {
  if (!dataUrl || typeof window === 'undefined') {
    return { uploadDataUrl: dataUrl, previewDataUrl: dataUrl };
  }

  const isSvg = dataUrl.startsWith('data:image/svg+xml');

  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      try {
        const maxDimension = 1024;
        let width = img.naturalWidth || 512;
        let height = img.naturalHeight || 512;

        if (width > maxDimension || height > maxDimension) {
          if (width >= height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          resolve({ uploadDataUrl: dataUrl, previewDataUrl: dataUrl });
          return;
        }

        // Fill light background for transparent PNGs/SVGs so objects remain clear
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);

        const uploadDataUrl = isSvg
          ? canvas.toDataURL('image/png')
          : canvas.toDataURL('image/jpeg', 0.88);

        resolve({
          uploadDataUrl,
          previewDataUrl: dataUrl,
        });
      } catch {
        resolve({ uploadDataUrl: dataUrl, previewDataUrl: dataUrl });
      }
    };

    img.onerror = () => {
      resolve({ uploadDataUrl: dataUrl, previewDataUrl: dataUrl });
    };

    img.src = dataUrl;
  });
}
