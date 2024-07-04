import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import { getCookie } from 'cookies-next';
import { decrypt } from './utils/hashing';
import { statusValue } from './helpers/enum';
import { path } from './helpers/path';

export function middleware(request: NextRequest) {
    const org_status = getCookie('status', { cookies }) as string;

    // Development mode bypass
    if (process.env.NODE_ENV === 'development') {
        console.log("Bypassing middleware in development mode");
        return NextResponse.next();
    }

    if (!org_status) {
        // Return to sign-in if no status exists
        if (request.nextUrl.pathname !== '/signin' && request.nextUrl.pathname !== '/error') {
            return NextResponse.redirect(new URL('/signin', request.url));
        }
    }

    if (org_status) {
        const status = decrypt(org_status || '');
        if (status === 'notCreated') {
            // Route to organization create page
            if (request.nextUrl.pathname !== path.createOrganization) {
                return NextResponse.redirect(new URL(path.createOrganization, request.url));
            }
        }
        if (status === 'staff') {
            // Route to organization create page
            if (request.nextUrl.pathname !== path.selectOrganization) {
                return NextResponse.redirect(new URL(path.selectOrganization, request.url));
            }
        }
        if (status === statusValue.pending) {
            // Route to pending page
            if (request.nextUrl.pathname !== path.verification.pending && request.nextUrl.pathname !== path.selectOrganization) {
                return NextResponse.redirect(new URL(path.verification.pending, request.url));
            }
        }
        if (status === statusValue.rejected) {
            // Route to rejected page
            if (request.nextUrl.pathname !== path.verification.rejected && request.nextUrl.pathname !== path.selectOrganization) {
                return NextResponse.redirect(new URL(path.verification.rejected, request.url));
            }
        }
        if (status === statusValue.approved) {
            if (!request.nextUrl.pathname.includes('/dashboard')) {
                // Restrict to only dashboard pages
                return NextResponse.redirect(new URL(path.home, request.url));
            }
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!api|static|favicon.ico|assets|favicon|images|manifest.json|_next).*)', '/'],
};