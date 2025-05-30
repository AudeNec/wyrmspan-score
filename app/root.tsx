import {
  Link,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";
import type { LinksFunction } from "@remix-run/node";

import "./tailwind.css";
import { PrismaClient } from "@prisma/client";

import type { PlayerType } from "./types/Player";
import Nav from "./components/Nav";

const prisma = new PrismaClient();

export const loader = async () => {
  const players: PlayerType[] = await prisma.player.findMany();
  return { players };
};

export const links: LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  const { players }: { players: PlayerType[] } = useLoaderData();
  return (
    <main className="flex h-screen bg-[url(/app/assets/background.webp)] bg-no-repeat bg-cover">
      <Nav players={players} />

      <div className="flex-1 p-6 overflow-auto">
        <Outlet />
      </div>
    </main>
  );
}
