import { NextResponse } from 'next/server'

const nextReddirect = (toUrl: string | URL, currentUrl: string | URL) => {
	return NextResponse.redirect(new URL(toUrl, currentUrl))
}

export { nextReddirect }
