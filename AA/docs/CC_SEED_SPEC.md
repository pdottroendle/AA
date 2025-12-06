
# CC SEED — Formal Specification

**Version:** 0.1‑alpha  
**Status:** Draft

The **Code Constructor SEED (CC SEED)** defines and deploys **application‑specific instructions** onto the AA systolic array. A SEED describes semantics, timing, placement, and interface contracts so the **CC** can instantiate a pipeline and the **runtime** can schedule parallel threads through **IOL (In‑to‑Out Logic)**.

## 1. SEED Object Model

Required fields:

```json
{
  "name": "DOT2",
  "version": "0.1",
  "uuid": "00000000-0000-0000-0000-000000000000",
  "alias": "dot",
  "shape": "DOT2",
  "operands": ["u16", "u16"],
  "semantics": "y = a*b + c*d",
  "latency_cycles": 3,
  "throughput": "1/clk",
  "pipeline_depth": 3,
  "hazards": ["RAW"],
  "placement": {"cells": [0,1], "stages": [0,1,2]},
  "iol": {"ingress": "vector2", "egress": "scalar"},
  "transport": {"ingress_bytes": 4, "egress_bytes": 2, "burst": 1},
  "constraints": {"clock": ">=400MHz", "voltage": "typ"}
}
```

### Field Notes
- **alias / shape**: Declarative mapping used by tools and microcode.
- **operands**: Typed operands (e.g., `u16`, `i32`).
- **semantics**: Short mathematical description.
- **latency / pipeline_depth**: Timing properties.
- **hazards**: RAW/WAR/WAW constraints for scheduler.
- **placement**: Preferred cells and stages.
- **iol**: Ingress/egress interface shapes for runtime.
- **transport**: Memory movement to/from the array.

## 2. Validation Rules
- `uuid` **must** be globally unique.
- `operands.length` **must** match toolchain expectations.
- `latency_cycles >= pipeline_depth`.
- `iol` ingress/egress **must** match transport byte counts.

## 3. Registration & Use
1. Add SEED JSON (e.g., `tools/examples/sample_seed.json`).
2. Register via a **SeedRegistry**.
3. CC uses placement/timing to generate microcode and hints.

## 4. Backward‑Compatible Expression (Goal)
AA provides **shims** to express SEED‑backed instructions in common assembler dialects (ARM, x86, NVIDIA PTX/CUDA). Exact compatibility requires proper mapping and may involve pseudo‑instructions.

## 5. Versioning
- SEEDs version independently from AA.
- Semantic/timing changes require a new `version` and `uuid`.
