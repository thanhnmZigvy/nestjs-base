/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require('fs/promises');
const path = require('path');

const run = async () => {
  try {
    // Get the full path of the current directory
    const currentDir = process.cwd();

    // Construct full paths for the JSON files
    const packageJsonPath = path.join(currentDir, 'package.json');
    const packageProductionJsonPath = path.join(
      currentDir,
      'package-production.json',
    );

    // Read the package.json and package-production.json files
    const packageJson = await fs.readFile(packageJsonPath, 'utf8');
    const packageProductionJson = JSON.parse(
      await fs.readFile(packageProductionJsonPath, 'utf8'),
    );

    // Update dependencies in packageProductionJson
    packageProductionJson.dependencies = Object.entries(
      JSON.parse(packageJson).dependencies,
    ).reduce((pre, [key, value]) => {
      pre[key] = value.replace('^', '');
      return pre;
    }, {});

    // Write the updated package-production.json back to the file
    await fs.writeFile(
      packageJsonPath,
      JSON.stringify(packageProductionJson, null, 2),
    );

    console.log('Updated package-production.json successfully.');
  } catch (error) {
    console.error('Error occurred:', error);
  }
};

run();
