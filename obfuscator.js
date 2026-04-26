const HEADER = `--[[ this code is protected by unveilX obfuscator ]]`

// ─── XOR ENCRYPTION ───────────────────────────────────────────────────────
function xorEncrypt(str, key) {
  const result = []
  for (let i = 0; i < str.length; i++) {
    result.push(str.charCodeAt(i) ^ key)
  }
  return result
}

// ─── STRING TABLE EXTRACTION ──────────────────────────────────────────────
function extractStrings(code) {
  const strings = []
  const stringMap = new Map()
  let i = 0

  while (i < code.length) {
    if (code[i] === '"' || code[i] === "'") {
      const quote = code[i]
      let str = ''
      i++
      while (i < code.length && code[i] !== quote) {
        if (code[i] === '\\') {
          str += code[i] + code[i + 1]
          i += 2
        } else {
          str += code[i]
          i++
        }
      }
      i++
      if (!stringMap.has(str)) {
        stringMap.set(str, strings.length)
        strings.push(str)
      }
    } else if (code[i] === '-' && code[i + 1] === '-') {
      while (i < code.length && code[i] !== '\n') i++
    } else {
      i++
    }
  }
  return strings
}

// ─── EXTRACT VARIABLES ────────────────────────────────────────────────────
function extractVariables(code) {
  const vars = new Set()
  const regex = /\b([a-zA-Z_][a-zA-Z0-9_]*)\b/g
  const keywords = new Set(['local', 'function', 'end', 'if', 'then', 'else', 'while', 'do', 'for', 'return', 'and', 'or', 'not', 'true', 'false', 'nil', 'print', 'table', 'string', 'math', 'type', 'pairs', 'ipairs', 'next', 'setmetatable', 'getmetatable', 'rawget', 'rawset', 'pcall', 'xpcall', 'error', 'assert'])
  
  let match
  while ((match = regex.exec(code)) !== null) {
    if (!keywords.has(match[1])) {
      vars.add(match[1])
    }
  }
  return Array.from(vars)
}

// ─── GENERATE RANDOM VARIABLE NAME ────────────────────────────────────────
function randomVarName() {
  const styles = [
    () => `L${Math.floor(Math.random() * 10)}_${Math.floor(Math.random() * 10)}`,
    () => `_G_${Math.floor(Math.random() * 100000)}`,
    () => `${String.fromCharCode(65 + Math.floor(Math.random() * 26))}_${Math.floor(Math.random() * 1000)}`
  ]
  return styles[Math.floor(Math.random() * styles.length)]()
}

// ─── LURAPH VM BYTECODE GENERATOR ─────────────────────────────────────────
function generateVM() {
  return `
local _VM_OPS = {
  MOVE = 0x01,
  LOADK = 0x02,
  CALL = 0x03,
  RETURN = 0x04,
  JMP = 0x05,
  EQ = 0x06,
  LT = 0x07,
  ADD = 0x08,
  SUB = 0x09,
  MUL = 0x0A,
  DIV = 0x0B,
  GETGLOBAL = 0x0C,
  SETGLOBAL = 0x0D,
  CONCAT = 0x0E,
  FORLOOP = 0x0F,
  FORINIT = 0x10
}

local _VM_STATE = {
  pc = 0,
  stack = {},
  globals = {},
  upvalues = {},
  call_stack = {}
}

local function _VM_EXECUTE(bytecode)
  _VM_STATE.pc = 0
  local pc = 0
  
  while pc < #bytecode do
    local opcode = bytecode[pc + 1]
    local arg1 = bytecode[pc + 2]
    local arg2 = bytecode[pc + 3]
    local arg3 = bytecode[pc + 4]
    
    if opcode == _VM_OPS.MOVE then
      _VM_STATE.stack[arg1] = _VM_STATE.stack[arg2]
    elseif opcode == _VM_OPS.LOADK then
      _VM_STATE.stack[arg1] = _VM_STATE.globals[arg2]
    elseif opcode == _VM_OPS.ADD then
      _VM_STATE.stack[arg1] = _VM_STATE.stack[arg2] + _VM_STATE.stack[arg3]
    elseif opcode == _VM_OPS.JMP then
      pc = arg1 - 1
    elseif opcode == _VM_OPS.CALL then
      local func = _VM_STATE.stack[arg1]
      if type(func) == "function" then
        func(unpack(_VM_STATE.stack, arg2, arg2 + arg3 - 1))
      end
    elseif opcode == _VM_OPS.RETURN then
      return _VM_STATE.stack[arg1]
    end
    
    pc = pc + 4
  end
  
  return _VM_STATE.stack[1]
end
`
}

