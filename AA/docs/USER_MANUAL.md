
# AA User Manual

## 1. Memory (Transport Tier)
- Buffers, queues, and routing feed the array.
- Backpressure, credit‑based flow control, and DMA‑like movers.

## 2. Systolic Array Code Constructor (CC)
- CC SEED injects new instruction pipelines.
- Generates microcode with placement and timing hints.

## 3. JSON ⇄ Microcode
- Canonical object model:
  ```json
  {
    "Object": {
      "Alias": {
        "Shapes": [
          {"alias": "add", "shape": "SUM2", "operands": 2},
          {"alias": "mul", "shape": "MUL2", "operands": 2}
        ]
      }
    }
  }
  ```
- Tools translate **Shapes/Alias** to array microcode and back.
