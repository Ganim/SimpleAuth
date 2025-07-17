import { cookies } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";

export async function GET(request: NextRequest){
  const redirectUrl = request.nextUrl.clone();

  redirectUrl.pathname = '/sign-in';
  
  (await cookies()).delete('token');

  return NextResponse.redirect(redirectUrl)
}