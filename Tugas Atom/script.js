var canvas = document.getElementById('canvas');
var gl = canvas.getContext('webgl');


if (!gl) { 
    console.log('Browser tidak mendukung WebGL'); 
} else { 
    console.log('Browser mendukung WebGL.'); 
}


function resizeCanvas() {
    const displayWidth = window.innerWidth;
    const displayHeight = window.innerHeight;
    
    // Mengatur ukuran kanvas menjadi fullscreen
    canvas.width = displayWidth;
    canvas.height = displayHeight;

    gl.viewport(0, 0, canvas.width, canvas.height);
}


resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Warna canvas 
gl.clearColor(0.0, 0.0, 0.0, 1.0); 
gl.clear(gl.COLOR_BUFFER_BIT);

// Vertex shader source 
var vertexShaderSource = `
    attribute vec2 a_position;
    uniform float u_rotationAngle;
    uniform mat2 u_rotationMatrix;
    void main() {
        vec2 rotatedPosition = u_rotationMatrix * a_position;
        gl_Position = vec4(rotatedPosition, 0.0, 1.0);
    }
`;

// Fragment shader source 
var fragmentShaderSource = `
    precision mediump float;
    uniform vec4 u_color;
    void main() { 
        gl_FragColor = u_color;
    }
`;

// Buat vertex shader 
var vShader = gl.createShader(gl.VERTEX_SHADER); 
gl.shaderSource(vShader, vertexShaderSource); 
gl.compileShader(vShader);


var fShader = gl.createShader(gl.FRAGMENT_SHADER); 
gl.shaderSource(fShader, fragmentShaderSource); 
gl.compileShader(fShader);


var shaderProgram = gl.createProgram(); 
gl.attachShader(shaderProgram, vShader); 
gl.attachShader(shaderProgram, fShader); 
gl.linkProgram(shaderProgram); 
gl.useProgram(shaderProgram);


var colorLocation = gl.getUniformLocation(shaderProgram, 'u_color');
gl.uniform4fv(colorLocation, [0.0, 0.5, 1.0, 1.0]); // Warna biru (R, G, B, A)

var rotationAngle = 0;
var rotationSpeed = 0.05; // Kecepatan rotasi

function drawEllipse(centerX, centerY, radiusX, radiusY, numSegments, rotationAngle) {
    var vertices = [];
    for (var i = 0; i <= numSegments; i++) {
        var angle = (i / numSegments) * 2 * Math.PI;
        vertices.push(centerX + Math.cos(angle) * radiusX);
        vertices.push(centerY + Math.sin(angle) * radiusY);
    }

    var vBuffer = gl.createBuffer(); 
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

    var positionLocation = gl.getAttribLocation(shaderProgram, 'a_position'); 
    gl.enableVertexAttribArray(positionLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    var c = Math.cos(rotationAngle);
    var s = Math.sin(rotationAngle);
    var rotationMatrix = new Float32Array([c, -s, s, c]);
    var rotationMatrixLocation = gl.getUniformLocation(shaderProgram, 'u_rotationMatrix');
    gl.uniformMatrix2fv(rotationMatrixLocation, false, rotationMatrix);

    gl.drawArrays(gl.LINE_LOOP, 0, vertices.length / 2);
}

function drawAtom(rotationAngle) {
    var centerX = 0.0;
    var centerY = 0.0;

    // Gambar inti atom
    drawEllipse(centerX, centerY, 0.5, 0.05, 70, 11);

    // Gambar orbit elektron dengan orientasi berbeda
    drawEllipse(centerX, centerY, 0.1, 0.3, 70, 7); // Kiri ke kanan
    drawEllipse(centerX, centerY, 0.1, 0.3, 70, Math.PI / 2); // Atas ke bawah
    drawEllipse(centerX, centerY, 0.1, 0.3, 70, Math.PI / 2); // Kanan atas ke kiri bawah
    drawEllipse(centerX, centerY, 0.1, 0.3, 70, -Math.PI / 4); // Kiri atas ke kanan bawah

    // Gambar elektron
    var numElectrons = 4;
    for (var i = 0; i < numElectrons; i++) {
        var angle = rotationAngle + i * (2 * Math.PI / numElectrons);
        var electronX = centerX + Math.cos(angle) * 0.6;
        var electronY = centerY + Math.sin(angle) * 0.6;
        drawEllipse(electronX, electronY, 0.03, 0.03, 100, 0);
    }
}

function animateAtom() { 
    gl.clear(gl.COLOR_BUFFER_BIT);
    rotationAngle += rotationSpeed; // Gunakan kecepatan rotasi
    
    // Menggambar atom
    drawAtom(rotationAngle); 
    
    requestAnimationFrame(animateAtom);
}

animateAtom();