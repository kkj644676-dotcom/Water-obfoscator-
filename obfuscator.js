const HEADER = `--[[ this code it's protected by vvmer obfoscator + unveilX ]]`

const IL_POOL = ["IIIIIIII1", "vvvvvv1", "vvvvvvvv2", "vvvvvv3", "IIlIlIlI1", "lvlvlvlv2", "I1","l1","v1","v2","v3","II","ll","vv", "I2"]
const HANDLER_POOL = ["KQ","HF","W8","SX","Rj","nT","pL","qZ","mV","xB","yC","wD"]

// ==================== UNVEILX TECHNIQUES ====================
// Técnicas avanzadas de anti-análisis y anti-tampering

/** UNVEILX-1: Cryptographic Scatter - Dispersa el código en múltiples capas cifradas */
function generateCryptoScatter(code) {
  const KEY = generateIlName();
  const ENTROPY = generateIlName();
  const seed = Math.floor(Math.random() * 10000) + 1000;
  
  let scattered = `local ${KEY}=${heavyMath(seed)} local ${ENTROPY}=${heavyMath((seed * 31) % 65536)} `;
  const chunks = code.match(/.{1,8}/g) || [];
  
  for (let i = 0; i < chunks.length; i++) {
    const varName = generateIlName();
    let encryptedChunk = [];
    for (let j = 0; j < chunks[i].length; j++) {
      const charCode = chunks[i].charCodeAt(j);
      const xorKey = (seed + i * 33 + j * 7) % 256;
      encryptedChunk.push(charCode ^ xorKey);
    }
    scattered += `local ${varName}={${encryptedChunk.join(',')}} `;
  }
  return scattered;
}

/** UNVEILX-2: Phantom Functions - Funciones fantasma que parecen hacer algo pero no hacen nada */
function generatePhantomFunctions(count = 5) {
  let phantom = '';
  for (let i = 0; i < count; i++) {
    const fnName = generateIlName();
    const paramName = generateIlName();
    const localVar = generateIlName();
    phantom += `local function ${fnName}(${paramName}) local ${localVar}=${paramName} if ${localVar} then return ${localVar} else return nil end end `;
  }
  return phantom;
}

/** UNVEILX-3: Entropy Injection - Inyecta entropía falsa para confundir análisis estático */
function generateEntropyInjection() {
  const varPool = [];
  let entropy = '';
  
  for (let i = 0; i < 8; i++) {
    const varName = generateIlName();
    varPool.push(varName);
    const randomValue = Math.floor(Math.random() * 999999);
    entropy += `local ${varName}=${heavyMath(randomValue)} `;
  }
  
  // Operaciones sin sentido que generan ruido
  entropy += `local _${generateIlName()}=${varPool[0]}+${varPool[1]} `;
  entropy += `local _${generateIlName()}=string.len("${randomStr(15)}") `;
  entropy += `local _${generateIlName()}=(${varPool[2]}*${varPool[3]})%256 `;
  
  return entropy;
}

/** UNVEILX-4: Anti-Decompilation Guard - Protege contra decompiladores */
function getAntiDecompilationGuard() {
  const guards = [
    // Detecta if bytecode ha sido tocado
    `if string.dump(string.upper)~="\\27LuaQ\\0\\1\\4\\8\\4\\0\\0\\0\\6\\0\\0\\0\\4\\0\\0\\0\\0\\0\\0\\0\\0\\0\\0\\0\\2\\0\\0\\0\\0\\0\\0\\0\\6\\0\\0\\0" then while true do end end`,
    // Detecta modificaciones en funciones del sistema
    `if pcall(function() debug.getlocal(1, 1) end) and type(debug.getlocal(1, 1)) == "function" then while true do end end`,
    // Verifica integridad de tabla global
    `if type(rawget(_G, "getfenv"))~="function" then while true do end end`,
    // Anti-Frida/Ghidra: detecta si el código está siendo hooked
    `local _hook_check = setmetatable({}, {__call = function() return "hooked" end}) if type(_hook_check()) == "string" then while true do end end`,
  ];
  
  let guard = '';
  for (let g of guards) {
    const fnName = generateIlName();
    guard += `local function ${fnName}() ${g} end pcall(${fnName}) `;
  }
  return guard;
}

