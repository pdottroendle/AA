
export class Seed {
  constructor(data){
    this.data = data;
    this.name = data.name;
    this.uuid = data.uuid;
    this.alias = data.alias;
    this.shape = data.shape;
    this.operands = data.operands || [];
    this.latency_cycles = data.latency_cycles;
    this.pipeline_depth = data.pipeline_depth;
  }
  validate(){
    if (!this.name || !this.uuid || !this.shape) throw new Error('Missing required fields');
    if (!Array.isArray(this.operands)) throw new Error('operands must be an array');
    if (this.latency_cycles != null && this.pipeline_depth != null){
      if (this.latency_cycles < this.pipeline_depth) throw new Error('latency < pipeline_depth');
    }
  }
}

export class SeedRegistry {
  constructor(){ this.seeds = new Map(); }
  load(path){ const data = JSON.parse(require('fs').readFileSync(path, 'utf-8')); const s = new Seed(data); s.validate(); this.seeds.set(s.shape, s); return s; }
  get(shape){ return this.seeds.get(shape); }
}
