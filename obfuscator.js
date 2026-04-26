const HEADER = `--[[ this code it's protected by vvmer obfoscator ]]`

// Cambiado de IL_POOL a registros de una Debug Machine
const DEBUG_REGS = ["RAX", "RBX", "RCX", "RDX", "RSP", "RBP", "RSI", "RDI", "R8", "R9", "R10", "EAX", "EBX", "ST0", "XMM0", "PTR_"]
const HANDLER_POOL = ["DB_OP", "SYS_CALL", "INT_80", "MEM_LOC", "IO_PORT"]

function generateDebugName() {
  const reg = DEBUG_REGS[Math.floor(Math.random() * DEBUG_REGS.length)]
  const hex = Math.floor(Math.random() * 0xFFFFFF).toString(16).toUpperCase()
  return reg + "_" + hex
}

function pickHandlers(count) {
  const used = new Set()
  const result = []
  while (result.length < count) {
    const base = HANDLER_POOL[Math.floor(Math.random() * HANDLER_POOL.length)]
    const name = base + "_" + Math.floor(Math.random() * 999)
    if (!used.has(name)) { used.add(name); result.push(name) }
  }
  return result
}

// 0% MATH CODE: Ahora devuelve el valor directo sin operaciones complejas
function cleanValue(n) {
  return typeof n === 'number' ? n : `"${n}"`;
}

const MAPEO = {
  "ScreenGui":"Renaming","Frame":"Stringing","TextLabel":"Indirection",
  "Humanoid":"Junk","Player":"Flow","RunService":"VM"
};

function detectAndApplyMappings(code) {
  let modified = code, headers = "";
  for (const [word, tech] of Object.entries(MAPEO)) {
    const regex = new RegExp(`\\b${word}\\b`, "g");
    if (regex.test(modified)) {
      const v = generateDebugName();
      headers += `local ${v}="${word}";`;
      modified = modified.replace(regex, () => `game[${v}]`);
    }
  }
  return headers + modified;
}

function generateJunk(lines = 50) {
  let j = ''
  for (let i = 0; i < lines; i++) {
    const r = Math.random()
    const name = generateDebugName();
    if (r < 0.3) j += `local ${name} = bit32.bxor(${Math.floor(Math.random()*100)}, ${Math.floor(Math.random()*100)}) `
    else if (r < 0.6) j += `if not (bit32.band(1,1) == 1) then return end `
    else j += `local ${name} = nil `
  }
  return j
}

function applyCFF(blocks) {
  const stateVar = generateDebugName()
  let lua = `local ${stateVar} = 1 while true do `
  for (let i = 0; i < blocks.length; i++) {
    lua += `if ${stateVar} == ${i + 1} then ${blocks[i]} ${stateVar} = ${i + 2} `
  }
  lua += `elseif ${stateVar} == ${blocks.length + 1} then break end end `
  return lua
}

function buildTrueVM(payloadStr) {
  const STACK = generateDebugName(); 
  const KEY = Math.floor(Math.random() * 255);
  
  // Implementación usando bit32 para el decode
  let vmCore = `local ${STACK} = {} local _key = ${KEY} `
  let bytes = [];
  for(let i = 0; i < payloadStr.length; i++) {
    // Simple XOR con bit32
    bytes.push(payloadStr.charCodeAt(i) ^ KEY);
  }
  
  vmCore += `local _data = {${bytes.join(',')}} `
  vmCore += `for i=1, #_data do table.insert(${STACK}, string.char(bit32.bxor(_data[i], _key))) end `
  vmCore += `local _e = table.concat(${STACK}) `
  vmCore += `getfenv()["loadstring"](_e)() `
  
  return vmCore
}

function buildSingleVM(innerCode) {
  const handlers = pickHandlers(3);
  const DISPATCH = generateDebugName();
  let out = `local ${handlers[0]} = function() ${innerCode} end `
  out += `local ${handlers[1]} = function() ${generateJunk(5)} end `
  out += `local ${handlers[2]} = function() return end `
  
  out += `local ${DISPATCH} = {${handlers[0]}, ${handlers[1]}, ${handlers[2]}} `
  out += `${DISPATCH}[1]() `
  return out
}

function getExtraProtections() {
  // Uso de bit32 para anti-debug y validación de entorno
  return `
    local function _check()
      if not bit32 or bit32.bxor(1,1) ~= 0 then while true do end end
      if debug and debug.getinfo(1).what ~= "Lua" then while true do end end
    end
    _check()
  `;
}

function obfuscate(sourceCode) {
  if (!sourceCode) return '--ERROR'
  
  const protections = getExtraProtections()
  let payload = detectAndApplyMappings(sourceCode)
  
  // Construcción de la Debug Machine VM
  let finalVM = buildTrueVM(payload)
  finalVM = buildSingleVM(finalVM) 
  
  const result = `${HEADER} ${generateJunk(20)} ${protections} ${finalVM}`
  return result.replace(/\s+/g, " ").trim()
}

module.exports = { obfuscate }
