//Ari Iramanesh
// Vertex shader program
var VSHADER_SOURCE =
  'attribute vec4 a_Position;\n' +
   //  'attribute vec4 a_Color;\n' + // Defined constant in main()
  'attribute vec4 a_Normal;\n' +

  'uniform vec4 u_ColorRGBA;\n' +

  'uniform mat4 u_RotationMatrix;\n' +
  'uniform mat4 u_ScaleMatrix;\n' +
  'uniform mat4 u_TranslationMatrix;\n' +

  'uniform mat4 u_MvpMatrix;\n' +
  'uniform mat4 u_ModelMatrix;\n' +    // Model matrix
  'uniform mat4 u_NormalMatrix;\n' +   // Transformation matrix of the normal
  'varying vec4 v_Color;\n' +
  'varying vec3 v_Normal;\n' +
  'varying vec3 v_Position;\n' +
  'void main() {\n' +
  //'  vec4 color = vec4(1.0, 1.0, 1.0, 1.0);\n' + // Sphere color
  '  vec4 color = u_ColorRGBA;\n' +
  /*'  if(control < 1){\n' +
  '    gl_Position = u_MvpMatrix * a_Position;\n' +
  '  } else {\n' + */
  '    gl_Position = u_MvpMatrix * u_RotationMatrix * u_TranslationMatrix * u_ScaleMatrix * a_Position;\n' +
  //'  }\n' +
     // Calculate the vertex position in the world coordinate
  '  v_Position = vec3(u_ModelMatrix * a_Position);\n' +
  '  v_Normal = normalize(vec3(u_NormalMatrix * a_Normal));\n' +
  '  v_Color = color;\n' + 
  '}\n';

// Fragment shader program
var FSHADER_SOURCE =
  '#ifdef GL_ES\n' +
  'precision mediump float;\n' +
  '#endif\n' +
  'uniform vec3 u_LightColor;\n' +     // Light color
  'uniform vec3 u_LightPosition;\n' +  // Position of the light source
  'uniform vec3 u_AmbientLight;\n' +   // Ambient light color

  'uniform int u_isNormalOn;\n' +

  'varying vec3 v_Normal;\n' +
  'varying vec3 v_Position;\n' +
  'float shininess = 100.0;\n' +
  'varying vec4 v_Color;\n' +
  'float specular = 0.0;\n' +
  'void main() {\n' +
     // Normalize the normal because it is interpolated and not 1.0 in length any more
  '  vec3 normal = normalize(v_Normal);\n' + //N
     // Calculate the light direction and make it 1.0 in length
  '  vec3 lightDirection = normalize(u_LightPosition - v_Position);\n' + //L
     // The dot product of the light direction and the normal
  '  float nDotL = max(dot(lightDirection, normal), 0.0);\n' + //lambertian
     // Calculate the final color from diffuse reflection and ambient reflection
  '  vec3 diffuse = u_LightColor * v_Color.rgb * nDotL;\n' +
  '  vec3 ambient = u_AmbientLight * v_Color.rgb;\n' +
  '  if(nDotL > 0.0){\n' + //specular
  '     vec3 R = reflect(-lightDirection, normal);\n' + //yup
  '     vec3 V = normalize(-v_Position);\n ' + // Vector to viewer
  '     float specAngle = max(dot(R, V), 0.0); \n' +
  '     specular = pow(specAngle, shininess); }\n' +
  '  if(u_isNormalOn == 2){\n' +
  '     gl_FragColor = vec4(diffuse + ambient + specular, v_Color.a);\n' +
  '  } else if (u_isNormalOn == 0) {\n' +
  '     gl_FragColor = v_Color;\n' +
  '  } else {\n' +
  '     gl_FragColor = vec4(normal, v_Color.a); }\n' +
  '}\n';


