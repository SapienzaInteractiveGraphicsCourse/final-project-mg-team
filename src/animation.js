var pose_counter = 0;
var position_buffer = [];
var bounceValue=0.1;

function handleKeyDown(keyEvent){
	var next_move = [];

	if (keyEvent.keyCode === 37) {//left

		currentLane = Math.max(currentLane - 4, -4);
		next_move = fill_pose(dcopy(shift_left));
		next_next_move = fill_pose(dcopy(normal));
		next_move.push({name: 'biker.position.x', value: currentLane})
		next_next_move.push({name: 'biker.position.x', value: currentLane})
		position_buffer = position_buffer.concat([next_move, next_next_move])

	} else if (keyEvent.keyCode === 39) {//right

		currentLane = Math.min(currentLane + 4, 4);
		next_move = fill_pose(dcopy(shift_right));
		next_next_move = fill_pose(dcopy(normal));
		next_move.push({name: 'biker.position.x', value: currentLane})
		next_next_move.push({name: 'biker.position.x', value: currentLane})
		position_buffer = position_buffer.concat([next_move, next_next_move])

	}
}

function getCurrentState(){

	let full_pose = dcopy(hero._pose)
	full_pose = full_pose.map((conf) => {
		conf.value = eval(`hero.${conf.name}`)
		return conf;
	})
	return full_pose;
}

function nextIntStep(){
	if (position_buffer.length){
		if (position_buffer.length > 2){
			position_buffer = position_buffer.slice(-2)
			pose_counter = 0;
		}
		interpolateStates(position_buffer[0]);
		pose_counter += 1;
		if (pose_counter >= 25) {
			position_buffer.shift();
			pose_counter = 0;
		}
	}
	if (hero.base) {
	  if(hero.base.position.y<=heroBaseY){
			bounceValue=(Math.random()*0.005)+0.005;
		}
		hero.base.position.y+=bounceValue;
		bounceValue-=gravity;
	};
}

function interpolateStates(end_state){

	var init_state  = getCurrentState();
	for (let k = 0; k < init_state.length; k++) {
		let init_value = init_state[k].value;
		let index = init_state[k].name;
		let end_value = end_state.filter(conf => conf.name == index)[0];

		if (end_value.value != init_value){
			init_state[k].value = THREE.Math.lerp(init_value, end_value.value, 1/15);
		}
	}

	set_pose(init_state)
}

function fill_pose(pose){

	let full_pose = dcopy(hero._pose);
	full_pose = full_pose.filter(conf => conf.name != 'biker.position.x');
	full_pose = full_pose.filter(fconf => pose.every(pconf => pconf.name != fconf.name))
	full_pose.push(...pose)
	return full_pose
}

function set_pose(pose){
	for (var i = 0; i < pose.length; i++) {
		eval(`hero.${pose[i].name} = ${pose[i].value}`)
	}
}

const normal = 	[
	 {name: 'biker.position.y', value: 0.2},
	 {name: 'biker.rotation.z', value: 0}
 ]

const jump = [
	{name: 'biker.position.y', value: 4.20}
]

const shift_right = [
	{name: 'biker.position.y', value: 0.2},
	{name: 'biker.rotation.z', value: 1}
]

const shift_left = [
	{name: 'biker.position.y', value: 0.2},
	{name: 'biker.rotation.z', value: -1}
]

