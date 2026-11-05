// Flood-fills flat backgrounds to transparency so sprite sheets can sit on the
// painted scene. Interior regions enclosed by outlines are preserved.
// opts.diag: also spread through diagonal neighbors (checkerboard backgrounds)
// opts.global: key the colors anywhere in the image (bordered art like icon packs)
export function keyImage(img, tol = 42, extraKeys = [], opts = {}) {
  const w = img.width, h = img.height;
  const c = document.createElement('canvas');
  c.width = w; c.height = h;
  const x = c.getContext('2d', { willReadFrequently: true });
  x.drawImage(img, 0, 0);
  const data = x.getImageData(0, 0, w, h);
  const px = data.data;
  const bg = [px[0], px[1], px[2]];
  const keys = [bg, ...extraKeys];
  const match = i => keys.some(k =>
    Math.abs(px[i] - k[0]) <= tol &&
    Math.abs(px[i + 1] - k[1]) <= tol &&
    Math.abs(px[i + 2] - k[2]) <= tol);

  if (opts.global) {
    for (let i = 0; i < px.length; i += 4) if (match(i)) px[i + 3] = 0;
    x.putImageData(data, 0, 0);
    return c;
  }

  const seen = new Uint8Array(w * h);
  const stack = [];
  for (let i = 0; i < w; i++) stack.push(i, (h - 1) * w + i);
  for (let j = 0; j < h; j++) stack.push(j * w, j * w + w - 1);
  while (stack.length) {
    const p = stack.pop();
    if (seen[p]) continue;
    seen[p] = 1;
    const i = p * 4;
    if (!match(i)) continue;
    px[i + 3] = 0;
    const cx = p % w, cy = (p / w) | 0;
    if (cx > 0) stack.push(p - 1);
    if (cx < w - 1) stack.push(p + 1);
    if (cy > 0) stack.push(p - w);
    if (cy < h - 1) stack.push(p + w);
    if (opts.diag) {
      if (cx > 0 && cy > 0) stack.push(p - w - 1);
      if (cx < w - 1 && cy > 0) stack.push(p - w + 1);
      if (cx > 0 && cy < h - 1) stack.push(p + w - 1);
      if (cx < w - 1 && cy < h - 1) stack.push(p + w + 1);
    }
  }
  x.putImageData(data, 0, 0);
  return c;
}
