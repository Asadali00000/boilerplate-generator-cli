const { createFileStructure } = require('../utils/fileUtils');

class ReactNativeAssetsBoilerplate {
	generateAssetsBoilerplate(projectPath, options = {}) {
		const structure = {
			'assets/fonts/.gitkeep': '',
			'assets/images/.gitkeep': '',
			'assets/icons/.gitkeep': '',
		};

		createFileStructure(projectPath, structure);

		return {
			dependencies: [
			],
			instructions: [
			],
			files: Object.keys(structure),
		};
	}
}

module.exports = ReactNativeAssetsBoilerplate;