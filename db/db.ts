import { createClient, type Client, type InStatement } from '@libsql/client'

let _client: Client | undefined

function getClient(): Client {
  if (!_client) {
    if (!process.env.TURSO_DATABASE_URL) {
      throw new Error('TURSO_DATABASE_URL is not set')
    }
    _client = createClient({
      url: process.env.TURSO_DATABASE_URL,
      authToken: process.env.TURSO_AUTH_TOKEN,
    })
  }
  return _client
}

// Lazy wrapper — createClient() is only called on the first request, not at build time
export const db = {
  execute: (stmt: InStatement) => getClient().execute(stmt),
}