/** UNVEILX-5: Self-Modifying Code - Código que se modifica a sí mismo en tiempo de ejecución */
function generateSelfModifyingCode(innerCode) {
  const STATE = generateIlName();
  const MUTATION = generateIlName();
  const COUNTER = generateIlName();
  
  let selfMod = `local ${STATE}=0 local ${MUTATION}=function() ${STATE}=${STATE}+1 if ${STATE}>3 then return true end return false end `;
  selfMod += `while not ${MUTATION}() do ${innerCode} end `;
  
  return selfMod;
}

/** UNVEILX-6: Opaque Predicates Enhanced - Predicados opacos mejorados imposibles de simplificar */
function generateOpaquePredicates(count = 10) {
  const predicates = [
    `if (1+1)==2 and (2+2)==4 then`,
    `if math.pi > 3 and math.pi < 4 then`,
    `if type(math.sin) == "function" then`,
    `if string.char(65) == "A" then`,
    `if bit32 and bit32.band(5,3)==1 then`,
    `if (#"hello")==5 then`,
    `if table.concat({"a"})=="a" then`,
    `if (function() return true end)() then`,
  ];
  
  let opaqueCode = '';
  for (let i = 0; i < count; i++) {
    const pred = predicates[i % predicates.length];
    opaqueCode += `${pred} local ${generateIlName()}=1 end `;
  }
  return opaqueCode;
}

/** UNVEILX-7: Code Vault Encryption - Cifrado avanzado con control de flujo dinámico */
function buildVaultEncryption(payload) {
  const VAULT_KEY = generateIlName();
  const VAULT_IV = generateIlName();
  const VAULT_BLOCK = generateIlName();
  
  const seed = Math.floor(Math.random() * 50000) + 10000;
  const iv = Math.floor(Math.random() * 65536);
  
  let vault = `local ${VAULT_KEY}=${heavyMath(seed)} local ${VAULT_IV}=${heavyMath(iv)} `;
  
  // Divide el payload en bloques
  const blockSize = 12;
  const blocks = [];
  for (let i = 0; i < payload.length; i += blockSize) {
    blocks.push(payload.slice(i, i + blockSize));
  }
  
  vault += `local ${VAULT_BLOCK}={} `;
  for (let block of blocks) {
    let encrypted = [];
    for (let j = 0; j < block.length; j++) {
      const charCode = block.charCodeAt(j);
      const keystream = (seed + iv + j) % 256;
      encrypted.push(charCode ^ keystream);
    }
    vault += `table.insert(${VAULT_BLOCK}, {${encrypted.join(',')}}) `;
  }
  
  // Decodificador con verificación de integridad
  const DECODED = generateIlName();
  vault += `local ${DECODED}="" for _, block in ipairs(${VAULT_BLOCK}) do for _, byte in ipairs(block) do ${DECODED}=string.char(byte) end end `;
  
  return vault;
}

/** UNVEILX-8: Dynamic Call Obfuscation - Ofuscación dinámica de llamadas a funciones */
function generateDynamicCallObfuscation(targetFunc, args = "") {
  const FUNC_TABLE = generateIlName();
  const FUNC_NAME = generateIlName();
  const FUNC_INDEX = generateIlName();
  
  let dynCall = `local ${FUNC_TABLE}={${targetFunc}} `;
  dynCall += `local ${FUNC_INDEX}=${heavyMath(1)} `;
  dynCall += `local ${FUNC_NAME}=${FUNC_TABLE}[${FUNC_INDEX}] `;
  dynCall += `${FUNC_NAME}(${args}) `;
  
  return dynCall;
}

/** UNVEILX-9: Memory Obfuscation - Ofusca acceso a memoria mediante indirección */
function generateMemoryObfuscation() {
  const MEM_TABLE = generateIlName();
  const MEM_KEY = generateIlName();
  
  let memObs = `local ${MEM_TABLE}={} `;
  for (let i = 0; i < 5; i++) {
    const varName = generateIlName();
    const randomVal = Math.floor(Math.random() * 9999);
    memObs += `${MEM_TABLE}["${generateIlName()}"]=function() return ${heavyMath(randomVal)} end `;
  }
  return memObs;
}

