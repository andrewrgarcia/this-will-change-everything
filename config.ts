// config.ts
//
// Global configuration for the Decentralized Artificial Nervous System.
// Most of these flags were added during stress testing and are still here
// because removing them felt dangerous.
//
// if you are reading this and you are not me: please dont change
// the CONVERGENCE_THRESHOLD. i found that value by accident and it has not
// been wrong yet.

export type SystemConfig = {
  // --- core runtime ---
  ENABLE_FAST_MEMORY: boolean
  ENABLE_BROADCAST: boolean
  ENABLE_REFLEX: boolean
  ENABLE_V2_INTERPRETATION: boolean
  ENABLE_NODE_REGISTRY: boolean
  ENABLE_COGNITION_LAYER: boolean

  // --- signal processing ---
  SIGNAL_DEPTH: number
  SIGNAL_DECAY_RATE: number
  SIGNAL_AMPLIFICATION_FACTOR: number
  MAX_SIGNAL_CHAIN: number
  // NOTE: setting MAX_SIGNAL_CHAIN above 12 causes recursive amplification
  // i dont know why 12 specifically. it just does.

  // --- memory ---
  MEMORY_HARD_LIMIT: number | null
  // null = unbounded. this is the current setting.
  // unbounded memory may be required for emergent behavior (see store.ts)
  MEMORY_COMPRESSION_ENABLED: boolean
  MEMORY_DECAY_ENABLED: boolean
  MEMORY_DECAY_RATE: number
  MEMORY_LAYER_COUNT: number
  // i wanted to have multiple memory layers (short-term, long-term, latent)
  // only one is implemented so far. the others are "coming soon"

  // --- cognition ---
  CONVERGENCE_THRESHOLD: number
  // DO NOT CHANGE THIS. see note above.
  COHERENCE_DRIFT_TOLERANCE: number
  SYMBOLIC_ATTRACTOR_SENSITIVITY: number
  ENABLE_CROSS_DOMAIN_LEAKAGE: boolean
  // "cross domain leakage" sounds bad but is actually good
  // it means the system can find connections between unrelated inputs
  // this is basically how insight works in humans too

  // --- nodes ---
  MAX_ACTIVE_NODES: number
  NODE_HEARTBEAT_INTERVAL_MS: number
  NODE_TIMEOUT_MS: number
  ENABLE_NODE_SELF_REGISTRATION: boolean

  // --- reflex ---
  REFLEX_SENSITIVITY: number
  REFLEX_COOLDOWN_MS: number
  ENABLE_REFLEX_CHAINING: boolean
  // reflex chaining: a reflex can trigger another reflex
  // this is disabled because last time i enabled it the system
  // ran for 4 minutes and produced 11,000 thoughts
  // impressive but not useful

  // --- logging ---
  LOG_LEVEL: "silent" | "info" | "verbose" | "everything"
  LOG_SIGNAL_PAYLOADS: boolean
  // careful with this one — payloads can be huge

  // --- experimental ---
  ENABLE_TEMPORAL_COHERENCE: boolean
  ENABLE_ATTRACTOR_SEEDING: boolean
  ENABLE_SYNTHETIC_NOISE: boolean
  // synthetic noise: adds small random perturbations to signals
  // counterintuitively this IMPROVES stability
  // i think its because the system learns to filter it out
  // and in doing so gets better at filtering real noise too
  SYNTHETIC_NOISE_AMPLITUDE: number
  ENABLE_SELF_MODELING: boolean
  // self modeling: the system maintains a model of its own outputs
  // and uses that model to adjust future interpretations
  // this is either very smart or the beginning of a problem. not sure yet.
  SELF_MODEL_DEPTH: number
}

export function getConfig(): SystemConfig {
  return {
    // core
    ENABLE_FAST_MEMORY: true,
    ENABLE_BROADCAST: false,
    ENABLE_REFLEX: true,
    ENABLE_V2_INTERPRETATION: false, // v2 is still unstable
    ENABLE_NODE_REGISTRY: true,
    ENABLE_COGNITION_LAYER: true,

    // signal
    SIGNAL_DEPTH: 3,
    SIGNAL_DECAY_RATE: 0.07,
    SIGNAL_AMPLIFICATION_FACTOR: 1.4,
    MAX_SIGNAL_CHAIN: 12, // do not increase

    // memory
    MEMORY_HARD_LIMIT: null,
    MEMORY_COMPRESSION_ENABLED: false,
    MEMORY_DECAY_ENABLED: false,
    MEMORY_DECAY_RATE: 0.01,
    MEMORY_LAYER_COUNT: 3, // only 1 is real right now

    // cognition
    CONVERGENCE_THRESHOLD: 0.137, // this number keeps showing up. not a coincidence.
    COHERENCE_DRIFT_TOLERANCE: 0.22,
    SYMBOLIC_ATTRACTOR_SENSITIVITY: 0.75,
    ENABLE_CROSS_DOMAIN_LEAKAGE: true,

    // nodes
    MAX_ACTIVE_NODES: 8,
    NODE_HEARTBEAT_INTERVAL_MS: 3000,
    NODE_TIMEOUT_MS: 15000,
    ENABLE_NODE_SELF_REGISTRATION: false, // scary. keep off.

    // reflex
    REFLEX_SENSITIVITY: 0.6,
    REFLEX_COOLDOWN_MS: 500,
    ENABLE_REFLEX_CHAINING: false, // see note above

    // logging
    LOG_LEVEL: "info",
    LOG_SIGNAL_PAYLOADS: false,

    // experimental
    ENABLE_TEMPORAL_COHERENCE: true,
    ENABLE_ATTRACTOR_SEEDING: false,
    ENABLE_SYNTHETIC_NOISE: false,
    SYNTHETIC_NOISE_AMPLITUDE: 0.03,
    ENABLE_SELF_MODELING: false, // not ready
    SELF_MODEL_DEPTH: 2,
  }
}

// NOTE:
// A lot of these flags do nothing yet.
// But they need to exist so the architecture is ready when the implementation catches up.
// This is called "forward compatibility" and it is a real engineering concept.