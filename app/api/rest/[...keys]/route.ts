import { NextResponse } from "next/server";
import type { NextApiRequest } from "next";

export async function GET(req: NextApiRequest) {
  return handler(req);
}

const currentURL = '/api/rest/'

export async function handler(req: NextApiRequest) {
  const requestUrl = `${req.url?.substring(req.url?.indexOf(currentURL)+currentURL.length)}`;
  const apiUrl = `https://${process.env.ASTRA_DB_ID}-${process.env.ASTRA_DB_REGION}.apps.astra.datastax.com/api/rest/v2/keyspaces/${process.env.ASTRA_DB_KEYSPACE}/${requestUrl}`;
  console.log("Astra REQ: ", apiUrl)
  const options = {
    method: req.method,
    headers: {
      "x-cassandra-token": process.env.ASTRA_DB_APPLICATION_TOKEN,
    },
  };
  if (req.body) {
    options.body = JSON.stringify(req.body);
  }
  const response = await fetch(apiUrl, options);
  const data = await response.json();
  return NextResponse.json(data, { status: response.status });
}
