const path = require('path');
const fs = require('fs');

function deleteCache() {
  const commandsDir = path.join(__dirname, 'commands');
  const commandFiles = fs.readdirSync(commandsDir).filter(file => file.endsWith('.js'));

  commandFiles.forEach(file => {
    const commandPath = path.join(commandsDir, file);
    delete require.cache[require.resolve(commandPath)];
    console.log(`🗑️  Deleted cache for module: ${commandPath}`);
  });
}

deleteCache();
