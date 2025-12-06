
#!/usr/bin/env node
import fs from 'fs';
import path from 'path';

const SHAPES_BY_OPCODE = { 0x01: 'SUM2', 0x02: 'MUL2', 0x03: 'SUB2', 0x04: 'DIV2' };
const ALIAS_BY_SHAPE = { SUM2: 'add', MUL2: 'mul', SUB2: 'sub', DIV2: 'div' };

function usage() { console.log('Usage: mc_to_json.mjs <input.mc> [-o output.json]'); }
function readU16(buf, i) { return [buf.readUInt16LE(i), i+2]; }

function main() {
  const argv = process.argv.slice(2);
  if (argv.length < 1) { usage(); process.exit(1); }
  const src = argv[0];
  let out = 'out.json';
  const oi = argv.indexOf('-o');
  if (oi !== -1 && argv[oi+1]) out = argv[oi+1];

  const b = fs.readFileSync(src);
  if (!b.slice(0,4).equals(Buffer.from('AA01')) || !b.slice(-4).equals(Buffer.from('AA00'))) {
    throw new Error('Invalid magic/footer for AA microcode');
  }
  let i = 4;
  const program = [];
  while (i < b.length - 4) {
    const opcode = b[i]; i += 1;
    const thread = b[i]; i += 1;
    const nops = b[i]; i += 1;
    const operands = [];
    for (let k=0; k<nops; k++) { const [val, j] = readU16(b, i); operands.push(val); i = j; }
    const shape = SHAPES_BY_OPCODE[opcode] || 'UNKNOWN';
    const alias = ALIAS_BY_SHAPE[shape] || 'unknown';
    program.push({ alias, shape, thread, operands });
  }
  const data = { program };
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, JSON.stringify(data, null, 2));
  console.log(`Wrote ${out}`);
}

main();
