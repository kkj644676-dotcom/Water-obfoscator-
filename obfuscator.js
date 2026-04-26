const HEADER = `-- [[ Protected by Veil Obfuscator ]]`;

// Basado en el estilo de Veil: Variables cortas y nombres aleatorios
const VEIL_VARS = ["I", "A", "_", "r", "G", "z", "o", "b", "D", "u", "F", "O", "N", "B", "d", "J", "q", "C", "Z", "W", "y", "n", "l"];
const VEIL_LONG_NAMES = ["Mn", "gmp", "bgm", "lbe", "jpq", "yvj", "npq", "eoe", "hud", "lzj", "qdC", "xnT"];

function generateVeilName() {
  const isLong = Math.random() > 0.7;
  if (isLong) {
    const base = VEIL_LONG_NAMES[Math.floor(Math.random() * VEIL_LONG_NAMES.length)];
    return base + Math.random().toString(36).substring(7);
  }
  return VEIL_VARS[Math.floor(Math.random() * VEIL_VARS.length)] + (Math.random() > 0.5 ? VEIL_VARS[Math.floor(Math.random() * VEIL_VARS.length)] : "");
}

function heavyMath(n) {
  if (Math.random() < 0.6) return "0x" + n.toString(16).toUpperCase();
  let a = Math.floor(Math.random() * 500);
  return `(bit32.bxor(${n}, ${a}) - ${a} + ${a})`; // Simulación de operaciones de Veil
}

function generateJunk(lines = 30) {
  let j = '';
  for (let i = 0; i < lines; i++) {
    const v = generateVeilName();
    j += `local ${v}=${heavyMath(Math.floor(Math.random() * 255))} `;
    if (Math.random() > 0.8) j += `if not rawequal(${v},nil) then ${v}=bit32.band(${v},0xFF) end `;
  }
  return j;
}

function buildTrueVM(payloadStr) {
  const STACK = generateVeilName();
  const KEY = generateVeilName();
  const seed = Math.floor(Math.random() * 255);
  
  // Estructura de retorno de Veil: return(function() ... end)()
  let vmCore = `return(function() local I,A,_,r,G,z,o,b,D,u,F,O,N,B,d,J,q,C,Z,W,y,n,l=string.byte,string.sub,string.char,string.gsub,string.rep,setmetatable,pcall,type,tostring,assert,unpack,string.pack,bit32.bxor,bit32.band,bit32.bnot,bit32.lshift,bit32.rshift,math.floor,string.len,table.concat,rawget,rawequal,getfenv; `;
  
  vmCore += `local ${STACK}={} local ${KEY}=${heavyMath(seed)} `;
  
  let bytes = payloadStr.split('').map(c => heavyMath(c.charCodeAt(0) ^ seed));
  vmCore += `local data={${bytes.join(',')}} `;
  
  vmCore += `for i=1,#data do table.insert(${STACK}, _(bit32.bxor(data[i], ${KEY}))) end `;
  vmCore += `local exec = loadstring(table.concat(${STACK})) ${STACK}=nil return exec() end)() `;
  
  return vmCore;
}

function obfuscate(sourceCode) {
  if (!sourceCode) return '-- ERROR';
  
  const junk = generateJunk(40);
  const vm = buildTrueVM(sourceCode);
  
  // Reemplazo final para que sea una sola línea compacta como Veil
  const result = `${HEADER} ${junk} ${vm}`;
  return result.replace(/\s+/g, " ").trim();
}

module.exports = { obfuscate };
