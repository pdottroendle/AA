
export function map_alias_to_x86(alias, operands) {
  if (alias === 'add') return `ADD eax, ebx  ; operands=${JSON.stringify(operands)}`;
  if (alias === 'mul') return `IMUL eax, ebx ; operands=${JSON.stringify(operands)}`;
  if (alias === 'sub') return `SUB eax, ebx  ; operands=${JSON.stringify(operands)}`;
  if (alias === 'div') return `IDIV ebx      ; operands=${JSON.stringify(operands)}`;
  if (alias === 'dot') return `VPDPWSSD xmm0, xmm1, xmm2 ; dot placeholder operands=${JSON.stringify(operands)}`;
  return `; unknown alias ${alias} operands=${JSON.stringify(operands)}`;
}
