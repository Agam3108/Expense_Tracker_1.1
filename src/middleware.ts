import { clerkMiddleware } from "@clerk/nextjs/server";

export default clerkMiddleware({
  publicRoutes: ["/"], // routes that don't require auth
});

export const config = {
  matcher: ["/((?!_next|.*\\..*).*)"], // apply middleware everywhere except static assets
};