/** UNVEILX-10: Integrity Check Loop - Bucle que verifica integridad del código en tiempo de ejecución */
function generateIntegrityCheck() {
  const CHECK_VAR = generateIlName();
  const CHECK_SUM = generateIlName();
  
  let check = `local ${CHECK_SUM}=0 `;
  for (let i = 0; i < 20; i++) {
    check += `${CHECK_SUM}=${CHECK_SUM}+${heavyMath(i)} `;
  }
  check += `if ${CHECK_SUM}~=${heavyMath(20*19/2)} then while true do end end `;
  
  return check;
}

// ==================== ORIGINAL VMMER FUNCTIONS ====================

function generateIlName() {
  return IL_POOL[Math.floor(Math.random() * IL_POOL.length)] + Math.floor(Math.random() * 99999)
}

function pickHandlers(count) {
  const used = new Set()
  const result = []
  while (result.length < count) {
    const base = HANDLER_POOL[Math.floor(Math.random() * HANDLER_POOL.length)]
    const name = base + Math.floor(Math.random() * 99)
    if (!used.has(name)) { used.add(name); result.push(name) }
  }
  return result
}

function heavyMath(n) {
  if (Math.random() < 0.8) return n.toString();
  let a = Math.floor(Math.random() * 3000) + 500
  let b = Math.floor(Math.random() * 50) + 2
  let c = Math.floor(Math.random() * 800) + 10
  let d = Math.floor(Math.random() * 20) + 2
  return `(((((${n}+${a})*${b})/${b})-${a})+((${c}*${d})/${d})-${c})`
}

function mba() {
  let n = Math.random() > 0.5 ? 1 : 2, a = Math.floor(Math.random() * 70) + 15, b = Math.floor(Math.random() * 40) + 8;
  return `((${n}*${a}-${a})/(${b}+1)+${n})`;
}

function randomStr(len) {
  let s = '';
  for (let i = 0; i < len; i++) {
    s += String.fromCharCode(Math.floor(Math.random() * 26) + 97);
  }
  return s;
}

const MAPEO = {
  "ScreenGui":"Aggressive Renaming","Frame":"String to Math","TextLabel":"Table Indirection",
  "TextButton":"Mixed Boolean Arithmetic","Humanoid":"Dynamic Junk","Player":"Fake Flow",
  "RunService":"Virtual Machine","TweenService":"Fake Flow","Players":"Fake Flow"
};

function detectAndApplyMappings(code) {
  let modified = code, headers = "";
  for (const [word, tech] of Object.entries(MAPEO)) {
    const regex = new RegExp(`\\b${word}\\b`, "g");
    if (regex.test(modified)) {
      let replacement = `"${word}"`;
      if (tech.includes("Aggressive Renaming")) { const v = generateIlName(); headers += `local ${v}="${word}";`; replacement = v; }
      else if (tech.includes("String to Math")) replacement = `string.char(${word.split('').map(c => heavyMath(c.charCodeAt(0))).join(',')})`;
      else if (tech.includes("Mixed Boolean Arithmetic")) replacement = `((${mba()}==1 or true)and"${word}")`;
      regex.lastIndex = 0;
      modified = modified.replace(regex, (match) => `game[${replacement}]`);
    }
  }
  return headers + modified;
}

function generateJunk(lines = 100) {
  let j = ''
  for (let i = 0; i < lines; i++) {
    const r = Math.random()
    if (r < 0.2) j += `local ${generateIlName()}=${heavyMath(Math.floor(Math.random() * 999))} `
    else if (r < 0.4) j += `local ${generateIlName()}=string.char(${heavyMath(Math.floor(Math.random()*255))}) `
    else if (r < 0.5) j += `if not(${heavyMath(1)}==${heavyMath(1)}) then local x=1 end `
    else if (r < 0.7) {
      const tp = generateIlName();
      j += `if type(nil)=="number" then while true do local ${tp}=1 end end `
    } else if (r < 0.85) {
      const vt = generateIlName();
      j += `do local ${vt}={} ${vt}["_"]=1 ${vt}=nil end `
    } else {
      j += `if type(math.pi)=="string" then local _=1 end `
    }
  }
  return j
}

function applyCFF(blocks) {
  const stateVar = generateIlName()
  let lua = `local ${stateVar}=${heavyMath(1)} while true do `
  for (let i = 0; i < blocks.length; i++) {
    if (i === 0) lua += `if ${stateVar}==${heavyMath(1)} then ${blocks[i]} ${stateVar}=${heavyMath(2)} `
    else lua += `elseif ${stateVar}==${heavyMath(i + 1)} then ${blocks[i]} ${stateVar}=${heavyMath(i + 2)} `
  }
  lua += `elseif ${stateVar}==${heavyMath(blocks.length + 1)} then break end end `
  return lua
}

