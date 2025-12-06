
#!/usr/bin/env node
import fs from 'fs';
import path from 'path';

const SHAPES_BY_OPCODE = { 1: 'SUM2', 2: 'MUL2', 3: 'SUB2', 4: 'DIV2' };
const ALIAS_BY_SHAPE = { SUM2: 'add', MUL2: 'mul', SUB2: 'sub', DIV2: 'div' };

function readU16(buf, i) { return [buf.readUInt16LE(i), i+2]; }

function parseMC(src) {
  const b = fs.readFileSync(src);
  if (!b.slice(0,4).equals(Buffer.from('AA01')) || !b.slice(-4).equals(Buffer.from('AA00'))) {
    throw new Error('Invalid AA microcode magic/footer');
  }
  let i = 4; const prog = [];
  while (i < b.length - 4) {
    const opcode = b[i++];
    const thread = b[i++];
    const nops = b[i++];
    const operands = [];
    for (let k=0;k<nops;k++){ const [val, j]=readU16(b,i); operands.push(val); i=j; }
    const shape = SHAPES_BY_OPCODE[opcode] || 'UNKNOWN';
    const alias = ALIAS_BY_SHAPE[shape] || 'unknown';
    prog.push({ alias, shape, thread, operands });
  }
  return prog;
}

async function main(){
  const argv = process.argv.slice(2);
  if (argv.length < 3) { console.log('Usage: asm_export.mjs <input.mc> --target arm|x86|ptx [-o out.asm]'); process.exit(1); }
  const src = argv[0];
  const ti = argv.indexOf('--target');
  if (ti === -1) { console.error('Missing --target'); process.exit(1); }
  const target = argv[ti+1];
  let out = 'out.asm';
  const oi = argv.indexOf('-o');
  if (oi !== -1 && argv[oi+1]) out = argv[oi+1];

  if (!['arm','x86','ptx'].includes(target)) throw new Error('Unsupported target');
  const shim = await import(`../../../src/shims/${target}.mjs`);
  const mapFn = shim[`map_alias_to_${target}`];
  if (typeof mapFn !== 'function') throw new Error('Shim map function missing');

  const prog = parseMC(src);
  const lines = [`; Export target: ${target}`];
  for (const ins of prog){ lines.push(mapFn(ins.alias, ins.operands)); }
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, lines.join('
'));
  console.log(`Wrote ${out}`);
}

main();
