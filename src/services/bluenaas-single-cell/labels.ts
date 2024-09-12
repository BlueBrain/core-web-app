/* eslint-disable no-param-reassign */
import { Camera, Object3D, Scene, Vector3 } from 'three';

import { RecordLocation } from '@/types/simulation/single-neuron';
import { getSimulationColor } from '@/constants/simulate/single-neuron';

interface LabelToDraw {
  /**
   * This is the index of the item in the original list.
   * We will use it to set a color to the label.
   */
  index: number;
  tipX: number;
  tipY: number;
  boxX: number;
  boxY: number;
  boxW: number;
  text: string;
  object: Object3D;
}

export interface LabelsOptions {
  margin: number;
  padding: number;
  backColor: string;
  fontSize: number;
  bulletRadius: number;
}

/**
 * This class is responsible of displaying labels for Recordings and Injections.
 *
 * For better clarity and to avoid labels overlapping, we divide the screen
 * in four parts: topLeft, topRight, bottomLeft and bottomRight.
 * Then we distribute the lables in these regions evenly.
 */
export class Labels {
  private _canvas: HTMLCanvasElement | null = null;

  private labelsToDraw: LabelToDraw[] = [];

  private requestAnimationFrameId = 0;

  private readonly observer: ResizeObserver;

  private readonly options: LabelsOptions;

  constructor(
    private readonly getRendererEnvironment: () => { scene: Scene; camera: Camera },
    options: Partial<LabelsOptions> = {}
  ) {
    this.observer = new ResizeObserver(this.paint);
    this.options = {
      margin: 8,
      padding: 8,
      backColor: '#000a',
      fontSize: 14,
      bulletRadius: 8,
      ...options,
    };
  }

  get canvas() {
    return this._canvas;
  }

  set canvas(canvas: HTMLCanvasElement | null) {
    if (this._canvas) this.observer.unobserve(this._canvas);
    this._canvas = canvas;
    if (canvas) this.observer.observe(canvas);
  }

  update(labels: RecordLocation[]) {
    const { scene } = this.getRendererEnvironment();
    if (!scene) return;

    const objects = new Map<string, Object3D>();
    const fringe = scene.children.filter((obj) => obj.type === 'Object3D');
    while (fringe.length > 0) {
      const obj = fringe.pop();
      if (!obj) continue;

      if (obj.children.length === 0) {
        if (obj.name) {
          objects.set(obj.name, obj);
        }
      } else {
        obj.children.forEach((item) => fringe.push(item));
      }
    }
    this.labelsToDraw = [];
    for (const label of labels) {
      const name = `${label.section}_0`;
      const obj = objects.get(name);
      if (!obj) continue;

      this.labelsToDraw.push({
        index: this.labelsToDraw.length,
        tipX: 0,
        tipY: 0,
        boxX: 0,
        boxY: 0,
        boxW: 0,
        text: label.section,
        object: obj,
      });
    }
    this.paint();
  }

  public readonly paint = () => {
    window.cancelAnimationFrame(this.requestAnimationFrameId);
    this.requestAnimationFrameId = window.requestAnimationFrame(this.actualPaint);
  };

  private readonly actualPaint = () => {
    const { canvas } = this;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { camera } = this.getRendererEnvironment();
    const { fontSize, padding, margin } = this.options;

    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    const toX = (x: number) => 0.5 * w * (x + 1);
    const toY = (y: number) => 0.5 * h * (1 - y);
    canvas.width = w;
    canvas.height = h;
    ctx.font = `bold ${fontSize}px sans-serif`;
    ctx.textBaseline = 'middle';

    this.labelsToDraw.forEach((label) => {
      const pos = getCoords2D(label.object, camera);
      label.tipX = pos.x;
      label.tipY = pos.y;
    });
    const { topRight, bottomRight, topLeft, bottomLeft } = this.scatterLabelsPerRegion(
      ctx,
      toX,
      toY,
      w
    );
    const halfH = h * 0.5;
    computeBoxY(halfH, topLeft, topRight, bottomLeft, bottomRight);
    const allLabels = [...topLeft, ...topRight, ...bottomLeft, ...bottomRight];
    ctx.clearRect(0, 0, w, h);
    const center = w * 0.5;
    paintLabelsArrows(ctx, allLabels, center, this.options);
    ctx.fillStyle = '#000';
    for (const label of allLabels) {
      const x = label.boxX > center ? label.boxX : margin;
      ctx.fillText(label.text, x + padding, label.boxY);
    }
  };

