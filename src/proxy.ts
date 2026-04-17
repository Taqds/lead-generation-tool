import middleware from "next-auth/middleware";

export function proxy(req: any, ev: any) {
  return (middleware as any)(req, ev);
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/campaigns/:path*",
    "/leads/:path*",
    "/api/exports/:path*",
  ],
};
