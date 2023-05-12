/* eslint-disable @typescript-eslint/no-use-before-define */
import * as Three from 'three';
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
  const color = new Three.Color(hexaColor);
  const vertexShader = VERT.trim();
  const fragmentShader = FRAG.trim();

  const ghostMaterial = new Three.ShaderMaterial({
    uniforms: {
      uAlpha: { value: applyModifierForOpacity(alpha) },
      uBright: { value: applyModifierForBrightness(brightness) },
      uThick: { value: applyModifierForThickness(thickness) },
      uColor: { value: color },
    },
    vertexShader,
    fragmentShader,
    side: Three.FrontSide,
    blending: Three.CustomBlending,
    blendSrc: Three.SrcAlphaFactor,
    blendDst: Three.OneMinusSrcAlphaFactor,
    blendEquation: Three.AddEquation,
    blendSrcAlpha: Three.SrcAlphaFactor,
    blendDstAlpha: Three.OneMinusSrcAlphaFactor,
    blendEquationAlpha: Three.AddEquation,
    transparent: true,
    depthTest: false,
    depthWrite: false,
  });

  return ghostMaterial;
}
