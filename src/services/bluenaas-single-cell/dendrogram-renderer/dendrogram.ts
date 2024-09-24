'use client';

import { CylinderGeometry, DoubleSide, Group, Mesh, MeshLambertMaterial } from 'three';

import { getSegmentColor } from '../colors';
import { NeuronSegementInfo } from '../renderer-utils';

import { buildCircularDendrogram } from './circular';
import { createLine } from './create';

import { Dendrogram } from '@/services/dendrogram';

export function buildDendrogram(
  dendrogram: Dendrogram,
  neuroSegmentInfo: Map<string, NeuronSegementInfo>
): Group {
  const group = new Group();
  buildCircularDendrogram(dendrogram, group, neuroSegmentInfo);
  return group;
}

function buildOrthoDendrogramRecursively(
  dendrogram: Dendrogram,
  group: Group,
  neuroSegmentInfo: Map<string, NeuronSegementInfo>,
  x = 0,
  y = 0
) {
  let currentY = y;
  for (let segmentIndex = 0; segmentIndex < dendrogram.segments.length; segmentIndex += 1) {
    const segment = dendrogram.segments[segmentIndex];
    const mesh = createMesh(dendrogram, segmentIndex, x, currentY);
    const userData = neuroSegmentInfo.get(mesh.name);
    if (userData) mesh.userData = userData;
    else console.error('Not found userData for mesh:', mesh.name);
    group.add(mesh);
    currentY += segment.length;
  }
  dendrogram.sections.forEach((child, index) => {
    const nbSections = dendrogram.sections.length;
    const alpha = index / (nbSections - 1) - (nbSections > 1 ? 0.5 : 0);
    const childX = x + dendrogram.total_width * alpha;
    buildOrthoDendrogramRecursively(child, group, neuroSegmentInfo, childX, currentY);
    if (x !== childX) group.add(createLine(x, currentY, childX, currentY));
  });
}

function createMesh(dendrogram: Dendrogram, segmentIndex: number, x: number, y: number) {
  const segment = dendrogram.segments[segmentIndex];
  const geometry = new CylinderGeometry(segment.diam, segment.diam, segment.length, 6, 1, true);
  const material = new MeshLambertMaterial({
    color: getSegmentColor(dendrogram.name),
    side: DoubleSide,
  });

  const mesh = new Mesh(geometry, material);
  const id = `${dendrogram.name}_${segmentIndex}`;
  mesh.name = id;
  mesh.position.set(x, y + segment.length / 2, 0);
  return mesh;
}
