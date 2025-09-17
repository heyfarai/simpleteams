import { ServerClient } from "postmark";

const POSTMARK_API_TOKEN = process.env.POSTMARK_API_TOKEN;
const FROM_EMAIL = process.env.POSTMARK_FROM_EMAIL || "noreply@yourleague.com";
const FROM_NAME = "Basketball League Registration";

if (!POSTMARK_API_TOKEN) {
  throw new Error("Missing Postmark API token");
}

const client = new ServerClient(POSTMARK_API_TOKEN);

export interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
  messageStream?: string;
}

export async function sendEmail({
  to,
  subject,
  html,
  text,
  messageStream = "outbound",
}: SendEmailOptions) {
  try {
    // In development, send all emails to farai@icloud.com
    const actualTo = process.env.NODE_ENV === 'development' ? 'farai@icloud.com' : to;

    // Add dev prefix to subject in development
    const actualSubject = process.env.NODE_ENV === 'development'
      ? `[DEV - Originally to: ${to}] ${subject}`
      : subject;

    const result = await client.sendEmail({
      From: `${FROM_NAME} <${FROM_EMAIL}>`,
      To: actualTo,
      Subject: actualSubject,
      HtmlBody: html,
      TextBody: text,
      MessageStream: messageStream,
    });

    console.log(`Email sent successfully to ${actualTo} (originally ${to}):`, result.MessageID);
    return result;
  } catch (error) {
    console.error(`Failed to send email to ${to}:`, error);
    throw error;
  }
}

export async function sendBulkEmails(emails: SendEmailOptions[]) {
  try {
    const emailBatch = emails.map(({ to, subject, html, text, messageStream = "outbound" }) => ({
      From: `${FROM_NAME} <${FROM_EMAIL}>`,
      To: to,
      Subject: subject,
      HtmlBody: html,
      TextBody: text,
      MessageStream: messageStream,
    }));

    const results = await client.sendEmailBatch(emailBatch);
    console.log(`Batch email sent successfully:`, results.length, 'emails');
    return results;
  } catch (error) {
    console.error('Failed to send bulk emails:', error);
    throw error;
  }
}