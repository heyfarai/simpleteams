import { ServerClient } from "postmark";
import * as nodemailer from "nodemailer";
// TODO: Extract to shared library
const POSTMARK_API_TOKEN = process.env.POSTMARK_API_TOKEN;
const FROM_EMAIL =
  process.env.EMAIL_FROM ||
  process.env.POSTMARK_FROM_EMAIL ||
  "noreply@yourleague.com";
const FROM_NAME = "Basketball League Registration";

const isDevelopment = process.env.NODE_ENV === "development";

// Postmark client for production
let postmarkClient: ServerClient | null = null;
if (POSTMARK_API_TOKEN) {
  postmarkClient = new ServerClient(POSTMARK_API_TOKEN);
} else if (!isDevelopment) {
  throw new Error("Missing Postmark API token in production");
}

// Mailpit SMTP client for development
const mailpitTransporter = nodemailer.createTransport({
  host: process.env.MAILPIT_SMTP_HOST || "localhost",
  port: parseInt(process.env.MAILPIT_SMTP_PORT || "1025"),
  secure: false,
  tls: {
    rejectUnauthorized: false,
  },
});

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
    if (isDevelopment) {
      // Use Mailpit in development - no email redirection
      const info = await mailpitTransporter.sendMail({
        from: `${FROM_NAME} <${FROM_EMAIL}>`,
        to,
        subject,
        html,
        text,
      });

      console.log(`[Mailpit] Email sent to ${to}: ${info.messageId}`);
      console.log(`View at: http://localhost:8025`);
      return { MessageID: info.messageId };
    } else {
      // Use Postmark in production
      if (!postmarkClient) {
        throw new Error("Postmark client not initialized");
      }

      const result = await postmarkClient.sendEmail({
        From: `${FROM_NAME} <${FROM_EMAIL}>`,
        To: to,
        Subject: subject,
        HtmlBody: html,
        TextBody: text,
        MessageStream: messageStream,
      });

      console.log(`Email sent successfully to ${to}:`, result.MessageID);
      return result;
    }
  } catch (error) {
    console.error(`Failed to send email to ${to}:`, error);
    throw error;
  }
}

export async function sendBulkEmails(emails: SendEmailOptions[]) {
  try {
    if (isDevelopment) {
      // Send emails individually through Mailpit
      const results = await Promise.all(
        emails.map((email) => sendEmail(email))
      );
      console.log(
        `[Mailpit] Batch email sent successfully:`,
        results.length,
        "emails"
      );
      return results;
    } else {
      // Use Postmark batch API in production
      if (!postmarkClient) {
        throw new Error("Postmark client not initialized");
      }

      const emailBatch = emails.map(
        ({ to, subject, html, text, messageStream = "outbound" }) => ({
          From: `${FROM_NAME} <${FROM_EMAIL}>`,
          To: to,
          Subject: subject,
          HtmlBody: html,
          TextBody: text,
          MessageStream: messageStream,
        })
      );

      const results = await postmarkClient.sendEmailBatch(emailBatch);
      console.log(`Batch email sent successfully:`, results.length, "emails");
      return results;
    }
  } catch (error) {
    console.error("Failed to send bulk emails:", error);
    throw error;
  }
}
