import { NextRequest, NextResponse } from 'next/server'

export function middleware(req: NextRequest) {
  const auth = req.headers.get('authorization')

  if (auth?.startsWith('Basic ')) {
    const decoded = atob(auth.slice(6))
    const colon = decoded.indexOf(':')
    const user = decoded.slice(0, colon)
    const pass = decoded.slice(colon + 1)

    if (user === process.env.BASIC_AUTH_USER && pass === process.env.BASIC_AUTH_PASSWORD) {
      return NextResponse.next()
    }
  }

  return new NextResponse('Unauthorized', {
    status: 401,
    headers: { 'WWW-Authenticate': 'Basic realm="Tracker"' },
  })
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
