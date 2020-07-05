const { src, dest, series } = require('gulp');
var ts = require('gulp-typescript');
const del = require('del');
//var jest = require('jest');

// function test() {
// 	return jest.runCLI(
// 		{
// 			transform: {
// 				'^.+\\.jsx?$': 'babel-jest',
// 				'^.+\\.tsx?$': 'ts-jest',
// 			},
// 			testRegex: '(/__tests__/tests/.*|(\\.|/)(test|spec))\\.tsx?$',
// 			moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
// 			preset: 'ts-jest',
// 		},
// 		[process.cwd()]
// 	);
// }

function clean() {
	console.log('Running clean');
	return del(['dist/**', '!dist']);
}

function copy() {
	console.log('Running copy');
	return new Promise((resolve, reject) => {
		var paths = ['src/**/*.xml'];
		src(paths)
			.pipe(dest('dist/'))
			.on('end', resolve)
			.on('error', reject);
	});
}

function buildTypeScript() {
	console.log('Transpiling TypeScript to JS');
	return new Promise((resolve, reject) => {
		var tsProject = ts.createProject('tsconfig.json');
		var tsResult = tsProject.src().pipe(tsProject());
		tsResult.js
			.pipe(dest('dist'))
			.on('end', () => {
				console.log('Transpiling done!');
				resolve();
			})
			.on('error', reject);
	});
}

function build() {
	console.log('Building project...');
	return new Promise((resolve, reject) => {
		try {
			series(clean, copy, buildTypeScript)(_ => {
				console.log('Building complete');
				resolve();
			});
		} catch (error) {
			console.log(error);
			reject(error);
		}
	});
}

module.exports = {
	build,
    //test,
    clean
};
