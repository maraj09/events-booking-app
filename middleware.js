import { NextResponse } from "next/server";
import axios from "./app/axios";

async function fetchUserByToken(token) {
  try {
    const response = await axios.get(`/api/user`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching user:", error.response || error.message);
    return null;
  }
}

const guestRoutes = ["/", "/login", "/register"];
const adminRoutes = ["/dashboard", "/admin", "/events/create"];
const customerRoutes = ["/home", "/profile", "/bookings"];

export async function middleware(req) {
  const token = req.cookies.get("AUTH-TOKEN")?.value;

  if (token) {
    const user = await fetchUserByToken(token);
    if (user) {
      const role = user.roles[0].name;
      const currentPath = req.nextUrl.pathname;

      if (role === "customer" && guestRoutes.includes(currentPath)) {
        return NextResponse.redirect(new URL("/home", req.url));
      }

      if (role === "customer" && adminRoutes.includes(currentPath)) {
        return NextResponse.redirect(new URL("/home", req.url));
      }

      if (role === "customer" && currentPath.startsWith('/events/edit/')) {
        return NextResponse.redirect(new URL("/home", req.url));
      }

      if (role != "customer" && guestRoutes.includes(currentPath)) {
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }

      if (role != "customer" && customerRoutes.includes(currentPath)) {
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }
    } else {
      if (guestRoutes.includes(req.nextUrl.pathname)) {
        return NextResponse.next();
      } else {
        return NextResponse.redirect(new URL("/login", req.url));
      }
    }
  } else {
    if (guestRoutes.includes(req.nextUrl.pathname)) {
      return NextResponse.next();
    } else {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }
}

// Apply middleware to the routes where it is needed
export const config = {
  matcher: [
    "/",
    "/login",
    "/register",
    "/home",
    "/dashboard",
    "/events/create",
    "/events/edit/:slug*",
    "/bookings",
  ],
};
