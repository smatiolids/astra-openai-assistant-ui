import { NextResponse, NextRequest } from "next/server";
import { headers } from 'next/headers'

export async function GET(req: NextRequest) {
  return handler(req);
}

const currentURL = '/api/rest/'


async function handler(req: NextRequest) {
  const header = await headers()

  const requestUrl = `${req.url?.substring(req.url?.indexOf(currentURL)+currentURL.length)}`;
  const apiUrl = `https://${header.get("x-astra-db-id")}-${header.get("x-astra-region")}.apps.astra.datastax.com/api/rest/v2/keyspaces/${header.get("x-astra-keyspace")}/${requestUrl}`;
  const options: Record<string, any> = {
    method: req.method,
    headers: {
      "x-cassandra-token": header.get("x-astra-token")!
    }
  };
  if (req.body) {
    options.body = JSON.stringify(req.body);
  } 

  const response = await fetch(apiUrl, options);
  const data = await response.json();
  return NextResponse.json(data, { status: response.status });
}
