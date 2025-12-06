
export function map_alias_to_ptx(alias, operands) {
  if (alias === 'add') return `add.u16 %r0, %r1, %r2 ; operands=${JSON.stringify(operands)}`;
  if (alias === 'mul') return `mul.lo.u16 %r0, %r1, %r2 ; operands=${JSON.stringify(operands)}`;
  if (alias === 'sub') return `sub.u16 %r0, %r1, %r2 ; operands=${JSON.stringify(operands)}`;
  if (alias === 'div') return `div.u16 %r0, %r1, %r2 ; operands=${JSON.stringify(operands)}`;
  if (alias === 'dot') return `dp4a.s32.s32 %r0, %r1, %r2, %r3 ; dot placeholder operands=${JSON.stringify(operands)}`;
  return `// unknown alias ${alias} operands=${JSON.stringify(operands)}`;
}
