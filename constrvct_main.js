function refreshNeckline(index) {
	console.log('changing neckline');
	garment.remove(neckline);
	neckline = new THREE.Object3D();
	loadModel(neckline, getFile(necklineOptions[index]));
	garment.add(neckline);
}

function refreshSleeves(index) {
	console.log("changing sleeves");
	garment.remove(sleeves);
	sleeves = new THREE.Object3D();
	loadModel(sleeves, getFile(sleeveOptions[index]));
	garment.add(sleeves);
}

function refreshSkirt(index) {
	console.log("changing skirt " +index);
	garment.remove(skirt);
	skirt = new THREE.Object3D();
	loadModel(skirt, getFile(skirtOptions[index]));
	garment.add(skirt);
}

function updateFabric(img){
	//startLoading();
	texture = THREE.ImageUtils.loadTexture(img);
	fabricMaterial.map = texture;
	texture.wrapS = THREE.RepeatWrapping;
	texture.wrapT = THREE.RepeatWrapping;
//	texture.repeat.x = - 1;
	texture.repeat.y = - 1;
	texture.needsUpdate = true;
	resetUI();

//	setTimeout(50, function(){texture.repeat.y = - 1;});
}

var mouseIsOver, mousePressed = false;
var container, scene, camera, renderer, texture;
var dx = 0; dy=0;
var mousex = 0; mousey = 0; pmousex = 0; pmousey = 0;
var xamt = 0;
var yamt = 0;
var renderw = 460;
var renderh = 650;
var url="https://s3.amazonaws.com/constrvct_mesh/Andrea/";
var loading = document.createElement("IMG");
loading.src = url+"loading.gif";
loading.style.position="absolute";
loading.style.left="200px";
loading.style.top="170px";
loading.style.width="70px";

function startLoading(){
	loading.style.opacity="1";
};

function finishedLoading(){
	loading.style.opacity="0";

};

document.onmousedown = function() {
  mousePressed = true;
  }
  document.onmouseup = function() {
  mousePressed = false;
  }

function initPocket(file) {
	loadModel(pocket, file);
	console.log("loading " +file);
	//garment.add(pocket);
}
function togglePocket(mode){
	if (mode == true) {
		garment.add(pocket);
	} else {
		garment.remove(pocket);
	}
}

function initBelt(file) {
	loadModel(belt, file);
	console.log("loading " +file);
	garment.add(belt);
}

function init3DBuild(necklinefile, sleevesfile, skirtfile, img){
	mouseIsOver = false;
	console.log('init 3D');
	container = document.getElementById("render-container");
//	container.appendChild(loading);
	scene = new THREE.Scene();

	camera = new THREE.PerspectiveCamera(45, renderw / renderh, 1, 2000);
	camera.position.z = 120;
	scene.add(camera);

	var ambient = new THREE.AmbientLight(0x0C0C0C);
	scene.add(ambient);

	var directionalLight = new THREE.DirectionalLight(0xD6D6D6);
	directionalLight.position.set(70, 70, 100);
	//.normalize();
	scene.add(directionalLight);

	var directionalLight2 = new THREE.DirectionalLight(0xD6D6D6);
	directionalLight2.position.set(-70, 70, 100);

	scene.add(directionalLight2);

	if (img.length > 1) {
		texture = THREE.ImageUtils.loadTexture(img);
		texture.wrapS = THREE.RepeatWrapping;
		texture.wrapT = THREE.RepeatWrapping;
		//texture.repeat.x = - 1;
		texture.repeat.y = - 1;
		texture.needsUpdate = true;

	} else {
		texture = new THREE.Texture(front_canvas);
		canvastexture=true;
		texture.needsUpdate = true;
	}


	loadModel(neckline, necklinefile);
	console.log("loading "+ necklinefile);

	if(sleevesfile !="") {
		loadModel(sleeves, sleevesfile);
		console.log("loading "+ sleevesfile);
	}
	if(skirtfile !="") {
		loadModel(skirt, skirtfile);
		console.log("loading "+ skirtfile);
	}

	garment.add(neckline);
	garment.add(sleeves);
	garment.add(skirt);

	scene.add(garment);

	renderer = new THREE.WebGLRenderer( { antialias: true, preserveDrawingBuffer : true } );
	renderer.setSize(renderw, renderh);
	renderer.domElement.id = "GL";
	container.appendChild(renderer.domElement);
	//$("#GL").css('z-index',10);

	animate();

	dx = getPositionLeft(document.getElementById("render-container")) - 5;
	dy = getPositionTop(document.getElementById("render-container")) - 5;

	var yamt = 0, xamt = 0;
	container.onmousemove = function(event) {
		if (mousePressed){
			pmousex = mousex;
			pmousey = mousey;

			mousex = event.pageX - dx;
			mousey = event.pageY - dy;
			ease = 0.9;

			if (tool == "rotate"){
				//Rotate left and right
				xamt = (mousex-pmousex)/100;
				if (Math.abs(xamt) > .3){
					xamt = 0;
				}
				//Rotate up and down
				yamt = (mousey-pmousey)/50;
				if (Math.abs(yamt) > .3){
					yamt = 0;
				}
				garment.rotation.x += yamt;
				garment.rotation.y += xamt;
		}

		if (tool == "move"){
			xamt = -(mousex-pmousex)/1000;
			if (Math.abs(xamt) > .02){
				xamt = 0;
			}
			yamt = -(mousey-pmousey)/1000;
			if (Math.abs(yamt) > .02){
				yamt = 0;
			}
			texture.offset.x += xamt;
			texture.offset.y += yamt;

			setPosValues(texture.offset.x.toFixed(3), texture.offset.y.toFixed(3));
		}

	}
}

	container.onmouseup = function() {
		var rot = ((garment.rotation.y+Math.PI)/(Math.PI*2)) * 360;
		//$("#rotate-slider").slider('value', rot);
	}

	container.onmouseover = function(event) {
		mouseIsOver = true;
	}

	container.onmouseout = function(event) {
		mouseIsOver = false;
	}

}

var texture;
var fabricMaterial = new THREE.MeshLambertMaterial({alphaTest:.5, color: 0xdddddd});


function loadModel(obj,path) {
		loading.style.opacity="1";
		fabricMaterial.map = texture;
		//obj.castShadow = true;
		//obj.receiveShadow = true;

		var loader = new THREE.JSONLoader();
		loader.load( path, function( geometry ) {
			console.log(geometry);
			for (var i=0; i<geometry.materials.length; i++) {
				console.log(geometry.materials[i]);
			 	geometry.materials[i] = fabricMaterial;
			}
			 //geometry.doubleSided = true;

			//geometry.scale.set(5,5,5);
			//geometry.computeBoundingBox();

			var zmesh = new THREE.Mesh( geometry, new THREE.MeshFaceMaterial() );
			zmesh.scale.set( 2, 2, 2 );
			zmesh.position.y = 10;
			//setTimeout(function(){$("#loading").hide(); },1000);
			//scene.add( zmesh );
			zmesh.doubleSided = true;
			obj.add(zmesh);
			//obj.doubleSided=true;
			loading.style.opacity="0";
		});

}

function getPositionLeft(This) {
	var el = This;
	var pL = 0;
	while(el) {
		pL += el.offsetLeft;
		el = el.offsetParent;
	}
	return pL
}

function getPositionTop(This) {
	var el = This;
	var pT = 0;
	while(el) {
		pT += el.offsetTop;
		el = el.offsetParent;
	}
	return pT
}

function animate() {

	requestAnimationFrame(animate);
	render();
}

function render() {

	camera.lookAt(scene.position);

	renderer.render(scene, camera);
}
