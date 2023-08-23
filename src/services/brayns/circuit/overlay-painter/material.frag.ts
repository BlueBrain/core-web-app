const FRAG = `
precision highp float;

varying float alpha;
varying vec3 color;

void main()
{
    gl_FragColor = vec4( color, alpha );
}
`;

export default FRAG;
