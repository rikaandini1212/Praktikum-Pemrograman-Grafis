var canvas = document.getElementById("canvas");
var gl = canvas.getContext("webgl");

// Cek apakah browser mendukung WebGL
if (!gl) {
  console.log("WebGL is not supported");
} else {
  console.log("WebGL is supported");
}

// Set warna latar belakang canvas
gl.clearColor(0.998, 0.667, 0.99, 1.0);
gl.clear(gl.COLOR_BUFFER_BIT);

// Vertex shader source code
var vertexShaderSource = `
  attribute vec2 a_position;
  void main() {
    gl_Position = vec4(a_position, 0.0, 1.0);
  }
`;

// Fragment shader source code
var fragmentShaderSource = `
  precision mediump float;

  void main() {
    gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0); // Merah
  }
`;

// Define koordinat titik segitiga
var segitiga = [0.0, 0.5, 0.5, 0.0, 0.5, 0.5];

// Define koordinat titik kotak
var kotak = [-0.8, -0.8, -0.2, -0.8, -0.2, -0.2, -0.8, -0.2];

// Create buffer untuk segitiga
var triangleBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, triangleBuffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(segitiga), gl.STATIC_DRAW);

// Create buffer untuk kotak
var squareBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, squareBuffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(kotak), gl.STATIC_DRAW);

// Compile vertex shader
var vertexShader = gl.createShader(gl.VERTEX_SHADER);
gl.shaderSource(vertexShader, vertexShaderSource);
gl.compileShader(vertexShader);

// Compile fragment shader
var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(fragmentShader, fragmentShaderSource);
gl.compileShader(fragmentShader);

// Create shader program
var shaderProgram = gl.createProgram();
gl.attachShader(shaderProgram, vertexShader);
gl.attachShader(shaderProgram, fragmentShader);
gl.linkProgram(shaderProgram);
gl.useProgram(shaderProgram);

// Ambil lokasi atribut untuk segitiga
var positionAttributeLocationTriangle = gl.getAttribLocation(
  shaderProgram,
  "a_position"
);

// Aktifkan dan atur pointer atribut posisi untuk segitiga
gl.bindBuffer(gl.ARRAY_BUFFER, triangleBuffer);
gl.enableVertexAttribArray(positionAttributeLocationTriangle);
gl.vertexAttribPointer(
  positionAttributeLocationTriangle,
  2,
  gl.FLOAT,
  false,
  0,
  0
);

// Gambar segitiga
gl.drawArrays(gl.TRIANGLES, 0, 3);

// Ambil lokasi atribut untuk kotak
var positionAttributeLocationSquare = gl.getAttribLocation(
  shaderProgram,
  "a_position"
);

// Aktifkan dan atur pointer atribut posisi untuk kotak
gl.bindBuffer(gl.ARRAY_BUFFER, squareBuffer);
gl.enableVertexAttribArray(positionAttributeLocationSquare);
gl.vertexAttribPointer(
  positionAttributeLocationSquare,
  2,
  gl.FLOAT,
  false,
  0,
  0
);

// Gambar kotak
gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
