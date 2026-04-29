import { useEffect, useState } from "react";

import { Category } from "@org/shared-types";

import styles from "./app.module.scss";

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

	async function submit() {
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
		<div className={styles.admin__section}>
			<section className={styles.admin__container}>
				<h2 className={`${styles.admin__title} h h_s`}>Створити категорію</h2>

				<form className={styles.admin__form} onSubmit={e => e.preventDefault()}>
					<div className={styles.admin__form_group}>
						<label className={`${styles.admin__label} reular`} htmlFor="category-name">Назва</label>
						<input
							className={`${styles.admin__input} small _button_border`}
							id="category-name"
							placeholder="Назва категорії"
							value={name}
							onChange={e => setName(e.target.value)}
						/>
					</div>

					<div className={styles.admin__form_group}>
						<label className={`${styles.admin__label} reular`} htmlFor="category-parent">Категорія</label>
						<select
							className={`${styles.admin__input} small _button_border`}
							id="category-parent"
							value={parentId}
							onChange={e => setParentId(Number(e.target.value))}
						>
							<option value="">Без батьківської</option>

							{categories.map((c) => (
								<option key={c.id} value={c.id}>
									{c.name}
								</option>
							))}
						</select>
					</div>

				</form>

				<button className={`${styles.admin__button} regular _button _button_main _button_border regular upper`} onClick={submit}>
					Створити
				</button>
			</section>
		</div>
	);
}