"use strict";


var canvas;
var gl;


var beatDirec = 0.5;
var texture;
// var numVertices = 36;
var pointsArray = [];
var texCoordsArray = [];
var HBrate1 = 10;
var HBrate2 = 30;
var scale = 1.0;
var heartbeat =  HBrate2;

var isOrtho = true;
//  add
var fColor;
var vPosition;
var vBufferId;
var tBuffer;

var frog = 5;


var nRows = 20;
var nColumns = 20;

//  平行投影
const near   =  0.2;
const far    =  9.0;
const left   = -2.0;
const right  =  2.0;
const vtop   =  2.0;
const bottom = -2.0;
//  透视投影
const fovy   = 85.0;    //  Field-of-view in Y direction angle (in degrees)
const aspect = 1.0;     //  Viewport aspect ratio


//  lookAt函数参数
var  eye = vec3(4.5, 0.0, 0.0);
var   at = vec3(0.0, 0.0, 0.0);
const up = vec3(0.0, 1.0, 0.0);
//  相机坐标
var x = 1;
var y = 1.005;
var z = 1.400;
var spx = 1.0;
var spy = 1.0;
var spz = 1.0;

var scaleMatrix, modelViewMatrix, projectionMatrix;
var scaleMatrixLoc, modelViewMatrixLoc, projectionMatrixLoc;

var moveRightFlag = false;
var moveLeftFlag = false;
var moveUpFlag = false;
var moveDownFlag = false;
var rotateRightFlag = false;
var rotateLeftFlag = false;
var restore = false;

var moveMatrix = translate(0,0,0.0);
var rotateMatrix = rotateZ(0);


//使用Hat建模获得一个墨西哥帽
function loadHatPoints(){
    var data = [];
    for( var i = 0;i < nRows ; ++i) {
	  data.push([]);
	  var x = Math.PI*(4*i/nRows-2.0);
	  for ( var j = 0 ; j < nColumns ; ++j ) {
        var y = Math.PI*(4*j/nRows-2.0);
        var r = Math.sqrt(x*x+y*y + heartbeat);
		  data[i][j] = r ? Math.sin(r) /r : 1.0;

	  }
    }
    //图元是三角扇，取四个点画两个三角形
    pointsArray.length=0;
    texCoordsArray.length=0;
    for(var i=1; i<nRows-1; i++){
        for(var j = 1; j<nColumns-2;j++){

            pointsArray.push(vec4(2*i/nRows-1, data[i][j] , 2*j/nColumns-1,1.0));
            pointsArray.push(vec4(2*i/nRows-1,-1,2*j/nColumns-1,1.0));
            pointsArray.push(vec4(2*i/nRows-1, data[i][j] , 2*j/nColumns-1,1.0));
            pointsArray.push(vec4(2*(i+1)/nRows-1,data[i+1][j] , 2*j/nColumns-1,1.0));
            pointsArray.push(vec4(2*(i+1)/nRows-1,-1 , 2*j/nColumns-1,1.0));
            pointsArray.push(vec4(2*(i+1)/nRows-1,data[i+1][j] , 2*j/nColumns-1,1.0));
            pointsArray.push(vec4(2*(i+1)/nRows-1,data[i+1][j+1] , 2*(j+1)/nColumns-1,1.0));
            pointsArray.push(vec4(2*(i+1)/nRows-1,-1 , 2*(j+1)/nColumns-1,1.0));
            pointsArray.push(vec4(2*(i+1)/nRows-1,data[i+1][j+1] , 2*(j+1)/nColumns-1,1.0));
            pointsArray.push(vec4(2*i/nRows-1, data[i][j] , 2*j/nColumns-1,1.0));
            pointsArray.push(vec4(2*i/nRows-1, -1 , 2*j/nColumns-1,1.0));
            pointsArray.push(vec4(2*i/nRows-1, data[i][j] , 2*j/nColumns-1,1.0));
            pointsArray.push(vec4(2*(i+1)/nRows-1,data[i+1][j+1] , 2*(j+1)/nColumns-1,1.0));
            pointsArray.push(vec4(2*(i+1)/nRows-1,-1 , 2*(j+1)/nColumns-1,1.0));
            pointsArray.push(vec4(2*(i+1)/nRows-1,data[i+1][j+1] , 2*(j+1)/nColumns-1,1.0));
            pointsArray.push(vec4(2*i/nRows-1,data[i][j+1] , 2*(j+1)/nColumns-1,1.0));
            pointsArray.push(vec4(2*i/nRows-1,-1 , 2*(j+1)/nColumns-1,1.0));
            pointsArray.push(vec4(2*i/nRows-1,data[i][j+1] , 2*(j+1)/nColumns-1,1.0));

            texCoordsArray.push(vec2(0,0));
            texCoordsArray.push(vec2(0,0));
            texCoordsArray.push(vec2(0,0));
            texCoordsArray.push(vec2(0,0));
            texCoordsArray.push(vec2(0,0));
            texCoordsArray.push(vec2(0,0));
            texCoordsArray.push(vec2(0,0));
            texCoordsArray.push(vec2(0,0));
            texCoordsArray.push(vec2(0,0));
            texCoordsArray.push(vec2(0,0));
            texCoordsArray.push(vec2(0,0));
            texCoordsArray.push(vec2(0,0));
            texCoordsArray.push(vec2(0,0));
            texCoordsArray.push(vec2(0,0));
            texCoordsArray.push(vec2(0,0));
            texCoordsArray.push(vec2(0,0));
            texCoordsArray.push(vec2(0,0));
            texCoordsArray.push(vec2(0,0));

        }
    }


    for(var i=1; i<nRows-1; i++){
        for(var j = 1; j<nColumns-2;j++){

            pointsArray.push(vec4(2*i/nRows-1, data[i][j] , 2*j/nColumns-1,1.0));
            pointsArray.push(vec4(2*(i+1)/nRows-1,data[i+1][j] , 2*j/nColumns-1,1.0));
            pointsArray.push(vec4(2*(i+1)/nRows-1,data[i+1][j+1] , 2*(j+1)/nColumns-1,1.0));
            pointsArray.push(vec4(2*i/nRows-1, data[i][j] , 2*j/nColumns-1,1.0));
            pointsArray.push(vec4(2*(i+1)/nRows-1,data[i+1][j+1] , 2*(j+1)/nColumns-1,1.0));
            pointsArray.push(vec4(2*i/nRows-1,data[i][j+1] , 2*(j+1)/nColumns-1,1.0));




            texCoordsArray.push(vec2(i/58,j/58));
            texCoordsArray.push(vec2((i+1)/58,j/58));
            texCoordsArray.push(vec2((i+1)/58,(j+1)/58));
            texCoordsArray.push(vec2(i/58,j/58));
            texCoordsArray.push(vec2((i+1)/58,(j+1)/58));
            texCoordsArray.push(vec2(i/58,(j+1)/58));
        }
    }



    for(var i=0;i<pointsArray.length;i++){
        var c = [];
        var c1 = [];
        c1.push(pointsArray[i]);
        c.push(c1[0][0]);
        c.push(c1[0][1]);
        c.push(c1[0][2]);
        c.push(c1[0][3]);
        c.matrix = true;

        var tranMatrix = mult1(moveMatrix,rotateMatrix);
        pointsArray[i] = transpose(mult(tranMatrix, c))[0];
    }

}


