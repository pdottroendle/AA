
import fs from 'fs';
import path from 'path';
import { spawnSync } from 'child_process';

function assert(cond, msg){ if(!cond) throw new Error(msg || 'Assertion failed'); }

function run(){
  const tmp = path.join('build', 'js-tests');
  fs.mkdirSync(tmp, { recursive: true });

  // 1) Roundtrip JSON -> MC -> JSON
  const progPath = path.join(tmp, 'prog.json');
  fs.writeFileSync(progPath, JSON.stringify({ program: [
    { alias: 'add', thread: 0, operands: [1,2] },
    { alias: 'mul', thread: 1, operands: [3,4] },
  ] }, null, 2));

  const mcPath = path.join(tmp, 'out.mc');
  let r = spawnSync('node', ['tools/js/json_to_mc.mjs', progPath, '-o', mcPath], { stdio: 'inherit' });
  assert(r.status === 0, 'json_to_mc failed');

  const outJson = path.join(tmp, 'out.json');
  r = spawnSync('node', ['tools/js/mc_to_json.mjs', mcPath, '-o', outJson], { stdio: 'inherit' });
  assert(r.status === 0, 'mc_to_json failed');

  const data = JSON.parse(fs.readFileSync(outJson, 'utf-8'));
  assert(data.program.length === 2, 'program length mismatch');
  assert(data.program[0].alias === 'add', 'first alias mismatch');
  assert(data.program[1].alias === 'mul', 'second alias mismatch');

  // 2) asm export (x86)
  const asmPath = path.join(tmp, 'out.x86.asm');
  r = spawnSync('node', ['tools/js/shims/asm_export.mjs', mcPath, '--target', 'x86', '-o', asmPath], { stdio: 'inherit' });
  assert(r.status === 0, 'asm_export failed');
  const asmText = fs.readFileSync(asmPath, 'utf-8');
  assert(asmText.includes('ADD eax, ebx'), 'x86 ADD missing');
  assert(asmText.includes('IMUL eax, ebx'), 'x86 IMUL missing');

  console.log('
All JS tests passed.');
}

run();
