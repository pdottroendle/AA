
#!/usr/bin/env node
import fs from 'fs';
import path from 'path';

const OPCODES = { SUM2: 0x01, MUL2: 0x02, SUB2: 0x03, DIV2: 0x04 };
const ALIAS_TO_SHAPE = { add: 'SUM2', mul: 'MUL2', sub: 'SUB2', div: 'DIV2' };

function encodeU16(n) { const b = Buffer.alloc(2); b.writeUInt16LE(n); return b; }
function usage() { console.log('Usage: json_to_mc.mjs <program.json> [-o output.mc]'); }

function main() {
  const argv = process.argv.slice(2);
  if (argv.length < 1) { usage(); process.exit(1); }
  const src = argv[0];
  let out = 'out.mc';
  const oi = argv.indexOf('-o');
  if (oi !== -1 && argv[oi+1]) out = argv[oi+1];

  const data = JSON.parse(fs.readFileSync(src, 'utf-8'));
  const prog = data.program || [];

  const chunks = [];
  chunks.push(Buffer.from('AA01'));

  for (const ins of prog) {
    const alias = ins.alias;
    const shape = ins.shape || ALIAS_TO_SHAPE[alias];
    if (!shape) throw new Error(`Unknown shape for alias ${alias}`);
    const opcode = OPCODES[shape];
    if (opcode === undefined) throw new Error(`Unknown opcode for shape ${shape}`);
    const thread = (ins.thread ?? 0) & 0xFF;
    const operands = (ins.operands || []).map(x => Number(x));
    chunks.push(Buffer.from([opcode]));
    chunks.push(Buffer.from([thread]));
    chunks.push(Buffer.from([operands.length & 0xFF]));
    for (const op of operands) chunks.push(encodeU16(op));
  }
  chunks.push(Buffer.from('AA00'));

  const buf = Buffer.concat(chunks);
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, buf);
  console.log(`Wrote ${out} (${buf.length} bytes)`);
}

main();
