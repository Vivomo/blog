const initShader = (gl, VERTEX_SHADER_SOURCE, FRAGMENT_SHADER_SOURCE) => {
  // 创建着色器
  const vertexShader = gl.createShader(gl.VERTEX_SHADER);
  const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

  gl.shaderSource(vertexShader, VERTEX_SHADER_SOURCE) // 指定顶点着色器的源码
  gl.shaderSource(fragmentShader, FRAGMENT_SHADER_SOURCE) // 指定片元着色器的源码

  // 编译着色器
  gl.compileShader(vertexShader)
  gl.compileShader(fragmentShader)

  // 创建一个程序对象
  const program = gl.createProgram();

  gl.attachShader(program, vertexShader)
  gl.attachShader(program, fragmentShader)

  gl.linkProgram(program)

  gl.useProgram(program);

  return program;
}

// 平移矩阵
const getTranslateMatrix = (x = 0,y = 0,z = 0) => new Float32Array([
  1.0, 0.0, 0.0, 0.0,
  0.0, 1.0, 0.0, 0.0,
  0.0, 0.0, 1.0, 0.0,
  x, y, z, 1,
]);
// 缩放矩阵
const getScaleMatrix = (x = 1,y = 1,z = 1) => new Float32Array([
  x, 0.0, 0.0, 0.0,
  0.0, y, 0.0, 0.0,
  0.0, 0.0, z, 0.0,
  0.0, 0.0, 0.0, 1,
]);
// 绕z轴旋转的旋转矩阵
const getRotateMatrix = deg => new Float32Array([
  Math.cos(deg), Math.sin(deg), 0.0, 0.0,
  -Math.sin(deg), Math.cos(deg), 0.0, 0.0,
  0.0, 0.0, 1.0, 0.0,
  0.0, 0.0, 0.0, 1,
]);