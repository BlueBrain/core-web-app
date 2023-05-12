const VERT = `#version 300 es

uniform mat3 uniCamera;
in vec3 attPosition;
in vec4 attUV;
out vec4 varUV;
out float varScale;

void main() {
  varUV = attUV;
  vec3 pos = uniCamera * attPosition;
  float scale = 1.0 + (pos.z * 0.5);
  varScale = scale;
  pos.z = (1.0 - pos.z) * 0.5;
  gl_PointSize = 32.0 * scale;
  gl_Position = vec4(pos, 1.0);
}
`;
export default VERT;
