const { execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Cambia esta ruta si Prometheus está en otra carpeta
const PROMETHEUS_DIR = path.join(__dirname, 'Prometheus');
const CLI_PATH = path.join(PROMETHEUS_DIR, 'cli.lua');

function obfuscate(source) {
  if (typeof source !== 'string') {
    throw new Error('Input must be a string');
  }

  const tempInput = path.join(__dirname, 'temp_' + Date.now() + '.lua');
  const tempOutput = path.join(__dirname, 'temp_' + Date.now() + '.obf.lua');

  fs.writeFileSync(tempInput, source, 'utf8');

  try {
    // Ejecuta Prometheus con preset Strong
    execFileSync('lua', [
      CLI_PATH,
      '--preset', 'Strong',
      tempInput
    ], { stdio: 'pipe' });

    // Prometheus crea automáticamente el archivo con .obfuscated.lua
    const outputFile = tempInput.replace('.lua', '.obfuscated.lua');
    const obfuscated = fs.readFileSync(outputFile, 'utf8');

    // Limpieza
    fs.unlinkSync(tempInput);
    fs.unlinkSync(outputFile);

    return obfuscated;

  } catch (err) {
    // Limpieza en caso de error
    try { if (fs.existsSync(tempInput)) fs.unlinkSync(tempInput); } catch (_) {}
    try { 
      const outputFile = tempInput.replace('.lua', '.obfuscated.lua');
      if (fs.existsSync(outputFile)) fs.unlinkSync(outputFile);
    } catch (_) {}
    
    throw new Error('Error ejecutando Prometheus: ' + err.message);
  }
}

module.exports = {
  obfuscate: obfuscate
};