//Unit Cube
var vertices = new Float32Array([
    // Vertex coordinates and color

    //top           //ground         //dirt or wall     //grass           //log           //leaves
    -1.0,1.0,-1.0,   
    -1.0,1.0,1.0,   
    1.0,1.0,1.0,    
    1.0,1.0,-1.0,   
      
    //left  
    -1.0,1.0,1.0,   
    -1.0,-1.0,1.0,  
    -1.0,-1.0,-1.0, 
    -1.0,1.0,-1.0,  

    //right        
    1.0,1.0,1.0,    
    1.0,-1.0,1.0,   
    1.0,-1.0,-1.0,  
    1.0,1.0,-1.0,   

    //front*        
    1.0,1.0,1.0,    
    1.0,-1.0,1.0,   
    -1.0,-1.0,1.0,  
    -1.0,1.0,1.0,   

    //back         
    1.0,1.0,-1.0,   
    1.0,-1.0,-1.0,  
    -1.0,-1.0,-1.0, 
    -1.0,1.0,-1.0,  

    //bottom        
    -1.0,-1.0,-1.0, 
    -1.0,-1.0,1.0,   
    1.0,-1.0,1.0,    
    1.0,-1.0,-1.0,    

  ]);

  
//creation of cubes via triangles
var cube_indices = new Uint8Array([

    //top
     0,1,2,
     0,2,3,

     //left
     4,5,6,
     4,6,7,

     //front
     8,9,10,
     8,10,11,

     //right
     12,13,14,
     12,14,15,

     //bottom
     16,17,18,
     16,18,19,

     //behind
     20,21,22,
     20,22,23
    
 ]);

 var SPHERE_DIV = 13;

 var i, ai, si, ci;
 var j, aj, sj, cj;
 var p1, p2;

 var positions = [];
 var indices = [];

 // Generate coordinates
 for (j = 0; j <= SPHERE_DIV; j++) {
   aj = j * Math.PI / SPHERE_DIV;
   sj = Math.sin(aj);
   cj = Math.cos(aj);
   for (i = 0; i <= SPHERE_DIV; i++) {
     ai = i * 2 * Math.PI / SPHERE_DIV;
     si = Math.sin(ai);
     ci = Math.cos(ai);

     positions.push(si * sj);  // X
     positions.push(cj);       // Y
     positions.push(ci * sj);  // Z
   }
 }

 // Generate indices
 for (j = 0; j < SPHERE_DIV; j++) {
   for (i = 0; i < SPHERE_DIV; i++) {
     p1 = j * (SPHERE_DIV+1) + i;
     p2 = p1 + (SPHERE_DIV+1);

     indices.push(p1);
     indices.push(p2);
     indices.push(p1 + 1);

     indices.push(p1 + 1);
     indices.push(p2);
     indices.push(p2 + 1);
   }
 }

var n = indices.length;
var vertices_length = cube_indices.length;
let u_RotationMatrix;
let u_TranslationMatrix;
let u_ScaleMatrix;
let u_control;
var modelMatrix;
var mvpMatrix;
var normalMatrix;
var u_ModelMatrix;
var u_MvpMatrix;
var u_NormalMatrix ;
var u_LightColor; 
var u_LightPosition;
var u_AmbientLight;
var velocity = 0.1;
var rot_velocity = 2;

var PerspectiveMatrix = new Matrix4();    // Model view projection matrix
var ViewMatrix = new Matrix4(); // Transformation matrix for normals

var indexBuffer;
var bfr1;
var bfr2;
var isNormalOn = 2;
var u_isNormalOn;

var a_Position;
var a_Normal;
var u_ColorRGBA;

var eyeX = 12;
var eyeY = 2;
var eyeZ = 12;

var atX = 0;
var atY = 2;
var atZ = 0;

var upX = 0; 
var upY = 1;
var upZ = 0;

var lightRotating = 1;

var control = 0;
var vertexBuffer;
rotationMatrix = new Matrix4();
scaleMatrix = new Matrix4();
translationMatrix = new Matrix4();

translationMatrix.setTranslate(1,0,0);

var gl;
var canvas;

