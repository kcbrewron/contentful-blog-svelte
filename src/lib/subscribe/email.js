import { createMimeMessage } from 'mimetext';
import { SITE_NAME, FROM_ADDRESS, BASE_URL } from '$lib/config.js';
import { TOPIC_EMAIL_LABELS } from '$lib/subscribe/topics.js';

/**
 * @typedef {Object} SubscribeEnv
 * @property {{ send: (msg: unknown) => Promise<void> }} SEND_EMAIL
 * @property {string} ADMIN_EMAIL
 */

/**
 * Builds a raw MIME email string and sends it via the Cloudflare send_email binding.
 *
 * @param {SubscribeEnv} env
 * @param {string} to
 * @param {string} subject
 * @param {string} html
 * @returns {Promise<void>}
 */
async function sendEmail(env, to, subject, html) {
	const msg = createMimeMessage();
	msg.setSender({ name: SITE_NAME, addr: FROM_ADDRESS });
	msg.setRecipient(to);
	msg.setSubject(subject);
	msg.addMessage({ contentType: 'text/html', data: html });

	const raw = msg.asRaw();
	const encoded = new TextEncoder().encode(raw);
	const stream = new ReadableStream({
		start(controller) {
			controller.enqueue(encoded);
			controller.close();
		}
	});

	// EmailMessage is a global in the Cloudflare Workers runtime
	// @ts-ignore
	const emailMessage = new EmailMessage(FROM_ADDRESS, to, stream);
	await env.SEND_EMAIL.send(emailMessage);
}

/**
 * Sends a double opt-in confirmation email with a verify link.
 *
 * @param {SubscribeEnv} env
 * @param {{ email: string, confirmationToken: string }} params
 * @returns {Promise<void>}
 */
export async function sendConfirmationEmail(env, { email, confirmationToken }) {
	const verifyUrl = `${BASE_URL}/subscribe/confirm?token=${confirmationToken}`;

	const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#0A0A0F;font-family:Inter,ui-sans-serif,system-ui,sans-serif;color:#A1A1AA;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;margin:40px auto;">
    <tr><td style="padding:40px 32px;">
      <p style="margin:0 0 8px;font-size:22px;font-weight:700;color:#FFFFFF;">Confirm your subscription</p>
      <p style="margin:0 0 32px;font-size:15px;line-height:1.6;color:#71717A;">
        Thanks for signing up for ${SITE_NAME}. Click the button below to confirm your email address and complete your subscription.
      </p>
      <a href="${verifyUrl}"
         style="display:inline-block;padding:14px 28px;background:#6366F1;color:#FFFFFF;text-decoration:none;border-radius:8px;font-size:15px;font-weight:600;">
        Confirm subscription
      </a>
      <p style="margin:32px 0 0;font-size:13px;color:#3A3A5E;line-height:1.6;">
        If you didn't request this, you can safely ignore this email. This link expires in 48 hours.<br><br>
        Or paste this URL into your browser:<br>
        <a href="${verifyUrl}" style="color:#6366F1;word-break:break-all;">${verifyUrl}</a>
      </p>
    </td></tr>
  </table>
</body>
</html>`;

	await sendEmail(env, email, `Confirm your subscription to ${SITE_NAME}`, html);
}

/**
 * Sends a welcome email after the subscriber confirms their email address.
 *
 * @param {SubscribeEnv} env
 * @param {{ email: string, unsubscribeToken: string, topics: string[] }} params
 * @returns {Promise<void>}
 */
export async function sendWelcomeEmail(env, { email, unsubscribeToken, topics }) {
	const unsubscribeUrl = `${BASE_URL}/unsubscribe?token=${unsubscribeToken}`;

	const topicList = topics
		.map((slug) => TOPIC_EMAIL_LABELS[slug] ?? slug)
		.map((label) => `<li style="margin:0 0 8px;color:#A1A1AA;">${label}</li>`)
		.join('');

	const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#0A0A0F;font-family:Inter,ui-sans-serif,system-ui,sans-serif;color:#A1A1AA;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;margin:40px auto;">
    <tr><td style="padding:40px 32px;">
      <p style="margin:0 0 8px;font-size:22px;font-weight:700;color:#FFFFFF;">You're in. Welcome.</p>
      <p style="margin:0 0 24px;font-size:15px;line-height:1.6;color:#71717A;">
        Thanks for confirming. You're now subscribed to ${SITE_NAME} — practical insights on cloud architecture, leadership, and life from Ron Nelson.
      </p>
      <p style="margin:0 0 12px;font-size:14px;font-weight:600;color:#FFFFFF;">You'll receive posts in:</p>
      <ul style="margin:0 0 32px;padding-left:20px;">${topicList}</ul>
      <a href="${BASE_URL}"
         style="display:inline-block;padding:14px 28px;background:#6366F1;color:#FFFFFF;text-decoration:none;border-radius:8px;font-size:15px;font-weight:600;">
        Read the latest posts
      </a>
      <p style="margin:40px 0 0;font-size:12px;color:#3A3A5E;line-height:1.6;border-top:1px solid #1A1A2E;padding-top:24px;">
        You're receiving this because you subscribed at ${SITE_NAME}.<br>
        <a href="${unsubscribeUrl}" style="color:#6366F1;">Unsubscribe</a>
      </p>
    </td></tr>
  </table>
</body>
</html>`;

	await sendEmail(env, email, `You're in — welcome to ${SITE_NAME}`, html);
}

/**
 * Sends an admin notification when a subscriber confirms their email.
 *
 * @param {SubscribeEnv} env
 * @param {{ email: string, topics: string[] }} params
 * @returns {Promise<void>}
 */
export async function sendAdminNotification(env, { email, topics }) {
	const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family:monospace;padding:24px;color:#333;">
  <p><strong>New subscriber:</strong> ${email}</p>
  <p><strong>Topics:</strong> ${topics.join(', ')}</p>
  <p><strong>Time:</strong> ${new Date().toISOString()}</p>
</body>
</html>`;

	await sendEmail(env, env.ADMIN_EMAIL, `New subscriber: ${email}`, html);
}
