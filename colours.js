"use strict";

const vs = `
attribute vec4 position;

void main() {
  gl_Position = position;
}
`;

// From glslsandbox.com
const fs =`
precision highp float;

uniform float time;
uniform vec2 resolution;

#define TWO_PI radians(360.0)
#define NUMBALLS 30.0

float d = -TWO_PI/36.0;

void main( void ) {
    vec2 p = (2.0*gl_FragCoord.xy - resolution)/min(resolution.x, resolution.y);    
    vec3 c = vec3(0);
    for(float i = 0.0; i < NUMBALLS; i++) {
        float t = TWO_PI * i/NUMBALLS + time;
        float x = cos(t);
        float y = sin(3.0 * t + d);
        vec2 q = 0.8*vec2(x, y);
        c += 0.015/distance(p, q) * vec3(0.9 * abs(x), 0, abs(y));
    }
    gl_FragColor = vec4(c, 1.0);
}
`;

const gl = document.querySelector("canvas").getContext("webgl");

// compiles shaders, links program, looks up locations.
const programInfo = twgl.createProgramInfo(gl, [vs, fs]);

var arrays = {
  position: [-1, -1, 0, 1, -1, 0, -1, 1, 0, -1, 1, 0, 1, -1, 0, 1, 1, 0],
};
// calls gl.createBuffer, gl.bindBuffer, gl.bufferData for each array
var bufferInfo = twgl.createBufferInfoFromArrays(gl, arrays);

function render(time) {
  twgl.resizeCanvasToDisplaySize(gl.canvas);
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

  const uniforms = {
    time: time * 0.001,
    resolution: [gl.canvas.width, gl.canvas.height],
  };

  gl.useProgram(programInfo.program);
  
  // calls gl.bindBuffer, gl.enableVertexAttribArray, gl.vertexAttribPointer
  twgl.setBuffersAndAttributes(gl, programInfo, bufferInfo);
  
  // calls gl.uniform
  twgl.setUniforms(programInfo, uniforms);
  
  // calls gl.drawArrays or gl.drawElements
  twgl.drawBufferInfo(gl, bufferInfo);

  requestAnimationFrame(render);
}
requestAnimationFrame(render);