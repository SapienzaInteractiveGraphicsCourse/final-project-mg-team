var car;
var building;
var obstacleReleaseInterval=0.4;
var pathValues=[-4,0,4];
var obstaclesInPath=[];
var obstaclePool=[];
var buildings = [];

var leftLane=-4;
var rightLane=4;
var middleLane=0;
var currentLane=middleLane;

var newTime = new Date().getTime();
var oldTime = new Date().getTime();

async function loadCar(){
	car = await loadModel('./assets/car/car.gltf')
	car.type = 'car'
}

async function loadBuilding(){
	building = await loadModel('./assets/building/building.gltf')
}

/*async function loadUnknown(){ 
	snowy_tree = await loadModel('./assets/snowy_tree/model.gltf')
	snowy_tree.position.y=0.25;
	snowy_tree.type = 'tree'
	normal_tree = await loadModel('./assets/normal_tree/model.gltf')
	normal_tree.position.y=0.25;
	normal_tree.type = 'tree'
}*/

async function createObstaclePool(){

	//if (!normal_tree) await loadUnknown();
	if (!car) await loadCar();
	var maxObsInPool=100;
	var obstacle;
	for(var i=0; i < maxObsInPool; i++){
		obstacle = createObstacle();
		obstaclePool.push(obstacle);
	}
}

function createObstacle(){
	/*if (Math.random() > 0.3){
		return createTree();
	} else {
		return createCar();
	}*/
	return createCar();
}
function createCar(){
	if (car) {
		let clone = car.clone()
		rotation = Math.PI 
		clone.scale.set(1, 1, 1);
		clone.rotation.y = rotation;
		clone.position.y=0.3;
		return clone
	};
}

function createBuilding(){
	if (building) {
		let clone = building.clone()
		//scale = Math.random() * (1.5 - 0.5) + 0.5;
		rotation = Math.PI/2; 
		clone.scale.set(2, 2, 2);
		clone.rotation.y = rotation;
		return clone
	};
}


function clearSet() {

	obstaclesInPath.forEach(function (element, index) {
		scene.remove(element);
	});

	obstaclePool.forEach(function (element, index) {
		scene.remove(element);
	});
	obstaclesInPath=[];
	obstaclePool=[];
	createObstaclePool();
}

function doObstacleLogic(){
	var obstacle;
	var fromWhere;
	var obstaclePos = new THREE.Vector3();
	var obstaclesToRemove = [];
	
	obstaclesInPath.forEach(function (element, index) {
		obstacle=obstaclesInPath[index];
		obstaclePos=obstacle.position;
		if(obstaclePos.z > 6 && obstacle.visible){ //gone out of our view zone
			obstaclesToRemove.push(obstacle);
		} else { //check collision
			if (hero) {
				if(hero.biker.position.distanceTo(obstaclePos)<=1){
					hero.hasCollided=true;
					//explode();
				}
			}
		}
	});

	obstaclesToRemove.forEach(function (element, index) {
		obstacle = obstaclesToRemove[index];
		fromWhere = obstaclesInPath.indexOf(obstacle);
		obstaclesInPath.splice(fromWhere,1);
		obstaclePool.push(obstacle);
		obstacle.visible=false;
	});
}


/*function createUnknown(){
	
	var array = [normal_tree, snowy_tree]
	var tree = array[Math.floor(Math.random() * array.length)];
	if (tree) {return tree.clone()};
}*/

function addBuilding(left,z){

	let newBuilding = createBuilding();

	if (left) {
		newBuilding.position.x=-9;
		newBuilding.position.z-=z;
	} else {
		newBuilding.position.x=9; //[1.52,1.57,1.62];
		newBuilding.position.z-=z;
	}
	scene.add(newBuilding);
	buildings.push(newBuilding);
}


function addObstacle(lane,time){
	newTime = new Date().getTime();
	if (newTime - oldTime > time) {
        oldTime = new Date().getTime();
	    var obstacle;
	    if(obstaclePool.length==0) return;
	    obstacle = obstaclePool.pop();
	    obstacle.visible=true;
	    obstaclesInPath.push(obstacle);
	    if (obstacle) {
		   obstacle.position.x=pathValues[lane];
		   obstacle.position.z=-20;
		   scene.add(obstacle);
	    }
    }
}

function addPathObstacle(){
	var options=[0,1,2];
	var lane= Math.floor(Math.random()*3);
	var time=2000;
	if(scrollingSpeed>0.15 && scrollingSpeed<=0.16){
		time=1000;
	}
	if(scrollingSpeed>0.16 && scrollingSpeed<=0.21){
		time=500;
	}
	if(scrollingSpeed>0.21){
		time=250;
	}
	console.log(time);
	console.log(scrollingSpeed);
	addObstacle(lane,time);
	options.splice(lane,1);
	if(Math.random()>0.7){
		lane = Math.floor(Math.random()*2);
		addObstacle(options[lane]);
	}
}

async function addWorldBuilding(){
	if (!building) await loadBuilding();
	var numTrees=90;
	var z=0;
	for(var i=0;i<numTrees;i++){
		addBuilding(true,z);
		addBuilding(false,z);
		z+=6;
	}
}
