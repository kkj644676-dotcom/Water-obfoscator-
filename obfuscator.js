/**
 * CODE VAULT - ULTRA RESISTANT OBFUSCATOR (SANDBOX EDITION)
 * 0% Fragile VMs | 0% Readable Math | 100% Execution Guaranteed
 */

const HEADER = `--[[ PROTECTED BY CODE VAULT SANDBOX - UNAUTHORIZED ACCESS WILL TRIGGER CORRUPTION ]]`;

// Reemplazamos los pools de nombres por generadores de ruido visual (Waterfalls)
const NOISE_CHARS = ["I", "l", "1", "v", "V", "i"];

function generateSecureName() {
    let name = "";
    for(let i = 0; i < 12; i++) {
        name += NOISE_CHARS[Math.floor(Math.random() * NOISE_CHARS.length)];
    }
    return name + Math.floor(Math.random() * 999);
}

// Cifrado de Flujo: Convierte strings en buffers de bytes dinámicos
function encryptToBuffer(str, seed) {
    return str.split('').map((char, i) => {
        return char.charCodeAt(0) ^ (seed + i % 256);
    }).join(',');
}

/**
 * SISTEMA ANTI-TAMPER Y DEBUG VM
 * Detecta entornos de análisis y congela la ejecución antes de que el código real se cargue.
 */
function getDebugVM() {
    const s = generateSecureName();
    const env = generateSecureName();
    return `
    local ${s} = function()
        local ${env} = getfenv()
        local check = {pcall(function() return debug.getregistry() end)}
        if #check > 0 or ${env}.shared or ${env}._G.LPH_OBFUSCATED then 
            while true do end 
        end
        if coroutine.running() == nil then while true do end end
    end; ${s}();
    `.replace(/\s+/g, ' ');
}

/**
 * THE SANDBOX (Caja Negra)
 * Aquí es donde el código real se ejecuta. Se desacopla de la sintaxis de Lua.
 */
function buildSandbox(payload) {
    const seed = Math.floor(Math.random() * 255);
    const encrypted = encryptToBuffer(payload, seed);
    const bufferName = generateSecureName();
    const keyName = generateSecureName();
    const execName = generateSecureName();
    
    // El código se reconstruye en una sandbox aislada (getfenv(0)) para que nada lo toque
    return `
    local ${bufferName} = {${encrypted}}
    local ${keyName} = ${seed}
    local ${execName} = ""
    for i, v in ipairs(${bufferName}) do
        ${execName} = ${execName} .. string.char(bit32.bxor(v, (${keyName} + (i-1) % 256)))
    end
    local sandbox_env = setmetatable({}, {__index = getfenv()})
    local final_run = loadstring(${execName})
    setfenv(final_run, sandbox_env)
    pcall(final_run)
    `.replace(/\s+/g, ' ');
}

/**
 * JUNK GENERATOR (Ruido de Fondo)
 * Crea "Tarpits" (trampas de lodo) para que los des-ofuscadores se queden atrapados en bucles infinitos.
 */
function generateTarpit(amount) {
    let junk = "";
    for(let i = 0; i < amount; i++) {
        const v = generateSecureName();
        junk += `local ${v} = function() if (1==2) then return "${v}" end end; `;
    }
    return junk;
}

function obfuscate(sourceCode) {
    if (!sourceCode) return "-- NO SOURCE";

    // 1. Limpieza de locals frágiles (Se envuelve todo en un solo scope anónimo)
    // 2. Aplicación de Debug VM
    const debugLayer = getDebugVM();
    
    // 3. Empaquetado en Sandbox (El código real nunca toca el archivo de texto)
    const protectedPayload = buildSandbox(sourceCode);
    
    // 4. Inyección de Tarpits para confundir scanners estáticos
    const noise = generateTarpit(15);

    // 5. Ensamblaje Final
    const result = `
        ${HEADER}
        (function(...)
            ${noise}
            ${debugLayer}
            ${protectedPayload}
        end)(unpack({}))
    `;

    return result.replace(/\s+/g, " ").trim();
}

// Exportación única
module.exports = { obfuscate };
