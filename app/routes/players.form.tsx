import { PrismaClient } from "@prisma/client";
import { redirect, type ActionFunctionArgs } from "@remix-run/node";
import { Form } from "@remix-run/react";

const prisma = new PrismaClient();

export const action = async ({ request }: ActionFunctionArgs) => {
	const formData = await request.formData();
	const player = Object.fromEntries(formData);
	await prisma.player.create({
		data: {
			pseudo: player.pseudo as string,
		},
	});
	const newPlayer = await prisma.player.findFirst({
		where: {
			pseudo: player.pseudo as string,
		},
	});

	if (!newPlayer) {
		throw new Response("Player not found", { status: 404 });
	}

	return redirect(`/players/${newPlayer.id}`);
};

export default function CreatePlayer() {
	return (
		<Form id="player-form" method="post">
			<input
				aria-label="pseudo"
				name="pseudo"
				placeholder="Pseudo"
				type="text"
			/>
			<button type="submit">Create Player</button>
		</Form>
	);
}
