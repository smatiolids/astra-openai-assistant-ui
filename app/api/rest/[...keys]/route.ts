import { NextResponse } from "next/server";
import type { NextApiRequest } from "next";
import { headers } from 'next/headers'

export async function GET(req: NextApiRequest) {
  return handler(req);
}

const currentURL = '/api/rest/'


export async function handler(req: NextApiRequest) {
  const header = await headers()

  const requestUrl = `${req.url?.substring(req.url?.indexOf(currentURL)+currentURL.length)}`;
  const apiUrl = `https://${header.get("x-astra-db-id")}-${header.get("x-astra-region")}.apps.astra.datastax.com/api/rest/v2/keyspaces/${header.get("x-astra-keyspace")}/${requestUrl}`;
  const options = {
    method: req.method,
    headers: {
      "x-cassandra-token": header.get("x-astra-token"),
    },
  };
  if (req.body) {
    options.body = JSON.stringify(req.body);
  }
  const response = await fetch(apiUrl, options);
  const data = await response.json();
  return NextResponse.json(data, { status: response.status });
}