// ─── CONTROL FLOW FLATTENING ──────────────────────────────────────────────
function flattenControlFlow(code) {
  let result = code
  let stateCounter = 0

  // Flatten if statements
  const ifPattern = /if\s+(.+?)\s+then\s+([\s\S]*?)\s+else\s+([\s\S]*?)\s+end/g
  result = result.replace(ifPattern, (match, cond, action1, action2) => {
    const stateVar = `_STATE_${stateCounter++}`
    return `local ${stateVar} = 0
if (${cond}) then ${stateVar} = 1 else ${stateVar} = 2 end
while ${stateVar} ~= 0 do
  if ${stateVar} == 1 then
    ${action1}
    ${stateVar} = 0
  elseif ${stateVar} == 2 then
    ${action2}
    ${stateVar} = 0
  end
end`
  })

  // Flatten for loops
  const forPattern = /for\s+(\w+)\s*=\s*(.+?),\s*(.+?)\s+do\s+([\s\S]*?)\s+end/g
  result = result.replace(forPattern, (match, varName, start, end_, body) => {
    const loopVar = `_LOOP_${stateCounter++}`
    return `local ${varName} = ${start}
local ${loopVar} = ${end_}
while ${varName} <= ${loopVar} do
  ${body}
  ${varName} = ${varName} + 1
end`
  })

  return result
}

// ─── ARITHMETIC OBFUSCATION ───────────────────────────────────────────────
function obfuscateArithmetic(code) {
  let result = code
  
  // Obfuscate numeric literals
  const numPattern = /\b(\d+)\b/g
  result = result.replace(numPattern, (match) => {
    const num = parseInt(match)
    const methods = [
      `(${num * 2}/2)`,
      `(${num + 1}-1)`,
      `(${num}+0)`,
      `((${num/2})*2)`,
      `(${Math.floor(num/5)}*5+${num % 5})`
    ]
    return methods[Math.floor(Math.random() * methods.length)]
  })

  return result
}

// ─── VARIABLE RENAMING ────────────────────────────────────────────────────
function renameVariables(code, variables) {
  let result = code
  const varMap = {}

  for (const varName of variables) {
    const newName = randomVarName()
    varMap[varName] = newName
    
    // Replace all occurrences
    const regex = new RegExp(`\\b${varName}\\b`, 'g')
    result = result.replace(regex, newName)
  }

  return result
}

// ─── DEAD CODE INJECTION ──────────────────────────────────────────────────
function injectDeadCode(code) {
  const deadCodePatterns = [
    'local _d={}',
    'if 1==2 then print("x") end',
    'local _x=0 local _y=_x+1',
    'function _noop() end',
    'local _t=setmetatable({},{__index=function()end})',
    'local _b=bit32.bxor(255,255)',
    'while false do end',
    'local _m=math.floor(999999999)'
  ]

  const lines = code.split('\n')
  const result = []

  for (const line of lines) {
    result.push(line)
    if (Math.random() < 0.15) {
      const deadCode = deadCodePatterns[Math.floor(Math.random() * deadCodePatterns.length)]
      result.push(deadCode)
    }
  }

  return result.join('\n')
}

