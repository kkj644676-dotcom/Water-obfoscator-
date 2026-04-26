const HEADER = `-- [[ Protected by Veil Obfuscator ]]`;

// Sistema de nombres estilo Veil (Mezcla de cortos y largos dinámicos)
function generateVeilName() {
    const chars = "abcdefghijklmnopqrstuvwxyz";
    const v = ["I", "A", "_", "r", "G", "z", "o", "b", "D", "u", "F", "O", "N", "B", "d", "J", "q", "C", "Z", "W", "y", "n", "l"];
    if (Math.random() > 0.6) {
        let res = "";
        for(let i=0; i<8; i++) res += chars.charAt(Math.floor(Math.random() * chars.length));
        return res + Math.floor(Math.random() * 999);
    }
    return v[Math.floor(Math.random() * v.length)] + v[Math.floor(Math.random() * v.length)];
}

function heavyMath(n) {
    return "0x" + n.toString(16).toUpperCase();
}

// PROTECCIONES VMmer: Anti-EVM, Anti-Debug, Anti-Tamper
function getProtections() {
    return `
    local _c = os.clock()
    for _=1, 500000 do end
    if os.clock() - _c > 1.5 then while true do end end
    local _g = getfenv()
    if _g.print ~= print or _g.loadstring ~= loadstring and _g.load ~= load then while true do end end
    `;
}

// MOTOR DE VM: Rolling XOR Affine Cipher integrado en Veil
function buildVeilVM(payloadStr) {
    const seed = Math.floor(Math.random() * 250) + 1;
    const salt = Math.floor(Math.random() * 15) + 1;
    const STACK = generateVeilName();
    
    // Cifrado compatible con Railway/Vanilla Lua
    let encryptedBytes = [];
    for (let i = 0; i < payloadStr.length; i++) {
        let b = (payloadStr.charCodeAt(i) + seed + (i * salt)) % 256;
        encryptedBytes.push(heavyMath(b));
    }

    // Estructura de funciones locales masivas (Firma de Veil)
    let vm = `return(function() 
    local I,A,_,r,G,z,o,b,D,u,F,O,N,B,d,J,q,C,Z,W,y,n,l = string.byte,string.sub,string.char,string.gsub,string.rep,setmetatable,pcall,type,tostring,assert,unpack,string.pack,nil,nil,nil,nil,nil,math.floor,string.len,table.concat,rawget,rawequal,getfenv;
    local _B = {${encryptedBytes.join(',')}};
    ${getProtections()}
    local ${STACK} = {};
    for i=1, #_B do
        local _val = (_B[i] - ${heavyMath(seed)} - ((i-1) * ${heavyMath(salt)})) % 256;
        ${STACK}[i] = _(_val);
    end
    local _src = W(${STACK});
    local _exec = u(loadstring(_src) or load(_src));
    return _exec();
    end)()`;
    
    return vm;
}

// 18 CAPAS DE VM (Encapsulamiento VMmer)
function apply18Layers(payload) {
    let current = buildVeilVM(payload);
    for(let i=0; i<17; i++) {
        const vName = generateVeilName();
        // Cada capa es una clausura anónima estilo Veil
        current = `return(function() local ${vName} = function() ${current} end return ${vName}() end)()`;
    }
    return current;
}

function obfuscate(sourceCode) {
    if (!sourceCode) return "-- [Error: No source]";

    // Detectar si el código es un HttpGet para tratarlo como Payload directo
    const isLoadstringRegex = /loadstring\s*\(\s*game\s*:\s*HttpGet\s*\(\s*["']([^"']+)["']\s*\)\s*\)\s*\(\s*\)/i;
    const match = sourceCode.match(isLoadstringRegex);
    let codeToEncrypt = sourceCode;
    
    if (match) {
        codeToEncrypt = `loadstring(game:HttpGet("${match[1]}"))()`;
    }

    // Generar las 18 capas con el motor Veil
    const finalCode = apply18Layers(codeToEncrypt);

    // Salida final: Header + Junk + VM masiva en una línea
    let junk = "";
    for(let i=0; i<10; i++) junk += `local ${generateVeilName()}=${heavyMath(i)} `;
    
    return `${HEADER} ${junk} ${finalCode.replace(/\s+/g, " ").trim()}`;
}

module.exports = { obfuscate };
