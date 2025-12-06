
export function map_alias_to_arm(alias, operands) {
  if (alias === 'add') return `ADD r0, r1  ; operands=${JSON.stringify(operands)}`;
  if (alias === 'mul') return `MUL r0, r1  ; operands=${JSON.stringify(operands)}`;
  if (alias === 'sub') return `SUB r0, r1  ; operands=${JSON.stringify(operands)}`;
  if (alias === 'div') return `UDIV r0, r1 ; operands=${JSON.stringify(operands)}`;
  if (alias === 'dot') return `VMLA r0, r1, r2 ; dot placeholder operands=${JSON.stringify(operands)}`;
  return `; unknown alias ${alias} operands=${JSON.stringify(operands)}`;
}
