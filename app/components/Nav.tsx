import { Link } from "@remix-run/react";
import { PlayerType } from "~/types/Player";

interface NavProps {
  players: PlayerType[];
}

export default function Nav({ players }: NavProps) {
  return (
    <aside className="w-64 text-black p-5 flex flex-col space-y-4 opacity-50">
      <nav className="flex flex-col space-y-2">
        <Link
          to="/matchs/form"
          className="px-3 py-2 rounded bg-yellow-700 text-white text-center hover:bg-amber-200 hover:text-black"
        >
          New Match
        </Link>
        <Link to="/dashboard" className="hover:bg-amber-200 px-3 py-2 rounded">
          Main Dashboard
        </Link>
        <hr className="border-blue-500 my-2" />
        <h3 className="text-lg font-semibold">Players</h3>
        {players.map((player) => (
          <Link
            to={`/players/${player.id}`}
            key={player.id}
            className="hover:bg-amber-200 px-3 py-2 rounded"
          >
            {player.pseudo}
          </Link>
        ))}
        <Link
          to="/players/form"
          className="hover:bg-amber-200 px-3 py-2 rounded italic"
        >
          New User
        </Link>
        <hr className="border-blue-500 my-2" />
        <Link to="/rules" className="hover:bg-amber-200 px-3 py-2 rounded">
          Rules
        </Link>
      </nav>
    </aside>
  );
}
