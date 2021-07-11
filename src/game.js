window.addEventListener('load', init, false);
THREE.Cache.enabled = false;

var camera;
var scene;
var renderer;
var controls;
var dom;
var id;
var score_board;
var sceneWidth=window.innerWidth;
var sceneHeight=window.innerHeight;
var stats;

var clock = new THREE.Clock();
var score = 0;
var obstacleInterval = 25;
var speedInterval = 1000;
var obstacleCounter;
var speedCounter;

function init() {
	document.getElementsByClassName('start')[0].onclick = start;
	document.getElementsByClassName('playAgain')[0].onclick = resumeGame;
	stats = createStats();
	document.body.appendChild( stats.domElement );
	createScene(); // set up the scene
	document.body.classList.add('fade')
	dom.classList.add('fade')
	document.getElementsByClassName('score')[0].classList.add('fade')
}

function setVars() {
	score = 0;
	obstacleCounter = 0;
	speedCounter = 0;
	scrollingSpeed=0.10;
	clock.start();
	scrollingPlane.rotation.x = 0;
	hero.hasCollided = false;
	set_pose(normal);
	currentLane=middleLane;
	hero.biker.position.x = currentLane;
	position_buffer = [];

}

async function createScene(){
    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0xffffff, 0.03); //fog
    camera = new THREE.PerspectiveCamera( 75, sceneWidth / sceneHeight, 0.1, 1000); //prspective camera
	camera.position.set(0, 3.5, 6.5);

    score_board = document.getElementsByClassName('value')[0];
    renderer = new THREE.WebGLRenderer({alpha:true}); //renderer with transparent backdrop
    renderer.shadowMap.enabled = true; //enable shadow
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.setSize(sceneWidth, sceneHeight);
    dom = document.getElementsByClassName('game')[0];
	dom.appendChild(renderer.domElement);
	detectSwipe(renderer.domElement, handleSwipe);
	createEnvironment();
	hero = getHero('./assets/biker/', body, scene)
	document.onkeydown = handleKeyDown;
}

function start() {
	setVars();
	dom.classList.remove('fade');
	document.body.classList.remove('fade');
	document.getElementsByClassName("gameOver")[0].classList.remove('summary');
	document.getElementsByClassName('score')[0].classList.remove('fade');
	document.getElementsByClassName('start')[0].style.display = "none";
	update(); //call game loop

}

function onWindowResize() {
	sceneHeight = window.innerHeight;
	sceneWidth = window.innerWidth;
	renderer.setSize(sceneWidth, sceneHeight);
	camera.aspect = sceneWidth/sceneHeight;
	camera.updateProjectionMatrix();
}

function render(){
    renderer.render(scene, camera); //draw
	stats.update();
}

function update(){
	console.log(hero.biker.position.y);
	id = requestAnimationFrame(update);
	if (hero && !hero.hasCollided){
		if (speedCounter >= speedInterval){
			console.log('faster');
			scrollingSpeed += 0.05;
			speedCounter = 0;
		}
		//scrollingPlane.position.z += scrollingSpeed;
		scrollingPlane1.position.z += scrollingSpeed;
        moveBuildings(scrollingSpeed);
		moveObstacles(scrollingSpeed);
		scrollingPlane.rotation.x=-Math.PI/2;
		scrollingPlane1.rotation.x=-Math.PI/2;
		nextIntStep();
		if(scrollingPlane1.position.z>=10){
		 scrollingPlane1.position.z=-10;
		}
		obstacleCounter += 1;
		speedCounter += 1;
		if(obstacleCounter >= obstacleInterval){
			obstacleCounter = 0;
			clock.start();
			addPathObstacle();
			score+=2*obstacleReleaseInterval;
			score_board.innerHTML = Math.floor(score);
			} 

		doObstacleLogic();

	} else {
		gameOver();
	}
	
    //doExplosionLogic();
	//updateParticles();
    render();
}

function resumeGame() {
	cancelAnimationFrame(id) 
	clearSet();
	start();
}

function moveBuildings(speed) {
    for (var i = 0; i < buildings.length; i++) {
        buildings[i].position.z += speed;
		if(buildings[i].position.z >= 7){
		 buildings[i].position.z = -25;
		} 
    }
	
}

function moveObstacles(speed) {
    for (var i = 0; i < obstaclesInPath.length; i++) {
        obstaclesInPath[i].position.z += speed;
    }
}

function gameOver () {
	var overlay = document.getElementsByClassName("gameOver")[0]
	overlay.classList.add('summary')
	document.getElementById('final_score_value').innerHTML = score_board.innerHTML
	document.getElementsByClassName('score')[0].classList.add('fade')
}

function createStats() {
	var stats = new Stats();
	stats.setMode(0);

	stats.domElement.style.position = 'absolute';
	stats.domElement.style.left = '0';
	stats.domElement.style.top = '0';

	return stats;
}
function dumpObject(obj, lines = [], isLast = true, prefix = '') {
	const localPrefix = isLast ? '└─' : '├─';
	lines.push(`${prefix}${prefix ? localPrefix : ''}${obj.name || '*no-name*'} [${obj.type}]`);
	const newPrefix = prefix + (isLast ? '  ' : '│ ');
	const lastNdx = obj.children.length - 1;
	obj.children.forEach((child, ndx) => {
	  const isLast = ndx === lastNdx;
	  dumpObject(child, lines, isLast, newPrefix);
	});
	return lines;
  }