window.onload = function init() {
    loadHatPoints();

    
    canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL(canvas);
    if ( !gl ) { alert("WebGL isn't available"); }

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );
    // enable depth testing and polygon offset
    // so lines will be in front of filled triangles
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    gl.enable(gl.POLYGON_OFFSET_FILL);
    gl.polygonOffset(1.0, 2.0);
    gl.clearColor( 0.5, 0.5, 0.5, 1.0 );




    //  Load shaders and initialize attribute buffers
    var program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    function configureTexture( image ) {
        texture = gl.createTexture();
        gl.bindTexture( gl.TEXTURE_2D, texture );
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        gl.texImage2D( gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image );


        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);


        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

        gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST );

        gl.uniform1i(gl.getUniformLocation(program, "texture"), 0);
    }
   // var image = document.getElementById("texImage");

    //configureTexture( image );
var image = new Image();
image.crossOrigin = "Anonymous";
image.src = "water.jpg";
 image.onload = function() {
    configureTexture( image );
 }



    vBufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBufferId);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(pointsArray), gl.STATIC_DRAW);

    vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    fColor = gl.getUniformLocation(program, "fColor");

    tBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, tBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(texCoordsArray), gl.STATIC_DRAW );

    var vTexCoord = gl.getAttribLocation( program, "vTexCoord" );
    gl.vertexAttribPointer( vTexCoord, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vTexCoord );

    scaleMatrixLoc = gl.getUniformLocation(program, 'u_scaleMatrix');
    projectionMatrixLoc = gl.getUniformLocation(program, "u_projectionMatrix");
    modelViewMatrixLoc = gl.getUniformLocation(program, "u_modelViewMatrix");

    //  task1
    scale = 1.0;
    var lightPosition = vec4(-50.0, -50.0, 0.0, 0.0 );
    var lightAmbient = vec4(0.2, 0.2, 0.2, 1.0 );
    var lightDiffuse = vec4( 1.0, 1.0, 1.0, 1.0 );
    var lightSpecular = vec4( 1.0, 1.0, 1.0, 1.0 );

    var materialAmbient = vec4( 1.8, 1.8, 1.8, 1.0 );
    var materialDiffuse = vec4( 2.4, 3.0, 2.4, 1.0 );
    var materialSpecular = vec4( 0.5, 0.8, 0.5, 1.0 );
    var materialShininess = 50.0;

    var ambientProduct = mult(lightAmbient, materialAmbient);
    var diffuseProduct = mult(lightDiffuse, materialDiffuse);
    var specularProduct = mult(lightSpecular, materialSpecular);

    gl.uniform4fv( gl.getUniformLocation(program, "ambientProduct"),flatten(ambientProduct ));
    gl.uniform4fv( gl.getUniformLocation(program, "diffuseProduct"), flatten(diffuseProduct) );
    gl.uniform4fv( gl.getUniformLocation(program, "specularProduct"),flatten(specularProduct));
    gl.uniform4fv( gl.getUniformLocation(program, "lightPosition"), flatten(lightPosition ));
    gl.uniform1f( gl.getUniformLocation(program, "shininess"),materialShininess );

    //雾的颜色
    var fogColor = new Float32Array([0.5, 0.5, 0.5]);
   //雾化的起点和终点与视点间的距离【起点距离， 终点距离】
    var fogDist = new Float32Array([0.5, frog]);
    var eye = new Float32Array(vec3(50,100,-20));

    var u_FogColor = gl.getUniformLocation(program, "u_FogColor");
    var u_FogDist = gl.getUniformLocation(program, "u_FogDist");
    var u_Eye = gl.getUniformLocation(program, "u_Eye");
    //将雾的颜色，起点与终点，视点坐标传给对应的uniform变量
    gl.uniform3fv(u_FogColor, fogColor); //雾的颜色
    gl.uniform2fv(u_FogDist, fogDist); //起点和终点
    gl.uniform4fv(u_Eye, eye); //视点


    // 键盘控制完成task1、task2、task3
    window.onkeydown = function(event){
        var keyDownEvent = event || window.event || arguments.callee.caller.arguments[0]
        
        // 键'L'的键值是76
        if(keyDownEvent && keyDownEvent.keyCode == 76){
            scale = scale * 1.1
            //this.console.log('L down')
        }
        //  键'J'的键值是74
        if(keyDownEvent && keyDownEvent.keyCode == 74){
            scale = scale * 0.9
            //this.console.log("J down")
        }
        // 键'P'的键值是80
        if(keyDownEvent && keyDownEvent.keyCode == 80){
            isOrtho = !isOrtho
            //this.console.log("P down")
        }


        // 绕X轴旋转
        // 键'W'的键值是87
        if (keyDownEvent && keyDownEvent.keyCode == 83) {
            spx = x;
            spy = y;
            spz = z;
            y =  Math.cos(-0.1) * spy - Math.sin(-0.1) * spz ;
            z =  Math.sin(-0.1) * spy + Math.cos(-0.1) * spz ;
            //this.console.log("x:" + x, 'y:' + y , 'z: '+ z)
          }
          // 键'S'的键值是87
          if (keyDownEvent && keyDownEvent.keyCode == 87) {
            spx = x;
            spy = y;
            spz = z;
            y =  Math.cos(0.1) * spy - Math.sin(0.1) * spz ;
            z =  Math.sin(0.1) * spy + Math.cos(0.1) * spz ;
            //this.console.log("x:" + x, 'y:' + y , 'z: '+ z)
          }

          // 绕Z轴旋转
          // 键'A'的键值是87
          if (keyDownEvent && keyDownEvent.keyCode == 68) {
            spx = x;
            spy = y;    
            spz = z;
            x =  Math.cos(-0.1) * spx - Math.sin(-0.1) * spz ;
            z =  Math.sin(-0.1) * spx + Math.cos(-0.1) * spz ;
            //this.console.log("x:" + x, 'y:' + y , 'z: '+ z)
        }
          // 键'D'的键值是87
          if (keyDownEvent && keyDownEvent.keyCode == 65) {
            spx = x;
            spy = y;
            spz = z;
            x =  Math.cos(0.1) * spx - Math.sin(0.1) * spz ;
            z =  Math.sin(0.1) * spx + Math.cos(0.1) * spz ;
            //this.console.log("x:" + x, 'y:' + y , 'z: '+ z)
        }
    }


     //  Task4，跟随浏览器放大缩小
     window.onresize=function(){
        canvas.width=window.innerWidth * 0.28;
        canvas.height=canvas.width;
        gl.viewport( 0, 0, canvas.width, canvas.height );
    };
    render();
    document.getElementById("move-left").onclick = function () {
        moveLeftFlag = true;
    };
    document.getElementById("move-right").onclick = function () {
        moveRightFlag = true;
    };
    document.getElementById("move-up").onclick = function () {
        moveUpFlag = true;
    };
    document.getElementById("move-down").onclick = function () {
        moveDownFlag = true;
    };
    document.getElementById("rotate-left").onclick = function () {
        rotateLeftFlag = true;
    };
    document.getElementById("rotate-right").onclick = function () {
        rotateRightFlag = true;
    };
    document.getElementById("restore").onclick = function () {
        restore = true;
    };
    //*******增加滑动条的监听程序,波动幅度
    document.getElementById("slider").onchange = function(event) {
        var val = parseInt(event.target.value);
        if(val==0){
            HBrate1 = 20;
            HBrate2 = 30;
            heartbeat = HBrate2;
        }
        if(val==1){
            HBrate1 = 8;
            HBrate2 = 20;
            heartbeat = HBrate2;
        }
        if(val==2){
            HBrate1 = 6;
            HBrate2 = 10;
            heartbeat = HBrate2;
        }
        if(val==3){
            HBrate1 = 5;
            HBrate2 = 8;
            heartbeat = HBrate2;
        }
        if(val==4){
            HBrate1 = 3;
            HBrate2 = 6;
            heartbeat = HBrate2;
        }
        if(val==5){
            HBrate1 = 1;
            HBrate2 = 4;
            heartbeat = HBrate2;
        }

    };
    // //*******增加滑动条的监听程序,改变雾度
    document.getElementById("slider1").onchange = function(event) {
        frog = 4.0 - parseInt(event.target.value)*0.4+0.5;
        console.log(frog);
        fogDist = new Float32Array([0.5, frog]);
        u_FogDist = gl.getUniformLocation(program, "u_FogDist");
        gl.uniform2fv(u_FogDist, fogDist); //起点和终点



     };
}
function move(a,b){
    var a1 = moveMatrix[0][3];
    var b1 = moveMatrix[1][3];
    moveMatrix = translate(a+a1,b+b1,0.0);
    loadHatPoints();

}
function rotation(theta) {

   rotateMatrix = mult1(rotateZ(theta),rotateMatrix);

}
function buttonAction(){
    if(moveDownFlag){
        move(0,-0.105);
        moveDownFlag = false;
    }
    if(moveUpFlag){
        move(0,0.105);
        moveUpFlag = false;
    }
    if(moveRightFlag){
        move(0.1,0);
        moveRightFlag = false;
    }
    if(moveLeftFlag){
        move(-0.1,0);
        moveLeftFlag = false;
    }

    if(rotateLeftFlag){
        rotation(-10);
        rotateLeftFlag = false;
    }
    if(rotateRightFlag){
        rotation(10);
        rotateRightFlag = false;
     }



}