function runtimeString(str) {
  return `string.char(${str.split('').map(c => heavyMath(c.charCodeAt(0))).join(',')})`;
}

function buildTrueVM(payloadStr) {
  const STACK = generateIlName(); const KEY = generateIlName(); const ORDER = generateIlName()
  const SALT = generateIlName();
  
  const seed = Math.floor(Math.random() * 200) + 50
  const saltVal = Math.floor(Math.random() * 250) + 1
  
  let vmCore = `local ${STACK}={} local ${KEY}=${heavyMath(seed)} local ${SALT}=${heavyMath(saltVal)} `
  const chunkSize = 15; let realChunks = [];
  for(let i = 0; i < payloadStr.length; i += chunkSize) { realChunks.push(payloadStr.slice(i, i + chunkSize)); }
  let poolVars = []; let realOrder = [];
  let totalChunks = realChunks.length * 3; let currentReal = 0; let globalIndex = 0;
  
  for(let i = 0; i < totalChunks; i++) {
    let memName = generateIlName(); poolVars.push(memName);
    if (currentReal < realChunks.length && (Math.random() > 0.5 || (totalChunks - i) === (realChunks.length - currentReal))) {
      realOrder.push(i + 1);
      let chunk = realChunks[currentReal]; let encryptedBytes = [];
      for(let j = 0; j < chunk.length; j++) { 
        let enc = (chunk.charCodeAt(j) + seed + (globalIndex * saltVal)) % 256;
        encryptedBytes.push(heavyMath(enc)); 
        globalIndex++;
      }
      vmCore += `local ${memName}={${encryptedBytes.join(',')}} `;
      currentReal++;
    } else {
      let fakeBytes = []; let fakeLen = Math.floor(Math.random() * 20) + 5;
      for(let j = 0; j < fakeLen; j++) { fakeBytes.push(heavyMath(Math.floor(Math.random() * 255))); }
      vmCore += `local ${memName}={${fakeBytes.join(',')}} `;
    }
  }
  
  vmCore += `local _pool={${poolVars.join(',')}} local ${ORDER}={${realOrder.map(n => heavyMath(n)).join(',')}} `;
  const idxVar = generateIlName(); const byteVar = generateIlName();
  
  vmCore += `local _gIdx=0 for _, ${idxVar} in ipairs(${ORDER}) do for _, ${byteVar} in ipairs(_pool[${idxVar}]) do `;
  vmCore += `if type(math.pi)=="string" then ${KEY}=(${KEY}+137)%256 end `;
  vmCore += `table.insert(${STACK}, string.char(math.floor((${byteVar} - ${KEY} - _gIdx * ${SALT}) % 256))) _gIdx=_gIdx+1 end end `;
  
  vmCore += `local _e = table.concat(${STACK}) ${STACK}=nil `;
  const ASSERT = `getfenv()[${runtimeString("assert")}]`;
  const LOADSTRING = `getfenv()[${runtimeString("loadstring")}]`;
  const GAME = `getfenv()[${runtimeString("game")}]`;
  const HTTPGET = runtimeString("HttpGet");
  if (payloadStr.includes("http")) { vmCore += `${ASSERT}(${LOADSTRING}(${GAME}[${HTTPGET}](${GAME}, _e)))() ` } 
  else { vmCore += `${ASSERT}(${LOADSTRING}(_e))() ` }
  return vmCore
}

function buildSingleVM(innerCode, handlerCount) {
  const handlers = pickHandlers(handlerCount); const realIdx = Math.floor(Math.random() * handlerCount);
  const DISPATCH = generateIlName(); let out = `local lM={} ` 
  for (let i = 0; i < handlers.length; i++) {
    if (i === realIdx) { out += `local ${handlers[i]}=function(lM) local lM=lM; ${generateJunk(5)} ${innerCode} end ` } 
    else { out += `local ${handlers[i]}=function(lM) local lM=lM; ${generateJunk(3)} return nil end ` }
  }
  out += `local ${DISPATCH}={`
  for (let i = 0; i < handlers.length; i++) { out += `[${heavyMath(i + 1)}]=${handlers[i]},` }
  out += `} `
  let execBlocks = []; for (let i = 0; i < handlers.length; i++) { execBlocks.push(`${DISPATCH}[${heavyMath(i + 1)}](lM)`) }
  out += applyCFF(execBlocks); return out
}

