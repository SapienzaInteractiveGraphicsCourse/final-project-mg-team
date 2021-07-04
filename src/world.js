var gravity=0.005;
var worldRadius=26;
var scrollingSpeed=0.10;
var scrollingPlane;

function createPathStrings(folder) {
  const basePath = `./assets/scene/${folder}/`;
  const sides = ['ft', 'bk', 'up', 'dn', 'rt', 'lf'];
  const pathStings = sides.map(side => {
    return `${basePath}${side}.jpg`;
  });

  return pathStings;
}

function createSkyBox(rotation=0){

	const skyboxImagepaths = createPathStrings(3);
	const materialArray = skyboxImagepaths.map(image => {
		let texture = new THREE.TextureLoader().load(image);
		return new THREE.MeshBasicMaterial({ map: texture, side: THREE.BackSide });
	});

	let skyboxGeo = new THREE.BoxGeometry(50, 50, 50);
	skybox = new THREE.Mesh(skyboxGeo, materialArray);
	skybox.rotation.y = rotation
	skybox.position.y -= 8
	scene.add(skybox)
}

function createEnvironment(){
	addWorld();
	addLight();
	addWorldBuilding();
	setOrbitControl();
	createObstaclePool();
    createSkyBox();
}

function addWorld(){
	var planeGeometry = new THREE.PlaneGeometry(10000,40);
	var texture = textureLoader.load('./assets/scene/road.png', function(texture) {
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        texture.offset.set(0, 0);
        texture.repeat.set(1500, 3);
    });

	var planeMaterial = new THREE.MeshBasicMaterial( { map:texture} )

	scrollingPlane = new THREE.Mesh( planeGeometry, planeMaterial );
	scrollingPlane.receiveShadow = true;
	scrollingPlane.castShadow=false;
	//rollingGroundSphere.position.z=1;
	scrollingPlane.rotation.z=Math.PI/2;
	scene.add(scrollingPlane);
}

function addLight(){

	var hemisphereLight = new THREE.HemisphereLight(0xfffafa,0x000000, .9)
	scene.add(hemisphereLight);
	var sun = new THREE.DirectionalLight(0xcdc1c5, 0.9);
	sun.position.set(12, 6, -7);
	sun.castShadow = true;
	scene.add(sun);

	//Set up shadow properties for the sun light
	sun.shadow.mapSize.width = 256;
	sun.shadow.mapSize.height = 256;
	sun.shadow.camera.near = 0.5;
	sun.shadow.camera.far = 50 ;
}