function main() {
  // Retrieve <canvas> element
  canvas = document.getElementById('webgl');

  // Get the rendering context for WebGL
  gl = getWebGLContext(canvas);
  if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
    return;
  }

  // Initialize shaders
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Failed to intialize shaders.');
    return;
  }

  indexBuffer = gl.createBuffer();
  if (!indexBuffer) {
    console.log('Failed to create the buffer object');
    return -1;
  }
  

  // Set the clear color and enable the depth test
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.enable(gl.DEPTH_TEST);

  // Get the storage locations of uniform variables
  u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
  u_MvpMatrix = gl.getUniformLocation(gl.program, 'u_MvpMatrix');
  u_NormalMatrix = gl.getUniformLocation(gl.program, 'u_NormalMatrix');
  u_LightColor = gl.getUniformLocation(gl.program, 'u_LightColor');
  u_LightPosition = gl.getUniformLocation(gl.program, 'u_LightPosition');
  u_AmbientLight = gl.getUniformLocation(gl.program, 'u_AmbientLight');
  if (!u_ModelMatrix){
    console.log('Failed to get the storage location');
    return;
  }
  if(!u_MvpMatrix){
    console.log("1");
  }
  if(!u_NormalMatrix){
    console.log("2");
  }
  if(!u_LightColor){
    console.log("3");
  }
  if(!u_LightPosition){
    console.log("4");
  }
  if(!u_AmbientLight){
    console.log("5");
  }
  //////////////////////////////////////////////////////////////////////
  u_RotationMatrix = gl.getUniformLocation(gl.program, "u_RotationMatrix");
  u_ScaleMatrix = gl.getUniformLocation(gl.program, "u_ScaleMatrix");
  u_TranslationMatrix = gl.getUniformLocation(gl.program, "u_TranslationMatrix");
  u_control = gl.getUniformLocation(gl.program, "control");

  vertexBuffer = gl.createBuffer();
  if (!vertexBuffer) {
    console.log('Failed to create the buffer object');
    return -1;
  }

    gl.uniformMatrix4fv(u_TranslationMatrix, false, translationMatrix.elements);
    gl.uniformMatrix4fv(u_RotationMatrix, false, rotationMatrix.elements);
    
    gl.uniformMatrix4fv(u_ScaleMatrix, false, scaleMatrix.elements);

  gl.uniform1i(u_control, false, 1);

  bfr1 = gl.createBuffer();
  if (!bfr1) {
    console.log('Failed to create the buffer object');
    return false;
  }
  bfr2 = gl.createBuffer();
  if (!bfr2) {
    console.log('Failed to create the buffer object');
    return false;
  }

  a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  if(a_Position < 0) {
    console.log('Failed to get the storage location of a_Position');
    return -1;
  }

  a_Normal = gl.getAttribLocation(gl.program, 'a_Normal');
  if(a_Normal < 0) {
    console.log('Failed to get the storage location of a_Normal');
    return -1;
  }

  u_isNormalOn = gl.getUniformLocation(gl.program, 'u_isNormalOn');
  u_ColorRGBA = gl.getUniformLocation(gl.program, 'u_ColorRGBA');

  //////////////////////////////////////////////////////////////////////

  // Set the light color (white)
  gl.uniform3f(u_LightColor, 0.8, 0.8, 0.8);
  // Set the light direction (in the world coordinate)
  gl.uniform3f(u_LightPosition, 50.0, 0, 50.0);
  // Set the ambient light
  gl.uniform3f(u_AmbientLight, 0.2, 0.2, 0.2);

  modelMatrix = new Matrix4();  // Model matrix
  mvpMatrix = new Matrix4();    // Model view projection matrix
  normalMatrix = new Matrix4(); // Transformation matrix for normals
  

  // Calculate the model matrix
  modelMatrix.setRotate(90, 0, 1, 0); // Rotate around the y-axis
  // Calculate the view projection matrix
  PerspectiveMatrix.setPerspective(30, canvas.width/canvas.height, 1, 100);
  ViewMatrix.lookAt(0, 0, 6, 0, 0, 0, 0, 1, 0);
  PerspectiveMatrix.multiply(ViewMatrix);
  mvpMatrix = PerspectiveMatrix;
  mvpMatrix.multiply(modelMatrix);
  // Calculate the matrix to transform the normal based on the model matrix
  normalMatrix.setInverseOf(modelMatrix);
  normalMatrix.transpose();

  // Pass the model matrix to u_ModelMatrix
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);

  // Pass the model view projection matrix to u_mvpMatrix
  gl.uniformMatrix4fv(u_MvpMatrix, false, mvpMatrix.elements);

  // Pass the transformation matrix for normals to u_NormalMatrix
  gl.uniformMatrix4fv(u_NormalMatrix, false, normalMatrix.elements);

  // Clear color and depth buffer
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  document.onkeydown = function(ev){ keydown(ev, gl, n); };

  gl.uniform1i(u_isNormalOn, isNormalOn);

  tick();
}