  private scatterLabelsPerRegion(
    ctx: CanvasRenderingContext2D,
    toX: (x: number) => number,
    toY: (y: number) => number,
    w: number
  ) {
    const { padding, margin } = this.options;
    const topRight: LabelToDraw[] = [];
    const bottomRight: LabelToDraw[] = [];
    const topLeft: LabelToDraw[] = [];
    const bottomLeft: LabelToDraw[] = [];
    this.labelsToDraw.sort(sortLabels);
    this.labelsToDraw.forEach((label) => {
      const newLabel = { ...label };
      const measure = ctx.measureText(label.text);
      newLabel.tipX = toX(label.tipX);
      newLabel.tipY = toY(label.tipY);
      newLabel.boxW = 2 * padding + measure.width;
      if (label.tipX > 0) {
        newLabel.boxX = w - margin - newLabel.boxW;
        if (label.tipY > 0) topRight.push(newLabel);
        else bottomRight.push(newLabel);
      } else {
        newLabel.boxX = margin + newLabel.boxW;
        if (label.tipY > 0) topLeft.push(newLabel);
        else bottomLeft.push(newLabel);
      }
    });
    return {
      topRight,
      bottomRight,
      topLeft,
      bottomLeft,
    };
  }
}

function computeBoxY(
  halfH: number,
  topLeft: LabelToDraw[],
  topRight: LabelToDraw[],
  bottomLeft: LabelToDraw[],
  bottomRight: LabelToDraw[]
) {
  topLeft.forEach((label, index) => {
    label.boxY = 0.5 + Math.round((halfH * (index + 1)) / (topLeft.length + 1));
  });
  topRight.forEach((label, index) => {
    label.boxY = 0.5 + Math.round((halfH * (index + 1)) / (topRight.length + 1));
  });
  bottomLeft.forEach((label, index) => {
    label.boxY = 0.5 + Math.round(halfH + (halfH * (index + 1)) / (bottomLeft.length + 1));
  });
  bottomRight.forEach((label, index) => {
    label.boxY = 0.5 + Math.round(halfH + (halfH * (index + 1)) / (bottomRight.length + 1));
  });
}

function paintLabelsArrows(
  ctx: CanvasRenderingContext2D,
  allLabels: LabelToDraw[],
  center: number,
  { backColor, bulletRadius, margin, fontSize }: LabelsOptions
) {
  ctx.strokeStyle = backColor;
  ctx.fillStyle = backColor;
  ctx.lineWidth = 3;
  for (const label of allLabels) {
    ctx.beginPath();
    ctx.ellipse(label.tipX, label.tipY, bulletRadius, bulletRadius, 0, 0, 2 * Math.PI);
    ctx.fill();
    ctx.moveTo(label.tipX, label.tipY);
    ctx.lineTo(label.boxX, label.boxY);
    ctx.stroke();
    const x = label.boxX > center ? label.boxX : margin;
    ctx.rect(x, label.boxY - fontSize, label.boxW, 2 * fontSize);
    ctx.fill();
  }
  ctx.lineWidth = 1;
  for (const label of allLabels) {
    const foreColor = getSimulationColor(label.index);
    ctx.strokeStyle = foreColor;
    ctx.fillStyle = foreColor;
    ctx.beginPath();
    ctx.ellipse(label.tipX, label.tipY, bulletRadius, bulletRadius, 0, 0, 2 * Math.PI);
    ctx.fill();
    ctx.moveTo(label.tipX, label.tipY);
    ctx.lineTo(label.boxX, label.boxY);
    ctx.stroke();
    const x = label.boxX > center ? label.boxX : margin;
    ctx.rect(x, label.boxY - fontSize, label.boxW, 2 * fontSize);
    ctx.fill();
  }
}

function getCoords2D(object: Object3D, camera: Camera) {
  const position = new Vector3();
  object.getWorldPosition(position);
  const screenSpace = position.project(camera);
  return {
    x: screenSpace.x,
    y: screenSpace.y,
  };
}

function sortLabels(label1: LabelToDraw, label2: LabelToDraw) {
  return label2.tipY - label1.tipY;
}