var render = function() {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    scaleMatrix = new Float32Array([
        scale, 0.0,   0.0,   0.0,
        0.0,   scale, 0.0,   0.0,
        0.0,   0.0,   scale, 0.0,
        0.0,   0.0,   0.0,   1.0
    ]);
    buttonAction();

    if(isOrtho) {
        projectionMatrix = ortho(left, right, bottom, vtop, near, far);
        document.getElementById("viewState").value = String('正射投影(isOrtho)')
    } else {
        projectionMatrix = perspective(fovy, aspect, near, far);
        document.getElementById("viewState").value = String('透视投影(perspective)')
    }

    if(restore){
        moveMatrix = translate(0,0,0.0);
        rotateMatrix = rotateZ(0);
        restore = false;
    }

     if(heartbeat<HBrate1||heartbeat>HBrate2){
        beatDirec = -1*beatDirec;
    }
    heartbeat = heartbeat + beatDirec;

        loadHatPoints();
        gl.bindBuffer(gl.ARRAY_BUFFER, vBufferId);
        gl.bufferData(gl.ARRAY_BUFFER, flatten(pointsArray), gl.STATIC_DRAW);
        gl.bindBuffer( gl.ARRAY_BUFFER, tBuffer );
        gl.bufferData( gl.ARRAY_BUFFER, flatten(texCoordsArray), gl.STATIC_DRAW );

    eye = vec3(x, y, z);
    modelViewMatrix = lookAt(eye, at, up);
    
    gl.uniformMatrix4fv(scaleMatrixLoc, false, scaleMatrix);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projectionMatrix));


    // draw each quad as two filled red triangles
    // and then as two black line loops
    for(var i=0; i<pointsArray.length; i+=6) {
        // gl.uniform4fv(fColor, flatten(red));
        // gl.drawArrays(gl.TRIANGLE_FAN, i, 4);
        // gl.uniform4fv(fColor, flatten(black));
        // gl.drawArrays(gl.LINE_LOOP, i, 4);
        gl.drawArrays( gl.TRIANGLE_STRIP, i,6);

    }
    gl.drawArrays( gl.TRIANGLES, 0,pointsArray.length);

    requestAnimFrame(render);
}
