import { PrismaClient } from "@prisma/client";
import type { ActionFunctionArgs } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import { useState } from "react";
import type { ModeType } from "~/types/Mode";
import type { PlayerType } from "~/types/Player";
import type { ScoreType } from "~/types/Score";

const prisma = new PrismaClient();

export const loader = async () => {
	const modes: ModeType[] = await prisma.mode.findMany();
	const players: PlayerType[] = await prisma.player.findMany();
	return { modes, players };
};

export const action = async ({ request }: ActionFunctionArgs) => {
	const formData = await request.formData();
	const gameData = Object.fromEntries(formData);
	const { modeId, authorId, ...scores } = gameData;

	if (!modeId || !authorId) {
		throw new Response("Mode and Author are required", { status: 400 });
	}

	const game = await prisma.game.create({
		data: {
			modeId: Number(modeId),
			authorId: Number(authorId),
		},
	});

	const playerScores = Object.keys(scores)
		.filter((key) => key.startsWith("player_"))
		.reduce(
			(acc, key) => {
				const [_, playerIdStr, criterion] = key.split("_");
				const playerId = Number(playerIdStr);

				if (!acc[playerId]) {
					acc[playerId] = { playerId, gameId: game.id };
				}

				acc[playerId][criterion as keyof ScoreType] = Number(scores[key]) || 0;
				return acc;
			},
			{} as Record<number, Partial<ScoreType>>,
		);

	console.log(playerScores);

	for (const scoreData of Object.values(playerScores)) {
		if (!scoreData.playerId || !scoreData.gameId) {
			console.error("Missing playerId or gameId", scoreData);
			continue;
		}

		await prisma.score.create({
			data: {
				playerId: scoreData.playerId,
				gameId: scoreData.gameId,
				guild: scoreData.guild ?? 0,
				dragons: scoreData.dragons ?? 0,
				endGame: scoreData.endGame ?? 0,
				eggs: scoreData.eggs ?? 0,
				resources: scoreData.resources ?? 0,
				cards: scoreData.cards ?? 0,
				objectives: scoreData.objectives ?? 0,
				misc: scoreData.misc ?? 0,
			},
		});
	}
	return new Response("Match and scores created successfully", { status: 200 });
};

export default function CreateMatch() {
	const { modes, players }: { modes: ModeType[]; players: PlayerType[] } =
		useLoaderData();

	const [numPlayers, setNumPlayers] = useState(2);

	return (
		<Form
			method="post"
			className="p-6 bg-white shadow-md rounded-lg max-w-xl mx-auto"
		>
			<h2 className="text-2xl font-bold mb-4">Create a New Match</h2>

			<label className="block mb-2 font-semibold" htmlFor="modeId">
				Game Mode
			</label>
			<select name="modeId" required className="w-full p-2 border rounded mb-4">
				<option value="">-- Choose Mode --</option>
				{modes.map((mode: ModeType) => (
					<option key={mode.id} value={mode.id}>
						{mode.title}
					</option>
				))}
			</select>

			<label className="block mb-2 font-semibold" htmlFor="authorId">
				Your Name
			</label>
			<select
				name="authorId"
				required
				className="w-full p-2 border rounded mb-4"
			>
				<option>-- Select Your Name --</option>
				{players.map((player: PlayerType) => (
					<option key={player.id} value={player.id}>
						{player.pseudo}
					</option>
				))}
			</select>

			{/* Formulaires dynamiques pour les joueurs */}
			{[...Array(numPlayers)].map((_, index) => (
				// biome-ignore lint/suspicious/noArrayIndexKey: no other data
				<div key={index} className="player-form mb-6 border p-4 rounded-lg">
					<h3 className="text-xl font-semibold mb-2">Player {index + 1}</h3>
					<label className="block mb-2" htmlFor={`player_${index + 1}_id`}>
						Player
					</label>
					<select
						name={`player_${index + 1}_id`}
						required
						className="w-full p-2 border rounded mb-4"
					>
						<option value="">-- Select Player --</option>
						{players.map((player: PlayerType) => (
							<option key={player.id} value={player.id}>
								{player.pseudo}
							</option>
						))}
					</select>

					{/* Champs pour les scores */}
					<div className="grid grid-cols-2 gap-4">
						{[
							"guild",
							"dragons",
							"endGame",
							"eggs",
							"resources",
							"cards",
							"objectives",
							"misc",
						].map((criterion) => (
							<div key={criterion}>
								<label
									className="block mb-2"
									htmlFor={`player_${index + 1}_${criterion}`}
								>
									{criterion.charAt(0).toUpperCase() + criterion.slice(1)}
								</label>
								<input
									type="number"
									name={`player_${index + 1}_${criterion}`}
									className="p-2 border rounded w-full"
									placeholder={
										criterion.charAt(0).toUpperCase() + criterion.slice(1)
									}
								/>
							</div>
						))}
					</div>
				</div>
			))}

			<button
				type="submit"
				className="w-full bg-green-600 text-white p-3 rounded-lg mt-4 hover:bg-green-700"
			>
				Create Match
			</button>
		</Form>
	);
}
