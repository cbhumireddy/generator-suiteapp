const { build } = require('./gulpfile');


module.exports = {
	defaultProjectFolder: 'src',
	commands: {
		'project:deploy': {
			projectFolder: 'dist',
			beforeExecuting: async options => {
				await build();
				return options;
			},
		},
		'project:validate': {
			projectFolder: 'dist',
			beforeExecuting: async options => {
				await build();
				options.arguments.server = true;
				return options;
			},
		},
	},
};
