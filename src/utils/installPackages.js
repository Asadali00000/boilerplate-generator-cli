const inquirer = require('inquirer');
const { exec } = require('child_process');
const colors = require('./colors');


async function askToInstall(dependencies){
	  const { shouldInstall }=await inquirer.prompt([
		{
			type:'confirm',
			name: 'shouldInstall',
			message: 'Do you want to install All required dependencies?',
			default: true,
		}
	  ])
	  if(shouldInstall){
		installPackages(dependencies)
	  }else{
		console.log(`  ${colors.green}✓ Skipped package installation. ${colors.reset}`);
	  }
}

function installPackages(dependencies){

	dependencies.forEach(dep => {
		console.log(dep)
		const installProcess=exec(`npm install ${dep}`);
		installProcess.stdout.pipe(process.stdout)
		installProcess.stderr.pipe(process.stderr)

		installProcess.on('exit', (code) => {
			if (code === 0) {
				console.log(`  ${colors.green}✓ ${dep} installed successfully. ${colors.reset}`);
			} else {
				console.error(`❌ Failed to install ${packageName} (exit code ${code})`)
			}
		})
	});
}
module.exports=askToInstall