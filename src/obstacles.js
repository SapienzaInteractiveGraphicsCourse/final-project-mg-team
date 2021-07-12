var car;
var car1;
var tree;
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
	car = await loadModel('./assets/car/car.gltf');
	car.type = 'car';
}

async function loadCar1(){
    car1= await loadModel('./assets/car1/car1.gltf');
    car1.type= 'car1';
}

async function loadBuilding(){
	building = await loadModel('./assets/building/scene.gltf');
}

async function loadTree(){ 
	tree = await loadModel('./assets/tree/scene.gltf');
	tree.position.y=0;
	tree.type = 'tree';
}

async function createObstaclePool(){

	if (!car1) await loadCar1();
	if (!car) await loadCar();
	var maxObsInPool=100;
	var obstacle;
	for(var i=0; i < maxObsInPool; i++){
		obstacle = createObstacle();
		obstaclePool.push(obstacle);
	}
}

function createObstacle(){
	if (Math.random() > 0.3){
		return createCar();
	} else {
		return createCar1();
	}
}
function createCar(){
	if (car) {
		let clone = car.clone()
		rotation = -Math.PI/2 ;
		clone.scale.set(0.025, 0.025, 0.025);
		clone.rotation.y = rotation;
		clone.position.y=0.3;
		return clone
	};
}

function createCar1(){
	if (car1) {
		let clone = car1.clone()
		rotation =  Math.PI/2;
		clone.scale.set(0.7, 0.7, 0.7);
		clone.rotation.y = rotation;
		clone.position.y=0.3;
		return clone
	};
}

function createBuilding(){
	if (building) {
		let clone = building.clone()
		rotation = Math.PI/2; 
		//clone.scale.set(2, 2, 2);//precedent building
		clone.scale.set(0.002, 0.002, 0.002);
		clone.rotation.y = rotation;
		clone.position.y = -0.6;
		return clone
	};
}

function createTree(){
	if (tree) {
		let clone = tree.clone()
		//scale = Math.random() * (1.5 - 0.5) + 0.5;
		rotation = 0; 
		clone.scale.set(0.2, 0.2, 0.2);
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


function addBuilding(left,z){

	let newBuilding = createBuilding();

	if (left) {
		newBuilding.position.x=-9;
		newBuilding.position.z-=z;
	} else {
		newBuilding.position.x=9; 
		newBuilding.position.z-=z;
		newBuilding.rotation.y=-Math.PI/2;
	}
	scene.add(newBuilding);
	buildings.push(newBuilding);
}

function addTree(left,z){

	let newTree = createTree();

	if (left) {
		newTree.position.x=-11;
		newTree.position.z-=z;
	} else {
		newTree.position.x=11; 
		newTree.position.z-=z;
	}
	scene.add(newTree);
	buildings.push(newTree);
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
	if(scrollingSpeed>0.21 && scrollingSpeed<=0.27){
		time=250;
	}
	if(scrollingSpeed>0.27){
		time=50;
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
	if (!tree) await loadTree();
    var numTrees=4;
	var z=0;
	for(var i=0;i<numTrees;i++){
		console.log(numTrees);
		if(i%2==0){
		 addBuilding(true,z);
		 addTree(false,z);
		}
		else{
		 addBuilding(false,z);
		 addTree(true,z);	
		}
		z+=7;
	}
}