function drawCubeShaded(gl) { // Create a sphere

  gl.uniformMatrix4fv(u_TranslationMatrix, false, translationMatrix.elements);
  // Write the vertex property to buffers (coordinates and normals)
  // Same data can be used for vertex and normal
  // In order to make it intelligible, another buffer is prepared separately
  initArrayBufferCube(gl, a_Position, new Float32Array(vertices), gl.FLOAT, 3, bfr1);
  initArrayBufferCube(gl, a_Normal, new Float32Array(vertices), gl.FLOAT, 3, bfr2);

  // *Write the indices to the buffer object
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, cube_indices, gl.STATIC_DRAW);
  gl.drawElements(gl.TRIANGLES, vertices_length, gl.UNSIGNED_BYTE, 0);

  return indices.length;
}

var FSIZE = vertices.BYTES_PER_ELEMENT;
function initArrayBufferCube(gl, a_attribute, data, type, num, bfr) {
  // Create a buffer object
  // Write date into the buffer object
  gl.bindBuffer(gl.ARRAY_BUFFER, bfr);
  gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
  
  gl.vertexAttribPointer(a_attribute, 3, gl.FLOAT, false, FSIZE * 3, 0);
  // Enable the assignment of the buffer object to the attribute variable
  gl.enableVertexAttribArray(a_attribute);

  return true;
}

function drawSphereShaded(gl) { // Create a sphere

  // Write the vertex property to buffers (coordinates and normals)
  // Same data can be used for vertex and normal
  // In order to make it intelligible, another buffer is prepared separately
  gl.uniformMatrix4fv(u_TranslationMatrix, false, translationMatrix.elements);

  initArrayBufferSphere(gl, a_Position, new Float32Array(positions), gl.FLOAT, 3, bfr1);

  initArrayBufferSphere(gl, a_Normal, new Float32Array(positions), gl.FLOAT, 3, bfr2);

  // *Write the indices to the buffer object
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);

  gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_SHORT, 0);
}

function initArrayBufferSphere(gl, a_attribute, data, type, num, bfr) {
  // Create a buffer object
  
  // Write date into the buffer object
  gl.bindBuffer(gl.ARRAY_BUFFER, bfr);
  gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
  // Assign the buffer object to the attribute variable
  /*
  var a_attribute = gl.getAttribLocation(gl.program, attribute);
  if (a_attribute < 0) {
    console.log('Failed to get the storage location of ' + attribute);
    return false;
  }*/
  gl.vertexAttribPointer(a_attribute, num, type, false, 0, 0);
  // Enable the assignment of the buffer object to the attribute variable
  gl.enableVertexAttribArray(a_attribute);

  return true;
}

