import { sendWelcomeEmail, sendAdminNotification } from '$lib/subscribe/email.js';

/**
 * Handles email confirmation from the double opt-in link.
 * Marks the subscriber as confirmed and triggers welcome + admin emails.
 *
 * @param {{ url: URL, platform?: { env?: any } }} event
 * @returns {Promise<{ status: 'success' | 'invalid' | 'unavailable', email?: string }>}
 */
export async function load({ url, platform }) {
	const token = url.searchParams.get('token') ?? '';
	const env = platform?.env;

	if (!token) {
		return { status: 'invalid' };
	}

	if (!env?.SUBSCRIBERS_DB) {
		// Local dev without D1 — just show success so the UI is testable
		return { status: 'unavailable' };
	}

	try {
		const subscriber = await env.SUBSCRIBERS_DB.prepare(
			'SELECT id, email, status, unsubscribe_token, topics FROM subscribers WHERE confirmation_token = ?'
		)
			.bind(token)
			.first();

		if (!subscriber || subscriber.status === 'confirmed') {
			return { status: 'invalid' };
		}

		// Mark confirmed and clear the one-time token
		await env.SUBSCRIBERS_DB.prepare(
			"UPDATE subscribers SET status = 'confirmed', confirmed_at = datetime('now'), confirmation_token = NULL WHERE id = ?"
		)
			.bind(subscriber.id)
			.run();

		const topics = JSON.parse(subscriber.topics ?? '[]');

		// Fire both emails in parallel — don't let either failure break the confirmation page
		const emailResults = await Promise.allSettled([
			sendWelcomeEmail(env, {
				email: subscriber.email,
				unsubscribeToken: subscriber.unsubscribe_token,
				topics
			}),
			sendAdminNotification(env, { email: subscriber.email, topics })
		]);
		for (const result of emailResults) {
			if (result.status === 'rejected') {
				console.error('Post-confirm email failed:', result.reason);
			}
		}

		return { status: 'success', email: subscriber.email };
	} catch (error) {
		console.error('Confirm subscription error:', error);
		return { status: 'invalid' };
	}
}
