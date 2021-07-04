var heroBaseY=0.1;
var hero
var poses = {};
var strikes = 0;

function getHero(path, tree, parent) {
	var hero = {};
	hero._pose = [];
	hero.hasCollided = false;
	const template = function() {
		return [
			{name: 'position.x', value: 0},
			{name: 'position.y', value: 0},
			{name: 'position.z', value: 0},
			{name: 'rotation.x', value: 0},
			{name: 'rotation.y', value: 0},
			{name: 'rotation.z', value: 0},
		];
	}

	async function load_part(path, tree, parent) {

		var full_path = path + tree.value + '.gltf'
		await loadModel(full_path).then(function(model) {
			model.name = tree.value
			hero[tree.value] = model
			var pose = template()
			if (tree.settings != undefined) {
				pose = pose.filter(pconf => tree.settings.every(tconf => tconf.name != pconf.name))
				pose.push(...tree.settings)
				for (var i = 0; i < tree.settings.length; i++) {
					if (tree.settings[i]) {
						eval(`model.${tree.settings[i].name} = ${tree.settings[i].value}`)
					}
				}
			}
			
			pose = pose.map((conf) => {
				conf.name = `${tree.value}.${conf.name}`
				return conf;
			})
			hero._pose.push(...pose);
			if (tree.children != undefined) {
				for (var i = 0; i < tree.children.length; i++) {
					if (tree.children[i]) {
						load_part(path, tree.children[i], model)
					}
				}
			}

			parent.add(model)
		})
	}

	load_part(path, tree, parent)
	return hero
}


var body = 	{
		value: 'biker',
		settings: [
		  {name: 'position.y', value: 0.1},
		  {name: 'position.z', value: 3},
		  {name: 'rotation.x', value: Math.PI/10},
		  {name: 'rotation.y', value: -Math.PI},
		  {name: 'scale.x', value: 0.4},
		  {name: 'scale.y', value: 0.4},
		  {name: 'scale.z', value: 0.4},
		],
		children: [
			{value: 'frontwheel',
			 settings:[
				{name: 'position.y', value: 0},
				{name: 'position.z', value: 0}
			 ]
            },
			{value: 'backwheel',
			 settings:[
				{name: 'position.y', value: 0},
				{name: 'position.z', value: -2}	
			]}
		]}
		