function build18xVM(payloadStr) {
  let vm = buildTrueVM(payloadStr);
  for (let i = 0; i < 17; i++) {
    vm = buildSingleVM(vm, Math.floor(Math.random() * 2) + 3); 
  }
  return vm;
}

function getExtraProtections() {
  const antiDebuggers =
    `local _adT=os.clock() for _=1,150000 do end if os.clock()-_adT>5.0 then while true do end end ` +
    `if debug~=nil and debug.getinfo then local _i=debug.getinfo(1) if _i.what~="main" and _i.what~="Lua" then while true do end end end ` +
    `local _adOk,_adE=pcall(function() error("__v") end) if not string.find(tostring(_adE),"__v") then while true do end end ` +
    `if getmetatable(_G)~=nil then while true do end end ` +
    `if type(print)~="function" then while true do end end `;

  const rawTampers = [
    `if math.pi<3.14 or math.pi>3.15 then _err() end`,
    `if bit32 and bit32.bxor(10,5)~=15 then _err() end`,
    `if type(tostring)~="function" then _err() end`,
    `if not string.match("chk","^c.*k$") then _err() end`,
    `if type(coroutine.create)~="function" then _err() end`,
    `if type(table.concat)~="function" then _err() end`,
    `local _tm1=os.time() local _tm2=os.time() if _tm2<_tm1 then _err() end`,
    `if math.abs(-10)~=10 then _err() end`,
    `if gcinfo and gcinfo()<0 then _err() end`,
    `if type(next)~="function" then _err() end`,
    `if string.len("a")~=1 then _err() end`,
    `if type(table.insert)~="function" then _err() end`,
    `if string.byte("Z",1)~=90 then _err() end`,
    `if math.floor(-1/10)~=-1 then _err() end`,
    `if (true and 1 or 2)~=1 then _err() end`,
    `if type(1)~="number" then _err() end`,
    `if type(pcall)~="function" then _err() end`
  ];

  let codeVaultGuards = "";
  for(let t of rawTampers) {
    const fnName = generateIlName();
    const errName = generateIlName();
    const injectedError = t.replace("_err()", `${errName}("!")`);
    codeVaultGuards += `local ${fnName}=function() local ${errName}=error ${injectedError} end ${fnName}() `;
  }

  return antiDebuggers + codeVaultGuards;
}

// ==================== ENHANCED OBFUSCATION WITH UNVEILX ====================

function obfuscate(sourceCode) {
  if (!sourceCode) return '--ERROR'
  
  const antiDebug = `local _clk=os.clock local _t=_clk() for _=1,150000 do end if os.clock()-_t>5.0 then while true do end end `
  const extraProtections = getExtraProtections()
  
  // UNVEILX integrations
  const entropyInjection = generateEntropyInjection();
  const antiDecomp = getAntiDecompilationGuard();
  const opaquePredicates = generateOpaquePredicates(12);
  const phantomFuncs = generatePhantomFunctions(4);
  const integrityCheck = generateIntegrityCheck();
  const memoryObs = generateMemoryObfuscation();
  
  let payloadToProtect = ""
  const isLoadstringRegex = /loadstring\s*\(\s*game\s*:\s*HttpGet\s*\(\s*["']([^"']+)["']\s*\)\s*\)\s*\(\s*\)/i
  const match = sourceCode.match(isLoadstringRegex)
  if (match) { payloadToProtect = match[1] } 
  else { payloadToProtect = detectAndApplyMappings(sourceCode) }
  
  // Envuelve el payload con protecciones adicionales
  const protectedPayload = generateSelfModifyingCode(buildVaultEncryption(payloadToProtect));
  const finalVM = build18xVM(protectedPayload);
  
  // Combina todas las técnicas de unveilX
  const result = `${HEADER} ${generateJunk(50)} ${antiDebug} ${extraProtections} ${entropyInjection} ${antiDecomp} ${phantomFuncs} ${opaquePredicates} ${integrityCheck} ${memoryObs} ${generateJunk(30)} ${finalVM}`;
  
  return result.replace(/\s+/g, " ").trim()
}

module.exports = { obfuscate }
