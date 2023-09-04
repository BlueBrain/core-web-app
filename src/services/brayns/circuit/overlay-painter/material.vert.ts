const VERT = `precision highp float;

uniform float uAlpha;
uniform float uBright;
uniform float uThick;
uniform vec3 uColor;

varying float alpha;
varying vec3 color;

void main()
{
    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
    vec4 worldCoord = modelMatrix * vec4( position, 1.0 );
    vec3 vNormal = normalize( normal );
    vec3 vertexToCameraVec = cameraPosition - vec3(worldCoord);
    vec3 vertexToCameraVecNormalized = normalize( vertexToCameraVec );

    // the raw intensity is good but as we get closer to vertices, the intensity gets higher
    float normal = dot(vNormal, vertexToCameraVecNormalized);
    float rawIntensity = smoothstep(
        0.0,
        uThick,
        normal
    );
    float intensity = 1.0 - rawIntensity * 0.75;
    float bright = uBright * (1.0 - smoothstep(0.0, 0.01, normal));
    bright += uBright;
    color = uColor * (1.0 + bright) * intensity;
    alpha = (0.7 * uAlpha) * intensity;
}
`;

export default VERT;