// ─── STRING TABLE ENCRYPTION ──────────────────────────────────────────────
function encryptStringTable(strings) {
  const key = Math.floor(Math.random() * 256)
  const table = {}

  for (let i = 0; i < strings.length; i++) {
    const encrypted = xorEncrypt(strings[i], key)
    table[i] = encrypted
  }

  const tableStr = Object.entries(table)
    .map(([idx, bytes]) => `[${idx}]={${bytes.join(',')}}`)
    .join(',')

  return {
    key,
    decryptor: `
local _ST_ENC={${tableStr}}
local _ST_KEY=${key}
local function _ST_DEC(idx)
  if not _ST_ENC[idx] then return "" end
  local enc=_ST_ENC[idx]
  local dec=""
  for i=1,#enc do
    dec=dec..string.char(enc[i]~_ST_KEY)
  end
  return dec
end
local ST=setmetatable({},{__index=function(t,k) return _ST_DEC(k) end})
`
  }
}

// ─── REPLACE STRINGS IN CODE ──────────────────────────────────────────────
function replaceStringsInCode(code, strings) {
  let result = code

  for (let i = 0; i < strings.length; i++) {
    const str = strings[i]
    const escapedStr = str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    const pattern = new RegExp(`["']${escapedStr}["']`, 'g')
    result = result.replace(pattern, `ST[${i}]`)
  }

  return result
}

// ─── ANTI-DEBUG MACHINE ───────────────────────────────────────────────────
function generateAntiDebug() {
  return `
local _ANTI_DEBUG = function()
  if debug then
    local _d1 = pcall(debug.getinfo, 1)
    if _d1 then
      local _d2 = pcall(debug.getlocal, 1, 1)
      if _d2 then error("DEBUGGER DETECTED", 2) end
    end
  end
  
  if getfenv and getfenv() then
    local _env = getfenv()
    if _env.__DEBUGGER__ or _env.debug then
      error("DEBUG ENV", 2)
    end
  end
end

_ANTI_DEBUG()
`
}

// ─── ANTI-TAMPERING CHECKS ────────────────────────────────────────────────
function generateAntiTampering() {
  return `
local _INTEGRITY_CHECK = function()
  local _checks = {
    string.byte == _G.string.byte,
    string.char == _G.string.char,
    type == _G.type,
    pairs == _G.pairs
  }
  
  for _,_check in ipairs(_checks) do
    if not _check then
      error("CODE MODIFIED", 2)
    end
  end
end

_INTEGRITY_CHECK()
`
}

// ─── UPVALUE OBSCURING ────────────────────────────────────────────────────
function wrapInUpvalues(code) {
  return `
local function _WRAPPER()
  ${code}
end

_WRAPPER()
`
}

// ─── MAIN OBFUSCATOR FUNCTION ─────────────────────────────────────────────
function obfuscate(sourceCode) {
  if (!sourceCode) return HEADER + '\nreturn'

  let code = sourceCode

  // 1. Extract strings
  const strings = extractStrings(code)
  
  // 2. Encrypt string table
  const stringEncryption = encryptStringTable(strings)
  
  // 3. Replace strings with ST[idx]
  code = replaceStringsInCode(code, strings)
  
  // 4. Extract and rename variables
  const variables = extractVariables(code)
  code = renameVariables(code, variables)
  
  // 5. Flatten control flow
  code = flattenControlFlow(code)
  
  // 6. Obfuscate arithmetic
  code = obfuscateArithmetic(code)
  
  // 7. Inject dead code
  code = injectDeadCode(code)
  
  // 8. Wrap in upvalues
  code = wrapInUpvalues(code)
  
  // 9. Build final code
  let final = HEADER + '\n'
  final += generateVM() + '\n'
  final += generateAntiDebug() + '\n'
  final += generateAntiTampering() + '\n'
  final += stringEncryption.decryptor + '\n'
  final += code

  return final
}

module.exports = { obfuscate }
