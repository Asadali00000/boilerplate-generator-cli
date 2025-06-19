const inquirer = require('inquirer');
const { execSync } = require('child_process');
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
		// console.log(dep)
		// const installProcess=execSync(`npm install ${dep}`);
		// installProcess.stdout.pipe(process.stdout)
		// installProcess.stderr.pipe(process.stderr)

		try {
            console.log(dep);
            execSync(`npm install ${dep}`, { stdio: 'inherit' });
            console.log(`  ${colors.green}✓ ${dep} installed successfully. ${colors.reset}`);
        } catch (err) {
            console.error(`❌ Failed to install ${dep}`);
        }
	});
}
module.exports=askToInstall