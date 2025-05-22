import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
	return [
		{ title: "Wyrmspan Dashboard" },
		{
			name: "description",
			content: "Our own dashboard for the board game Wyrmspan",
		},
	];
};

export default function Index() {
	return (
		<section>
			<h1>Welcome to our Wyrmspan dashboard</h1>
		</section>
	);
}
