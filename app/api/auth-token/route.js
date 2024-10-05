import { NextResponse } from "next/server";

export async function POST(request) {
  const { token } = await request.json();

  const response = NextResponse.json({ success: true });
  response.cookies.set("AUTH-TOKEN", token, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return response;
}

export async function GET(request) {
  const token = request.cookies.get("AUTH-TOKEN");

  if (token) {
    return NextResponse.json({ success: true, token });
  } else {
    return NextResponse.json({ success: false, message: "Token not found" });
  }
}

export async function DELETE(request) {
  const response = NextResponse.json({ success: true, message: "Logged out" });

  response.cookies.set("AUTH-TOKEN", "", {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    path: "/",
    maxAge: 0,
  });

  return response;
}
