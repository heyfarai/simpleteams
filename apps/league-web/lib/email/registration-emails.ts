import Stripe from "stripe";
import { sendEmail } from "./postmark";
import { getPackageInfo, getInstallmentDetails, type PackageType } from "@/lib/config/packages";
import {
  getTeamRegistrationConfirmationHtml,
  getCoachWelcomeHtml,
  getAdminNotificationHtml,
  getTeamNotificationHtml,
  type TeamRegistrationData,
  type CoachWelcomeData,
  type AdminNotificationData,
} from "./templates";

export async function sendConfirmationEmails(
  team: any,
  session: Stripe.Checkout.Session,
  selectedSessions?: any[]
) {
  try {
    const packageDetails = getPackageInfo(
      session.metadata?.selectedPackage || ""
    );

    const emailData = buildEmailData(team, session, packageDetails, selectedSessions);

    console.log("Sending confirmation emails for team:", team.name);

    // Send emails in parallel for better performance
    const emailPromises = [];

    // 1. Primary contact confirmation
    emailPromises.push(
      sendPrimaryContactEmail(emailData.primaryContact)
    );

    // 2. Team contact notification (if different)
    if (emailData.teamContact) {
      emailPromises.push(
        sendTeamContactEmail(emailData.teamContact)
      );
    }

    // 3. Head coach welcome (if provided)
    if (emailData.headCoach) {
      emailPromises.push(
        sendCoachEmail(emailData.headCoach)
      );
    }

    // 4. Admin notification
    emailPromises.push(
      sendAdminEmail(emailData.adminNotification)
    );

    // Wait for all emails to complete
    await Promise.all(emailPromises);

    console.log(
      `All confirmation emails sent successfully for team: ${team.name}`
    );
  } catch (error) {
    console.error("Error sending confirmation emails:", error);
    // Don't throw - email failures shouldn't break registration completion
  }
}

function buildEmailData(
  team: any,
  session: Stripe.Checkout.Session,
  packageDetails: any,
  selectedSessions?: any[]
) {
  const dashboardUrl = `${process.env.NEXT_PUBLIC_URL}/dashboard`;
  const paymentAmount = (session.amount_total || 0) / 100;

  // Determine payment type and get installment details
  const paymentType = session.mode === 'subscription' ? 'installment' : 'full';
  const installmentDetails = paymentType === 'installment'
    ? getInstallmentDetails(session.metadata?.selectedPackage as PackageType)
    : undefined;

  // Get next payment date from subscription if available
  let nextPaymentDate: string | undefined;
  if (session.subscription && typeof session.subscription === 'object') {
    const subscription = session.subscription as Stripe.Subscription;
    nextPaymentDate = new Date(subscription.current_period_end * 1000).toLocaleDateString();
  }

  return {
    primaryContact: {
      to: team.primary_contact_email,
      subject: `Registration Confirmed - ${team.name}`,
      data: {
        teamName: team.name,
        contactName: team.primary_contact_name,
        packageName: packageDetails.name,
        packagePrice: packageDetails.price,
        paymentAmount,
        registrationId: team.id,
        nextSteps: [
          "Access your team dashboard",
          "Complete roster submission",
          "Review league schedule",
          "Download league handbook",
        ],
        dashboardUrl,
        supportEmail: process.env.SUPPORT_EMAIL || "support@yourleague.com",
        selectedSessions: selectedSessions || undefined,
        paymentType,
        installmentDetails: installmentDetails ? {
          ...installmentDetails,
          nextPaymentDate,
        } : undefined,
      } as TeamRegistrationData,
    },

    teamContact:
      team.contact_email !== team.primary_contact_email
        ? {
            to: team.contact_email,
            subject: `Registration Confirmed - ${team.name}`,
            data: {
              teamName: team.name,
              packageName: packageDetails.name,
              registrationId: team.id,
            },
          }
        : null,

    headCoach: team.head_coach_email
      ? {
          to: team.head_coach_email,
          subject: `Welcome Coach - ${team.name}`,
          data: {
            teamName: team.name,
            coachName: team.head_coach_name,
            packageName: packageDetails.name,
            dashboardUrl,
            coachingResources: [
              "League coaching guidelines",
              "Player development resources",
              "Game strategy materials",
            ],
          } as CoachWelcomeData,
        }
      : null,

    adminNotification: {
      to: process.env.ADMIN_EMAIL || "admin@yourleague.com",
      subject: `New Team Registration - ${team.name}`,
      data: {
        teamName: team.name,
        packageName: packageDetails.name,
        contactName: team.primary_contact_name,
        contactEmail: team.primary_contact_email,
        paymentAmount,
        registrationId: team.id,
        adminDashboardUrl: dashboardUrl,
      } as AdminNotificationData,
    },
  };
}

async function sendPrimaryContactEmail(emailConfig: any) {
  const html = getTeamRegistrationConfirmationHtml(emailConfig.data);
  await sendEmail({
    to: emailConfig.to,
    subject: emailConfig.subject,
    html,
  });
}

async function sendTeamContactEmail(emailConfig: any) {
  const html = getTeamNotificationHtml(emailConfig.data);
  await sendEmail({
    to: emailConfig.to,
    subject: emailConfig.subject,
    html,
  });
}

async function sendCoachEmail(emailConfig: any) {
  const html = getCoachWelcomeHtml(emailConfig.data);
  await sendEmail({
    to: emailConfig.to,
    subject: emailConfig.subject,
    html,
  });
}

async function sendAdminEmail(emailConfig: any) {
  const html = getAdminNotificationHtml(emailConfig.data);
  await sendEmail({
    to: emailConfig.to,
    subject: emailConfig.subject,
    html,
  });
}