/* eslint-disable @typescript-eslint/no-use-before-define */
import {
  Color as ThreeColor,
  ShaderMaterial as ThreeShaderMaterial,
  FrontSide as ThreeFrontSide,
  CustomBlending as ThreeCustomBlending,
  SrcAlphaFactor as ThreeSrcAlphaFactor,
  OneMinusSrcAlphaFactor as ThreeOneMinusSrcAlphaFactor,
  AddEquation as ThreeAddEquation,
} from 'three';

import VERT from './material.vert';
import FRAG from './material.frag';

export function applyModifierForOpacity(value: number) {
  const result = value ** 0.25;
  return result;
}

export function applyModifierForBrightness(value: number) {
  const result = value;
  return result;
}

export function applyModifierForThickness(value: number) {
  const result = value ** 2;
  return result;
}

export function generateGhostMaterial(
  hexaColor: string,
  opacity: number,
  brightness: number,
  thickness: number
) {
  const alpha = opacity;
  const color = new ThreeColor(hexaColor);
  const vertexShader = VERT.trim();
  const fragmentShader = FRAG.trim();

  const ghostMaterial = new ThreeShaderMaterial({
    uniforms: {
      uAlpha: { value: applyModifierForOpacity(alpha) },
      uBright: { value: applyModifierForBrightness(brightness) },
      uThick: { value: applyModifierForThickness(thickness) },
      uColor: { value: color },
    },
    vertexShader,
    fragmentShader,
    side: ThreeFrontSide,
    blending: ThreeCustomBlending,
    blendSrc: ThreeSrcAlphaFactor,
    blendDst: ThreeOneMinusSrcAlphaFactor,
    blendEquation: ThreeAddEquation,
    blendSrcAlpha: ThreeSrcAlphaFactor,
    blendDstAlpha: ThreeOneMinusSrcAlphaFactor,
    blendEquationAlpha: ThreeAddEquation,
    transparent: true,
    depthTest: false,
    depthWrite: false,
  });

  return ghostMaterial;
}
