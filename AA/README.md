
# AA — Systolic Array Architecture

> **Tagline:** Program *systolic arrays* with **user‑defined instructions** using the **Code Constructor (CC) SEED**, executed through **In‑to‑Out Logic (IOL)** pipelines for **parallel, multi‑language threads**.

**AA** is an open architecture and tool suite that lets developers **program systolic arrays** to perform **user‑defined instructions**. This enables programs with **Programmable‑with‑Programmable‑Instruction (PwPI)** to run **in parallel**, where AA can execute multiple threads—even in **different languages**—concurrently on the array.

> **Design intent**: AA aims to allow backward‑compatible **instruction expression** with existing assembler ecosystems (ARM, x86/Intel, NVIDIA PTX/CUDA) while supporting **new, application‑specific instructions** via the **Code Constructor SEED (CC SEED)**. Real compatibility requires dedicated shims/assemblers and will evolve with the AA spec.

---

## Key Concepts

- **Systolic Array**: Treat the array as a high‑throughput **logic black box** mapping **inputs → outputs** via **IOL (In‑to‑Out Logic)** pipelines.
- **PwPI (Program with Programmed Instructions)**: Programs define **custom instructions** that AA schedules over the array.
- **CC (Code Constructor)**: A constructor/compiler that **seeds** array pipelines with new instructions (**CC SEED**) and generates runtime‑executable microcode.
- **TT (Transport Tree)**: Memory/data movement (buffers, routing, backpressure) feeding/collecting data from the array.
- **JSON ⇄ Microcode**: Declarative **Alias/Shapes** to array **microcode** and vice versa.

---

## JavaScript Tooling (Node.js)

Install Node.js (v18+ recommended; v20 tested):

```bash
# optional: if you use nvm
nvm use 20
```

**JSON → Microcode**
```bash
node tools/js/json_to_mc.mjs tools/examples/sample_program.pwpi.json -o build/sample.mc
```

**Microcode → JSON**
```bash
node tools/js/mc_to_json.mjs build/sample.mc -o build/sample.roundtrip.json
```

**Export to assembler (ARM/x86/PTX placeholders)**
```bash
node tools/js/shims/asm_export.mjs build/sample.mc --target x86 -o build/sample.x86.asm
node tools/js/shims/asm_export.mjs build/sample.mc --target arm -o build/sample.arm.asm
node tools/js/shims/asm_export.mjs build/sample.mc --target ptx -o build/sample.ptx.asm
```

**Run JS tests**
```bash
npm test
# or
node tests/js/run_tests.mjs
```

---

## Repository Layout

```
AA/
├─ README.md
├─ LICENSE (Apache-2.0)
├─ NOTICE
├─ CODE_OF_CONDUCT.md
├─ CONTRIBUTING.md
├─ SECURITY.md
├─ CITATION.cff
├─ package.json
├─ .nvmrc
├─ .gitignore
├─ docs/
│  ├─ USER_MANUAL.md
│  ├─ TRANSPORT_TIER.md
│  ├─ CODE_CONSTRUCTOR_CC.md
│  ├─ CC_SEED_SPEC.md
│  └─ JSON_MC.md
├─ specs/
│  ├─ aa-overview.md
│  ├─ instruction-format.md
│  ├─ memory-transport-tier.md
│  └─ shapes-alias-schema.json
├─ tools/
│  ├─ examples/
│  │  ├─ sample_program.pwpi.json
│  │  └─ sample_seed.json
│  └─ js/
│     ├─ json_to_mc.mjs
│     ├─ mc_to_json.mjs
│     └─ shims/
│        └─ asm_export.mjs
├─ src/
│  ├─ cc/registry.mjs
│  └─ shims/
│     ├─ arm.mjs
│     ├─ x86.mjs
│     └─ ptx.mjs
├─ tests/
│  └─ js/run_tests.mjs
└─ .github/
   └─ workflows/ci.yml
```

---

## Status
This is an early public drop (alpha). Encodings are **reference‑only** and will evolve. Compatibility shims for ARM/x86/NVIDIA PTX are **placeholders**.

## License
Apache‑2.0 (see `LICENSE`). Contributions welcome (see `CONTRIBUTING.md`).