function tick(){
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  // Draw the sphere
  //use this to change color of object
  if(lightRotating == 1) updateLight();
  updateCamera();
  
  rotationMatrix.setIdentity();
  scaleMatrix.setIdentity();
  gl.uniformMatrix4fv(u_RotationMatrix, false, rotationMatrix.elements);
  gl.uniformMatrix4fv(u_ScaleMatrix, false, scaleMatrix.elements);
//spheres
  translationMatrix.setTranslate(0,0,3);
  gl.uniform4f(u_ColorRGBA, 1.0, 0.5, 0, 1.0);
  drawSphereShaded(gl);

  translationMatrix.setTranslate(-3,0,0 );
  gl.uniform4f(u_ColorRGBA, 0.9, 0.0, 0, 1.0);
  drawSphereShaded(gl);

  translationMatrix.setTranslate(0,4,4 );
  scaleMatrix.setScale(2,2,2);
  gl.uniformMatrix4fv(u_RotationMatrix, false, rotationMatrix.elements);
  gl.uniformMatrix4fv(u_ScaleMatrix, false, scaleMatrix.elements);
  gl.uniform4f(u_ColorRGBA, 1, 1, 0, 1.0);
  drawSphereShaded(gl);

  translationMatrix.setTranslate(-14,0,0 );
  scaleMatrix.setScale(1,1,1);
  gl.uniformMatrix4fv(u_RotationMatrix, false, rotationMatrix.elements);
  gl.uniformMatrix4fv(u_ScaleMatrix, false, scaleMatrix.elements);
  gl.uniform4f(u_ColorRGBA, 1, 1, 0.7, 1.0);
  drawSphereShaded(gl);
//cubes

  //floor
  translationMatrix.setTranslate(-5,-1.5,5);
  scaleMatrix.setScale(25,0.1,25);
  gl.uniformMatrix4fv(u_RotationMatrix, false, rotationMatrix.elements);
  gl.uniformMatrix4fv(u_ScaleMatrix, false, scaleMatrix.elements);
  gl.uniform4f(u_ColorRGBA, .5, .5, .5, 1.0);
  drawCubeShaded(gl);

  translationMatrix.setTranslate(0,0,0);
  scaleMatrix.setScale(1,1,1);
  gl.uniformMatrix4fv(u_RotationMatrix, false, rotationMatrix.elements);
  gl.uniformMatrix4fv(u_ScaleMatrix, false, scaleMatrix.elements);
  gl.uniform4f(u_ColorRGBA, 1.0, 1.0, 1.0, 1.0);
  drawCubeShaded(gl);
  
  translationMatrix.setTranslate(-7,0,2);
  scaleMatrix.setScale(1,1,1);
  gl.uniformMatrix4fv(u_RotationMatrix, false, rotationMatrix.elements);
  gl.uniformMatrix4fv(u_ScaleMatrix, false, scaleMatrix.elements);
  gl.uniform4f(u_ColorRGBA, 0, 0.7, 0.3, 1.0);
  drawCubeShaded(gl);

  translationMatrix.setTranslate(-1,0,7);
  scaleMatrix.setScale(0.2,1,0.2);
  gl.uniformMatrix4fv(u_RotationMatrix, false, rotationMatrix.elements);
  gl.uniformMatrix4fv(u_ScaleMatrix, false, scaleMatrix.elements);
  gl.uniform4f(u_ColorRGBA, 1.0, 0.5, 0, 1.0);
  drawCubeShaded(gl);

  translationMatrix.setTranslate(-7,0,6);
  scaleMatrix.setScale(0.5,1,0.3);
  gl.uniformMatrix4fv(u_RotationMatrix, false, rotationMatrix.elements);
  gl.uniformMatrix4fv(u_ScaleMatrix, false, scaleMatrix.elements);
  gl.uniform4f(u_ColorRGBA, 0.2, 0.8, 1.0, 1.0);
  drawCubeShaded(gl); 

  rotationMatrix.setRotate(30, 0, 1, 0);
  scaleMatrix.setScale(0.5, 2, 0.5);
  gl.uniformMatrix4fv(u_RotationMatrix, false, rotationMatrix.elements);
  gl.uniformMatrix4fv(u_ScaleMatrix, false, scaleMatrix.elements);

  translationMatrix.setTranslate(0,3,0);
  gl.uniform4f(u_ColorRGBA, 0.7, 0, 0.7, 1.0);
  drawCubeShaded(gl);

  requestAnimationFrame(tick);
}


function showNormals(){
  isNormalOn = 1;
  gl.uniform1i(u_isNormalOn, isNormalOn);
}

function showNone(){
  isNormalOn = 0;
  gl.uniform1i(u_isNormalOn, isNormalOn);
}

function showLighting(){
  isNormalOn = 2;
  gl.uniform1i(u_isNormalOn, isNormalOn);
}

function updateCamera(){
  modelMatrix.setRotate(90, 0, 1, 0); // Rotate around the y-axis
  // Calculate the view projection matrix
  PerspectiveMatrix.setPerspective(30, canvas.width/canvas.height, 1, 100);
  ViewMatrix.setLookAt(eyeX, eyeY, eyeZ, atX, atY, atZ, upX, upY, upZ);
  PerspectiveMatrix.multiply(ViewMatrix);
  mvpMatrix = PerspectiveMatrix;
  mvpMatrix.multiply(modelMatrix);
  // Calculate the matrix to transform the normal based on the model matrix
  normalMatrix.setInverseOf(modelMatrix);
  normalMatrix.transpose();
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);

  // Pass the model view projection matrix to u_mvpMatrix
  gl.uniformMatrix4fv(u_MvpMatrix, false, mvpMatrix.elements);

  // Pass the transformation matrix for normals to u_NormalMatrix
  gl.uniformMatrix4fv(u_NormalMatrix, false, normalMatrix.elements);
}

