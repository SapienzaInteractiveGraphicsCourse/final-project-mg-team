var gravity=0.005;
var worldRadius=26;
var scrollingSpeed=0.10;
var scrollingPlane;
var scrollingPlane1;

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
	var planeGeometryAsphalt = new THREE.PlaneGeometry(10000,40);
	var planeGeometryRoad = new THREE.PlaneGeometry(10000,12);
    
	var textureasphalt = textureLoader.load('./assets/scene/asphalt.png', function(textureasphalt) {
        textureasphalt.wrapS = textureasphalt.wrapT = THREE.RepeatWrapping;
        textureasphalt.offset.set(0, 0);
        textureasphalt.repeat.set(1500, 1500);
    });

	var textureroad = textureLoader.load('./assets/scene/road.png', function(textureroad) {
        textureroad.wrapS = textureroad.wrapT = THREE.RepeatWrapping;
        textureroad.offset.set(0, 0);
        textureroad.repeat.set(800, 1);
    });

	var planeMaterial = new THREE.MeshBasicMaterial( { map:textureasphalt} )
	var roadMaterial = new THREE.MeshBasicMaterial( { map:textureroad} )

	scrollingPlane = new THREE.Mesh( planeGeometryAsphalt, planeMaterial );
	scrollingPlane1 = new THREE.Mesh( planeGeometryRoad, roadMaterial );
	scrollingPlane.receiveShadow = true;
	scrollingPlane.castShadow=false;
	scrollingPlane.rotation.z=Math.PI/2;
	scrollingPlane1.rotation.z=Math.PI/2;
	scrollingPlane1.position.set(0,0.1,0);
	scene.add(scrollingPlane);
	scene.add(scrollingPlane1);
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