const FRAG = `#version 300 es

precision mediump float;

uniform sampler2D uniTexture;
in vec4 varUV;
in float varScale;
out vec4 FragColor;

void main() {
  vec2 uv = varUV.xy + varUV.zw * gl_PointCoord;
  vec4 color = texture( uniTexture, uv );
  if (color.w < 0.01) discard;
  FragColor = vec4(varScale * color.rgb, color.a);
}
`;
export default FRAG;
