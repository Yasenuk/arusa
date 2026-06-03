import { useState } from "react";
import styles from "../../styles/common/form-subscribe.module.scss";

export default function FormSubscribe() {
	const [email, setEmail] = useState('');
	const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
	const [message, setMessage] = useState('');

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setStatus('loading');
		try {
			const res = await fetch('/api/subscribe', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ email }),
			});
			if (res.ok) {
				setStatus('success');
				setMessage('Дякуємо! Ви успішно підписалися.');
				setEmail('');
			} else {
				const data = await res.json();
				setStatus('error');
				setMessage(data.error ?? 'Помилка. Спробуйте ще раз.');
			}
		} catch {
			setStatus('error');
			setMessage('Помилка. Спробуйте ще раз.');
		}
	};

	return (
		<div className={styles.subscribe}>
			<div className={styles.subscribe__container}>
				<h2 className={`${styles.subscribe__title} h h_l center`}>Станьте частиною нашого клубу, щоб отримати знижку</h2>
				{status === 'success'
					? <p className={`${styles.subscribe__success ?? ''} small center`}>{message}</p>
					: (
						<form onSubmit={handleSubmit} className={styles.subscribe__form} id="subscribe-form">
							<label htmlFor="email" className="visually-hidden">Електронна адреса</label>
							<input
								type="email"
								className={`${styles.subscribe__email} small`}
								name="email"
								id="email"
								placeholder="Ваша електронна адреса"
								autoComplete="email"
								required
								value={email}
								onChange={e => setEmail(e.target.value)}
							/>
							<button
								type="submit"
								className={`${styles.subscribe__button} _button _button_main _button_border upper`}
								disabled={status === 'loading'}
							>
								{status === 'loading' ? '...' : 'Підписатись'}
							</button>
							{status === 'error' && <p className="small" style={{ color: '#c0392b', marginTop: 8 }}>{message}</p>}
						</form>
					)
				}
			</div>
		</div>
	);
}
