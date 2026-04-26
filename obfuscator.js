/**
 * VVMER + UNVEILX OBFUSCATOR ENGINE
 * Final Version for Railway / Node.js
 */

const HEADER = `--[[ this code it's protected by unveilX ]]`;

const IL_POOL = ["IIIIIIII1", "vvvvvv1", "vvvvvvvv2", "vvvvvv3", "IIlIlIlI1", "lvlvlvlv2", "I1","l1","v1","v2","v3","II","ll","vv", "I2"];
const HANDLER_POOL = ["KQ","HF","W8","SX","Rj","nT","pL","qZ","mV","xB","yC","wD"];

// ==================== UTILS ====================

function generateIlName() {
  return IL_POOL[Math.floor(Math.random() * IL_POOL.length)] + Math.floor(Math.random() * 99999);
}

function heavyMath(n) {
  if (Math.random() < 0.2) return n.toString();
  let a = Math.floor(Math.random() * 3000) + 500;
  let b = Math.floor(Math.random() * 50) + 2;
  let c = Math.floor(Math.random() * 800) + 10;
  let d = Math.floor(Math.random() * 20) + 2;
  return `(((((${n}+${a})*${b})/${b})-${a})+((${c}*${d})/${d})-${c})`;
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

function runtimeString(str) {
  return `string.char(${str.split('').map(c => heavyMath(c.charCodeAt(0))).join(',')})`;
}

// ==================== UNVEILX CORE ====================

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

function generateEntropyInjection() {
  const varPool = [];
  let entropy = '';
  for (let i = 0; i < 8; i++) {
    const varName = generateIlName();
    varPool.push(varName);
    entropy += `local ${varName}=${heavyMath(Math.floor(Math.random() * 999999))} `;
  }
  entropy += `local _${generateIlName()}=${varPool[0]}+${varPool[1]} `;
  entropy += `local _${generateIlName()}=string.len("${randomStr(15)}") `;
  return entropy;
}

function getAntiDecompilationGuard() {
  const guards = [
    `if string.dump(string.upper)~="\\27LuaQ\\0\\1\\4\\8\\4\\0\\0\\0\\6\\0\\0\\0\\4\\0\\0\\0\\0\\0\\0\\0\\0\\0\\0\\0\\2\\0\\0\\0\\0\\0\\0\\0\\6\\0\\0\\0" then while true do end end`,
    `if pcall(function() debug.getlocal(1, 1) end) and type(debug.getlocal(1, 1)) == "function" then while true do end end`,
    `if type(rawget(_G, "getfenv"))~="function" then while true do end end`
  ];
  let guard = '';
  for (let g of guards) {
    const fnName = generateIlName();
    guard += `local function ${fnName}() ${g} end pcall(${fnName}) `;
  }
  return guard;
}

function generateOpaquePredicates(count = 10) {
  const predicates = [`if (1+1)==2 then`, `if math.pi > 3 then`, `if #("abc")==3 then` ];
  let opaqueCode = '';
  for (let i = 0; i < count; i++) {
    opaqueCode += `${predicates[i % predicates.length]} local ${generateIlName()}=${heavyMath(i)} end `;
  }
  return opaqueCode;
}

function generateIntegrityCheck() {
  const CHECK_SUM = generateIlName();
  return `local ${CHECK_SUM}=0 for i=1,20 do ${CHECK_SUM}=${CHECK_SUM}+i end if ${CHECK_SUM}~=210 then while true do end end `;
}

// ==================== VIRTUAL MACHINE CORE ====================

function applyCFF(blocks) {
  const stateVar = generateIlName();
  let lua = `local ${stateVar}=${heavyMath(1)} while true do `;
  for (let i = 0; i < blocks.length; i++) {
    lua += `${i === 0 ? "if" : "elseif"} ${stateVar}==${heavyMath(i + 1)} then ${blocks[i]} ${stateVar}=${heavyMath(i + 2)} `;
  }
  lua += `elseif ${stateVar}==${heavyMath(blocks.length + 1)} then break end end `;
  return lua;
}

function buildTrueVM(payloadStr) {
  const STACK = generateIlName();
  const KEY = generateIlName();
  const SALT = generateIlName();
  const seed = Math.floor(Math.random() * 200) + 50;
  const saltVal = Math.floor(Math.random() * 250) + 1;
  
  let vmCore = `local ${STACK}={} local ${KEY}=${heavyMath(seed)} local ${SALT}=${heavyMath(saltVal)} `;
  
  // Encriptación simple de bytes para la VM
  let bytes = [];
  for(let i=0; i<payloadStr.length; i++) {
    bytes.push(heavyMath((payloadStr.charCodeAt(i) + seed + (i * saltVal)) % 256));
  }
  
  vmCore += `local _data={${bytes.join(',')}} `;
  vmCore += `for i, v in ipairs(_data) do table.insert(${STACK}, string.char((v - ${KEY} - (i-1) * ${SALT}) % 256)) end `;
  vmCore += `local _e = table.concat(${STACK}) local _exec = getfenv()[${runtimeString("loadstring")}] or load pcall(_exec(_e)) `;
  
  return vmCore;
}

function generateJunk(lines = 30) {
  let j = '';
  for (let i = 0; i < lines; i++) {
    j += `local ${generateIlName()}=${heavyMath(i)} `;
  }
  return j;
}

// ==================== MAIN INTERFACE ====================

/**
 * Función principal de ofuscación
 * @param {string} sourceCode Código Lua original
 */
function obfuscate(sourceCode) {
  if (!sourceCode) return '-- Error: No Source';
  
  const antiDebug = `local _clk=os.clock local _t=_clk() for _=1,100000 do end if os.clock()-_t>2.0 then while true do end end `;
  const entropy = generateEntropyInjection();
  const antiDecomp = getAntiDecompilationGuard();
  const phantoms = generatePhantomFunctions(3);
  const integrity = generateIntegrityCheck();
  const opaque = generateOpaquePredicates(5);
  
  // Empaquetado en la VM
  const vmPayload = buildTrueVM(sourceCode);
  
  // Construcción del archivo final
  const result = `
    ${HEADER}
    ${generateJunk(20)}
    ${antiDebug}
    ${antiDecomp}
    ${entropy}
    ${phantoms}
    ${opaque}
    ${integrity}
    ${vmPayload}
    ${generateJunk(10)}
  `;
  
  return result.replace(/\s+/g, " ").trim();
}

// Exportación para Railway/Node.js
module.exports = { obfuscate };

