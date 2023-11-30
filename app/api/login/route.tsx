import { NextResponse } from "next/server";
import type { NextApiRequest } from "next";

export async function POST(req: NextApiRequest) {
  return handler(req);
}

export async function handler(req: NextApiRequest) {
  const body = await req.json();
  const apiUrl = `https://${body.astra_db_id}-${body.astra_region}.apps.astra.datastax.com/api/rest/v2/schemas/keyspaces/${body.astra_keyspace}`;
  const options = {
    method: "GET",
    headers: {
      "x-cassandra-token": body.astra_token,
    },
  };

  const response = await fetch(apiUrl, options);
  const data = await response.json();
  return NextResponse.json(data, { status: response.status });
}