var lightX=0;
var lightY=0;
var lightZ=0;
var radX;
var radY;
var radZ;
function updateLight(){
  lightX = (lightX + 0.25) % 360;
  radX = lightX * (Math.PI/180);
  lightY = (lightY + 0.25) % 360;
  radY = lightY * (Math.PI/180);
  lightZ = (lightZ + 0.25) % 360;
  radZ = lightZ * (Math.PI/180);
  gl.uniform3f(u_LightPosition,Math.cos(radX)*50, 50, Math.sin(radZ)*50);
}

function keydown(ev) {
  switch (ev.keyCode) {
    case 87: // W -> move camera forward
      dollyCamera(1, velocity);
      break;
    case 83: // S -> move camera backwards
      dollyCamera(-1, velocity);
      break;
    case 65: // A
      trackCamera(-1, velocity);
      break;
    case 68: // D
      trackCamera(1, velocity);
      break;
    case 81: // Q
      rotateCamera(1, rot_velocity);
      break;
    case 69: // E
      rotateCamera(-1, rot_velocity);
      break;
    case 50: // 2
      verticalCamera(1, rot_velocity);
      break;
    case 88:
      verticalCamera(-1, rot_velocity);
      break;
    default: return; // Skip drawing at no effective action
  }
}

function dollyCamera(dir, vel){
  /*eyeVec = new Vector3(eyeX, eyeY, eyeZ);
  atVec = new Vector3(atX, atY, eyeZ);
  upVec = new Vector3(upX, upY, upZ);*/
  var forwardX = atX - eyeX;
  var forwardY = atY - eyeY;
  var forwardZ = atZ - eyeZ;

  var temp = [forwardX, forwardY, forwardZ];

  forwardVector = new Vector3(temp);

  forwardVector.normalize();

  var temp2 = [forwardVector.elements[0], forwardVector.elements[1],forwardVector.elements[2] ];

  eyeX += temp2[0] * dir * vel;
  eyeY += temp2[1] * dir * vel;
  eyeZ += temp2[2] * dir * vel;
}

function verticalCamera(dir, vel){
  atY += dir * vel * 0.5;
}

function trackCamera(dir, vel){
  var forwardX = atX - eyeX;
  var forwardY = atY - eyeY;
  var forwardZ = atZ - eyeZ;
  
  operands1 = [forwardX, forwardY, forwardZ];
  operands2 = [upX, upY, upZ];

  sideVector = new Vector3(operands1);

  sideVector.crossProduct(operands2);

  sideVector.normalize();

  var crossProd = [sideVector.elements[0], sideVector.elements[1], sideVector.elements[2]]
  
  var sideX = crossProd[0] * dir * vel;
  var sideY = crossProd[1] * dir * vel;
  var sideZ = crossProd[2] * dir * vel;

  eyeX += sideX;
  eyeY += sideY;
  eyeZ += sideZ;

  atX += sideX;
  atY += sideY;
  atZ += sideZ;
}

function rotateCamera(dir, rot_vel){

  var offsetX = eyeX;
  var offsetY = eyeY;
  var offsetZ = eyeZ;

  var offsetAt = [atX - offsetX, atY - offsetY, atZ - offsetZ];

  rotVector = new Vector3(offsetAt);

  rotMatrix = new Matrix4();
  rotMatrix.setRotate(dir*rot_vel, upX, upY, upZ);

  rotVector = rotMatrix.multiplyVector3(rotVector);

  atX = rotVector.elements[0] + offsetX;
  atY = rotVector.elements[1] + offsetY;
  atZ = rotVector.elements[2] + offsetZ;
}

function toggleLightRotation(){
  if(lightRotating == 1) lightRotating = 0;
  else lightRotating = 1;
}