import {
  BufferGeometry,
  CylinderGeometry,
  DoubleSide,
  Group,
  Line,
  LineBasicMaterial,
  LineSegments,
  Mesh,
  MeshLambertMaterial,
  Vector3,
} from 'three';

import { getSegmentColor } from './colors';
import { NeuronSegementInfo } from './renderer-utils';

import { Dendrogram } from '@/services/dendrogram';

export function buildDendrogram(dendrogram: Dendrogram): Group {
  const group = new Group();
  buildDendrogramRecursively(dendrogram, group);
  return group;
}

function buildDendrogramRecursively(dendrogram: Dendrogram, group: Group, x = 0, y = 0) {
  let currentY = y;
  for (let segmentIndex = 0; segmentIndex < dendrogram.segments.length; segmentIndex += 1) {
    const segment = dendrogram.segments[segmentIndex];
    const mesh = createMesh(dendrogram, segmentIndex, x, currentY);
    group.add(mesh);
    currentY += segment.length;
  }
  dendrogram.sections.forEach((child, index) => {
    const nbSections = dendrogram.sections.length;
    const alpha = index / (nbSections - 1) - (nbSections > 1 ? 0.5 : 0);
    console.log(`${index}/${nbSections}  >>  ${alpha}`);
    const childX = x + dendrogram.total_width * alpha;
    buildDendrogramRecursively(child, group, childX, currentY);
    if (x !== childX) group.add(createLine(x, currentY, childX, currentY));
  });
}

function createLine(x1: number, y1: number, x2: number, y2: number) {
  const geometry = new BufferGeometry().setFromPoints([
    new Vector3(x1, y1, 0),
    new Vector3(x2, y2, 0),
  ]);
  const material = new LineBasicMaterial({
    color: 0xffffff,
    linewidth: 0.5,
  });
  return new Line(geometry, material);
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
  mesh.userData = {
    segIdx: 0,
    section: id,
    section_nseg: segmentIndex,
    offset: 0, // sec.neuron_segments_offset[segIdx],
    distance_from_soma: 'Unknown', // sec.segment_distance_from_soma[segIdx].toFixed(2),
  } as NeuronSegementInfo;
  return mesh;
}
