const inquirer = require('inquirer');

const colors = require('./colors');
const { spawn } = require('child_process');
let currentChild = null;

process.on('SIGINT', () => {
  if (currentChild) {
    currentChild.kill('SIGINT');
  }
  process.exit();
});

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

async function installPackages(dependencies) {
  for (const dep of dependencies) {
    try {
      console.log(`Installing ${dep}...`);
      await new Promise((resolve, reject) => {
        currentChild = spawn('npm', ['install', dep], { stdio: 'inherit', shell: true });
        currentChild.on('close', (code) => {
          currentChild = null;
          if (code === 0) {
            console.log(`  ${colors.green}✓ ${dep} installed successfully. ${colors.reset}`);
            resolve();
          } else {
            console.error(`❌ Failed to install ${dep}`);
            resolve(); // Continue to next even if failed
          }
        });
        currentChild.on('error', (err) => {
          currentChild = null;
          console.error(`❌ Failed to install ${dep}`);
          resolve(); // Continue to next even if failed
        });
      });
    } catch (err) {
      console.error(`❌ Failed to install ${dep}`);
    }
  }
}
module.exports=askToInstall
