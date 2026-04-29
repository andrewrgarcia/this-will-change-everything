import { runSystem } from "@/core/SystemRuntime"

export async function POST(req: Request) {
  const body = await req.json()

  const result = await runSystem(body.input)

  return Response.json(result)
}