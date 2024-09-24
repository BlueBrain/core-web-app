import { Group } from 'three';

import { getSegmentColor } from '../colors';
import { NeuronSegementInfo } from '../renderer-utils';
import { createLine, createSoma, createSegment } from './create';

import { Dendrogram } from '@/services/dendrogram';

export function buildCircularDendrogram(
  dendrogram: Dendrogram,
  group: Group,
  neuroSegmentInfo: Map<string, NeuronSegementInfo>
) {
  const weights = computeWeights(dendrogram);
  buildCircularDendrogramRecursively(
    dendrogram,
    weights,
    group,
    neuroSegmentInfo,
    0,
    0,
    0,
    2 * Math.PI
  );
}

function buildCircularDendrogramRecursively(
  dendrogram: Dendrogram,
  weights: Map<string, number>,
  group: Group,
  neuroSegmentInfo: Map<string, NeuronSegementInfo>,
  segmentIndex: number,
  radius: number,
  angleMin: number,
  angleMax: number
) {
  const angle = (angleMin + angleMax) / 2;
  const x1 = radius * Math.sin(angle);
  const y1 = radius * Math.cos(angle);
  const segment = dendrogram.segments[segmentIndex];
  if (!segment) {
    const childrenWeights = dendrogram.sections.reduce(
      (accumulator, child) => accumulator + (weights.get(child.name) ?? 0),
      0
    );
    const angleFactors = [0];
    let lastAngleFactor = 0;
    dendrogram.sections.forEach((child) => {
      const angleDelta = (weights.get(child.name) ?? 0) / childrenWeights;
      lastAngleFactor += angleDelta;
      angleFactors.push(lastAngleFactor);
    });
    const computeAngle = (index: number) => angleMin + (angleMax - angleMin) * angleFactors[index]; // index) / dendrogram.sections.length;
    for (let sectionIndex = 0; sectionIndex < dendrogram.sections.length; sectionIndex += 1) {
      const ang1 = computeAngle(sectionIndex);
      const ang2 = computeAngle(sectionIndex + 1);
      const ang = (ang1 + ang2) / 2;
      const x3 = radius * Math.sin(ang);
      const y3 = radius * Math.cos(ang);
      group.add(createLine(x1, y1, x3, y3));
      const child = dendrogram.sections[sectionIndex];
      buildCircularDendrogramRecursively(
        child,
        weights,
        group,
        neuroSegmentInfo,
        0,
        radius,
        ang1,
        ang2
      );
    }
    return;
  }
  const name = `${dendrogram.name}_${segmentIndex}`;
  const userData = neuroSegmentInfo.get(name);
  let nextRadius = 0;
  if (radius === 0) {
    // This is the neuron.
    nextRadius = segment.diam / 2;
    group.add(createSoma(name, userData, nextRadius));
  } else {
    nextRadius = radius + segment.length;
    const x2 = nextRadius * Math.sin(angle);
    const y2 = nextRadius * Math.cos(angle);
    const mesh = createSegment(x1, y1, x2, y2, getSegmentColor(name), segment.diam / 2);
    mesh.name = name;
    if (userData) mesh.userData = userData;
    group.add(mesh);
  }
  buildCircularDendrogramRecursively(
    dendrogram,
    weights,
    group,
    neuroSegmentInfo,
    segmentIndex + 1,
    nextRadius,
    angleMin,
    angleMax
  );
}

function computeWeights(dendrogram: Dendrogram) {
  const weights = new Map<string, number>();
  recursivelyComputeWeights(dendrogram, weights);
  return weights;
}

function recursivelyComputeWeights(dendrogram: Dendrogram, weights: Map<string, number>): number {
  const weight =
    dendrogram.sections.length === 0
      ? 1
      : dendrogram.sections.reduce(
          (accumulator, child) => accumulator + recursivelyComputeWeights(child, weights),
          0
        );
  weights.set(dendrogram.name, weight);
  return weight;
}
