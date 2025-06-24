const path = require('path');
const { copyBoilerplateFolder, walkSync } = require('../../utils/fileUtils');

class ReactNativeAssetsBoilerplate {
	static getDependencies() {
		return [];
	}

	async generateAssetsBoilerplate(projectPath, options = {}) {
		const templateDir = path.join(__dirname);

		await copyBoilerplateFolder(templateDir, path.join(projectPath, 'assets'), ['assets.js']);

		// List all files copied (for display)
		const fs = require('fs');
		const allFiles = walkSync(templateDir).filter(f => f !== 'assets.js');

		return {
			dependencies: ReactNativeAssetsBoilerplate.getDependencies(),
			instructions: [],
			files: allFiles,
		};
	}
}

module.exports = ReactNativeAssetsBoilerplate;
