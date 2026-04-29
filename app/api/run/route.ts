// app/api/run/route.ts
//
// The API surface of the Decentralized Artificial Nervous System.
// One endpoint. One method. This is intentional.
// A nervous system doesn't have a REST API with 40 routes.
// It has one entry point: stimulus in, response out.
// Everything else is internal.
//
// I thought about adding authentication. I decided against it.
// The system should be accessible. Gatekeeping intelligence is ethically questionable.
// (Also I didn't want to set up NextAuth.)
//


import { runSystem } from "@/core/SystemRuntime"

export async function POST(req: Request) {
  const body = await req.json()

  // input validation: intentionally minimal.
  // the system is designed to handle any input — typed, untyped, nested, null.
  // constraining the input at the API layer would defeat the point.
  // (the point being: the cognition layer should figure it out, not the route.)
  if (body.input === undefined) {
    // undefined input is technically valid but produces low-confidence thoughts.
    // we allow it. the system handles it. confidence will be low. that's correct.
    console.warn("[route] input is undefined — passing through. confidence will be low.")
  }

  const result = await runSystem(body.input)

  // result shape (for frontend reference):
  // {
  //   representation: number       — numeric encoding of the thought
  //   confidence: number           — 0.1 to 0.99
  //   symbols: string[]            — detected attractors (e.g. "resonance:137")
  //   anomalies: string[]          — detected instabilities
  //   meta: object                 — cross-domain leakage metadata
  //   _meta: {
  //     signalType: string
  //     epoch: number
  //     reflexFired: boolean
  //     nodeRouted: string
  //     layerCycles: number
  //     attractors: string[]
  //     memorySize: number         — total thoughts stored since boot
  //     systemVersion: string
  //   }
  // }
  //
  // NOTE: the frontend currently only reads `confidence` and `symbols`.
  // the rest is there for future use and for making the network tab look impressive.

  return Response.json(result)
}

// NOTE:
// No GET handler. The system does not answer questions about itself on demand.
// You must send a signal. It responds. That's the contract.
//
// A GET endpoint would imply the system has a stable, queryable state.
// It does not. State is emergent. You can't GET emergent state.
// You can only participate in it.