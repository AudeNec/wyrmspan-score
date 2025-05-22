import { useLoaderData } from "@remix-run/react";
import { json } from "@remix-run/node";
import { PrismaClient } from "@prisma/client";
import type { PlayerType } from "~/types/Player";
import type { ScoreType } from "~/types/Score";

const prisma = new PrismaClient();

export const loader = async ({ params }: { params: { playerId: string } }) => {
	const player = await prisma.player.findUnique({
		where: { id: Number(params.playerId) },
	});
	if (!player) {
		throw new Response("Player not found", { status: 404 });
	}

	const playerAverages = await prisma.score.aggregate({
		_avg: {
			guild: true,
			dragons: true,
			endGame: true,
			eggs: true,
			resources: true,
			cards: true,
			objectives: true,
			misc: true,
		},
		where: {
			playerId: player.id,
		},
	});

	const globalAverages = await prisma.score.aggregate({
		_avg: {
			guild: true,
			dragons: true,
			endGame: true,
			eggs: true,
			resources: true,
			cards: true,
			objectives: true,
			misc: true,
		},
	});

	return json({ player, playerAverages, globalAverages });
};

export default function Player() {
	const {
		player,
		playerAverages,
		globalAverages,
	}: {
		player: PlayerType;
		playerAverages: { _avg: Partial<ScoreType> };
		globalAverages: { _avg: Partial<ScoreType> };
	} = useLoaderData();

	console.log("player", player, "player averages", playerAverages);

	return (
		<div id="player" className="p-6 bg-white shadow-lg rounded-lg">
			<h1 className="text-2xl text-black font-bold">{player?.pseudo}</h1>
			<div id="main-scores" className="p-2 bg-grey-200 shadow-lg rounded-lg">
				{playerAverages ? (
					<>
						{Object.entries(playerAverages._avg).map(([key, avg]) => (
							<p className="text-black" key={key}>
								{key}: {Math.round(avg * 10) / 10}
							</p>
						))}
						<p>
							Score:{" "}
							{Math.round(
								Object.entries(playerAverages._avg).reduce(
									(sum, [, avg]) => sum + avg,
									0,
								),
							)}
						</p>
					</>
				) : (
					<></>
				)}
			</div>
			<div id="main-scores" className="p-2 bg-grey-200 shadow-lg rouded-lg">
				<h3>VS global averages</h3>
				{globalAverages ? (
					Object.entries(globalAverages._avg).map(([key, avg]) => (
						<p className="text-black" key={key}>
							{key} : {Math.round(avg * 10) / 10}
						</p>
					))
				) : (
					<></>
				)}
			</div>
		</div>
	);
}
