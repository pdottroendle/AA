
# JSON ⇄ Microcode

Reference encoding:
- Magic: `AA01` (4 bytes)
- Instruction: opcode (1), thread (1), operand_count (1), operands (N*2 bytes little‑endian)
- End: `AA00`

This is a **reference** format for tooling and will evolve.
