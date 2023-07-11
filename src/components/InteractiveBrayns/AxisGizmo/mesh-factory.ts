import { CanvasTexture, DoubleSide, Mesh, MeshBasicMaterial, PlaneGeometry } from 'three';

const TEXTURE_SIZE = 128;
const MESH_RADIUS = 0.5;
const TIP_RADIUS = 0.6;

const GEOMETRY = new PlaneGeometry(MESH_RADIUS, MESH_RADIUS);
const RED = '#f33';
const GREEN = '#0e0';
const BLUE = '#08f';

export function makePosX() {
  const tex = makeTexturePos(RED, 'X');
  const mesh = new Mesh(
    GEOMETRY,
    new MeshBasicMaterial({
      side: DoubleSide,
      map: tex,
      transparent: true,
      alphaTest: 0.1,
    })
  );
  mesh.position.set(1, 0, 0);
  mesh.name = 'X+';
  return mesh;
}

export function makePosY() {
  const tex = makeTexturePos(GREEN, 'Y');
  const mesh = new Mesh(
    GEOMETRY,
    new MeshBasicMaterial({
      side: DoubleSide,
      map: tex,
      transparent: true,
      alphaTest: 0.1,
    })
  );
  mesh.position.set(0, 1, 0);
  mesh.name = 'Y+';
  return mesh;
}

export function makePosZ() {
  const tex = makeTexturePos(BLUE, 'Z');
  const mesh = new Mesh(
    GEOMETRY,
    new MeshBasicMaterial({
      side: DoubleSide,
      map: tex,
      transparent: true,
      alphaTest: 0.1,
    })
  );
  mesh.position.set(0, 0, 1);
  mesh.name = 'Z+';
  return mesh;
}

export function makeNegX() {
  const tex = makeTextureNeg(RED);
  const mesh = new Mesh(
    GEOMETRY,
    new MeshBasicMaterial({
      side: DoubleSide,
      map: tex,
      transparent: true,
      alphaTest: 0.1,
    })
  );
  // eslint-disable-next-line no-magic-numbers
  mesh.position.set(-1, 0, 0);
  mesh.name = 'X-';
  return mesh;
}

export function makeNegY() {
  const tex = makeTextureNeg(GREEN);
  const mesh = new Mesh(
    GEOMETRY,
    new MeshBasicMaterial({
      side: DoubleSide,
      map: tex,
      transparent: true,
      alphaTest: 0.1,
    })
  );
  // eslint-disable-next-line no-magic-numbers
  mesh.position.set(0, -1, 0);
  mesh.name = 'Y-';
  return mesh;
}

export function makeNegZ() {
  const tex = makeTextureNeg(BLUE);
  const mesh = new Mesh(
    GEOMETRY,
    new MeshBasicMaterial({
      side: DoubleSide,
      map: tex,
      transparent: true,
      alphaTest: 0.1,
    })
  );
  // eslint-disable-next-line no-magic-numbers
  mesh.position.set(0, 0, -1);
  mesh.name = 'Z-';
  return mesh;
}

function makeTexturePos(color: string, label?: string): CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = TEXTURE_SIZE;
  canvas.height = TEXTURE_SIZE;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw Error('Unable to get Canvas 2D context!');

  ctx.imageSmoothingQuality = 'high';
  ctx.fillStyle = color;
  ctx.strokeStyle = '#000';
  ctx.lineWidth = 2;
  const x = 0.5 * TEXTURE_SIZE;
  const y = 0.5 * TEXTURE_SIZE;
  const radius = Math.floor(0.5 * TEXTURE_SIZE) - 1;
  ctx.beginPath();
  ctx.ellipse(x, y, radius, radius, 0, 0, 2 * Math.PI);
  ctx.stroke();
  ctx.fill();
  if (label) {
    const size = TEXTURE_SIZE * TIP_RADIUS;
    ctx.font = `${size}px sans-serif`;
    ctx.textBaseline = 'middle';
    const metrics = ctx.measureText(label);
    ctx.fillStyle = '#000e';
    const TEXT_ASJUST = 1.1;
    ctx.fillText(label, 0.5 * (TEXTURE_SIZE - metrics.width), 0.5 * (TEXT_ASJUST * TEXTURE_SIZE));
  }

  const tex = new CanvasTexture(canvas);
  return tex;
}

function makeTextureNeg(color: string): CanvasTexture {
  const SIZE = 32;
  const canvas = document.createElement('canvas');
  canvas.width = SIZE;
  canvas.height = SIZE;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw Error('Unable to get Canvas 2D context!');

  ctx.imageSmoothingQuality = 'high';
  const x = 0.5 * SIZE;
  const y = 0.5 * SIZE;
  const radius = Math.floor(0.5 * (TIP_RADIUS * SIZE)) - 1;
  ctx.beginPath();
  ctx.lineWidth = 8;
  ctx.ellipse(x, y, radius, radius, 0, 0, 2 * Math.PI);
  ctx.strokeStyle = '#000';
  ctx.stroke();
  ctx.lineWidth = 6;
  ctx.strokeStyle = color;
  ctx.stroke();

  const tex = new CanvasTexture(canvas);
  return tex;
}
