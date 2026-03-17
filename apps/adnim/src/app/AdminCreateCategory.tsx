import { useEffect, useState } from "react";

type Category = {
	id: number;
	name: string;
	parent_id: number | null;
};

export default function AdminCreateCategory() {
	const [name, setName] = useState("");
	const [parentId, setParentId] = useState<number | "">("");
	const [categories, setCategories] = useState<Category[]>([]);

	useEffect(() => {
		fetch("/api/categories")
			.then(async r => {
				if (!r.ok) {
					throw new Error("Failed to fetch categories");
				}

				const text = await r.text();
				if (!text) return [];

				return JSON.parse(text);
			})
			.then(setCategories)
			.catch(console.error);
	}, []);

	async function submit(e: React.FormEvent) {
		e.preventDefault();

		await fetch("/api/admin/categories", {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
				name,
				parent_id: parentId || null
			})
		});

		setName("");
	}


	return (
		<form onSubmit={submit}>
			<h2>Створити категорію</h2>

			<input
				placeholder="Назва категорії"
				value={name}
				onChange={e => setName(e.target.value)}
			/>

			<select
				value={parentId}
				onChange={e => setParentId(Number(e.target.value))}
			>
				<option value="">Без батьківської</option>

				{categories.map((c) => (
					// category
					// _subcategory
					// __subcategory with products
					<option key={c.id} value={c.id}>
						{c.name}
					</option>
				))}
			</select>

			<button type="submit">
				Створити
			</button>
		</form>
	);
}