export function checkWebGLImage() {
    $("#fullscreen-popup").fadeIn();
    let isSupportWebGL = drawTriangle();
    isSupportWebGL = drawTriangle()

    return new Promise(resolve => {
        setTimeout(() => {
            const isSameImages = isSameImagesTC4();
            if(!isSupportWebGL) {
                resolve({
                    status: "Failed",
                    note: "WebGL is not supported"
                });
                $("#fullscreen-popup").fadeOut();
                return;
            }
            resolve({
                status: isSameImages ? "Passed" : "Failed",
                note: isSameImages
                    ? "The image that draw on the browser is same as the image in the webgl-sample"
                    : "The image that draw on the browser is not same as the image in the webgl-sample"
            });
            $("#fullscreen-popup").fadeOut();
        }, 5000);
    });
}

export function setImageSampleForTC4() {
    const userAgent = navigator.userAgent;
    console.log("[Test case - CheckWebGLImage] userAgent : ", userAgent);
    const img = document.getElementById("webgl-sample");
    img.src = userAgent.includes("Windows")
        ? "./resources/webgl-sample-on-browser.png"
        : "./resources/webgl-sample-on-bench.png";
}

function drawTriangle() {
    const canvas = document.getElementById('my_Canvas');
    const gl = canvas.getContext('webgl', { preserveDrawingBuffer: true });

    if (!gl) {
        alert('[Test case - CheckWebGLImage] WebGL not supported');
        return false;
    }

    const vertexShaderSource = `
        attribute vec2 a_position;
        void main() {
            gl_Position = vec4(a_position, 0.0, 1.0);
        }
    `;

    const fragmentShaderSource = `
        precision mediump float;
        void main() {
            gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
        }
    `;

    function createShader(gl, type, source) {
        const shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            console.error('Shader compile error:', gl.getShaderInfoLog(shader));
            gl.deleteShader(shader);
            return null;
        }
        return shader;
    }

    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error('Program link error:', gl.getProgramInfoLog(program));
    }

    gl.useProgram(program);

    const vertices = new Float32Array([
        0.0, 0.5,   // Top
        -0.5, -0.5, // Bottom left
        0.5, -0.5   // Bottom right
    ]);

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    const positionLocation = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    gl.clearColor(1.0, 1.0, 1.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, 3);

    return true;
}

function isSameImagesTC4() {
    const canvas = $('#my_Canvas')[0];
    if (!canvas) return false;

    const base64 = canvas.toDataURL('image/png');
    console.log("[Test case - CheckWebGLImage] base64 : ", base64);
    const webglSampleBase64 = getImageBase64OfWebGLSample();
    console.log("[Test case - CheckWebGLImage] webglSampleBase64 : ", webglSampleBase64);
    console.log("[Test case - CheckWebGLImage] base64 === webglSampleBase64 : ", base64 === webglSampleBase64);
    return base64 === webglSampleBase64;
}

function getImageBase64OfWebGLSample() {
    const img = document.getElementById("webgl-sample");
    const canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);
    return canvas.toDataURL("image/png");
}