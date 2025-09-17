export interface TeamRegistrationData {
  teamName: string;
  contactName: string;
  packageName: string;
  packagePrice: string;
  paymentAmount: number;
  registrationId: string;
  nextSteps: string[];
  dashboardUrl: string;
  supportEmail: string;
}

export interface CoachWelcomeData {
  teamName: string;
  coachName: string;
  packageName: string;
  dashboardUrl: string;
  coachingResources: string[];
}

export interface AdminNotificationData {
  teamName: string;
  packageName: string;
  contactName: string;
  contactEmail: string;
  paymentAmount: number;
  registrationId: string;
  adminDashboardUrl: string;
}

export function getTeamRegistrationConfirmationHtml(data: TeamRegistrationData): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Registration Confirmed - ${data.teamName}</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
    <h1 style="margin: 0; font-size: 28px;">🏀 Registration Confirmed!</h1>
    <p style="margin: 10px 0 0 0; font-size: 18px; opacity: 0.9;">Welcome to the Basketball League</p>
  </div>

  <div style="background: #f8fafc; padding: 30px; border-radius: 0 0 8px 8px; border: 1px solid #e2e8f0;">
    <h2 style="color: #1e40af; margin-top: 0;">Hi ${data.contactName},</h2>

    <p style="font-size: 16px; margin-bottom: 25px;">
      Great news! Your team <strong>${data.teamName}</strong> has been successfully registered for the basketball league.
    </p>

    <div style="background: white; padding: 20px; border-radius: 6px; border-left: 4px solid #10b981; margin: 25px 0;">
      <h3 style="margin-top: 0; color: #059669;">Registration Details</h3>
      <ul style="margin: 0; padding-left: 20px;">
        <li><strong>Team Name:</strong> ${data.teamName}</li>
        <li><strong>Package:</strong> ${data.packageName}</li>
        <li><strong>Amount Paid:</strong> $${data.paymentAmount.toLocaleString()}</li>
        <li><strong>Registration ID:</strong> ${data.registrationId}</li>
      </ul>
    </div>

    <h3 style="color: #1e40af;">Next Steps</h3>
    <ol style="padding-left: 20px;">
      ${data.nextSteps.map(step => `<li style="margin-bottom: 8px;">${step}</li>`).join('')}
    </ol>

    <div style="text-align: center; margin: 30px 0;">
      <a href="${data.dashboardUrl}" style="background: #1e40af; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
        Access Team Dashboard
      </a>
    </div>

    <div style="border-top: 1px solid #e2e8f0; padding-top: 20px; margin-top: 30px; font-size: 14px; color: #6b7280;">
      <p>Questions? Contact us at <a href="mailto:${data.supportEmail}" style="color: #1e40af;">${data.supportEmail}</a></p>
      <p style="margin-bottom: 0;">Looking forward to an amazing season!</p>
    </div>
  </div>
</body>
</html>
  `;
}

export function getCoachWelcomeHtml(data: CoachWelcomeData): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome Coach - ${data.teamName}</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #dc2626 0%, #ef4444 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
    <h1 style="margin: 0; font-size: 28px;">🏀 Welcome Coach!</h1>
    <p style="margin: 10px 0 0 0; font-size: 18px; opacity: 0.9;">${data.teamName}</p>
  </div>

  <div style="background: #f8fafc; padding: 30px; border-radius: 0 0 8px 8px; border: 1px solid #e2e8f0;">
    <h2 style="color: #dc2626; margin-top: 0;">Hi Coach ${data.coachName},</h2>

    <p style="font-size: 16px; margin-bottom: 25px;">
      Welcome to the basketball league! We're excited to have you coaching <strong>${data.teamName}</strong> this season.
    </p>

    <div style="background: white; padding: 20px; border-radius: 6px; border-left: 4px solid #f59e0b; margin: 25px 0;">
      <h3 style="margin-top: 0; color: #d97706;">Coaching Resources</h3>
      <ul style="margin: 0; padding-left: 20px;">
        ${data.coachingResources.map(resource => `<li style="margin-bottom: 8px;">${resource}</li>`).join('')}
      </ul>
    </div>

    <div style="text-align: center; margin: 30px 0;">
      <a href="${data.dashboardUrl}" style="background: #dc2626; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
        Access Coach Dashboard
      </a>
    </div>

    <div style="border-top: 1px solid #e2e8f0; padding-top: 20px; margin-top: 30px; font-size: 14px; color: #6b7280;">
      <p style="margin-bottom: 0;">Let's make this season unforgettable! 🏆</p>
    </div>
  </div>
</body>
</html>
  `;
}

export function getAdminNotificationHtml(data: AdminNotificationData): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Team Registration - ${data.teamName}</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #7c3aed 0%, #8b5cf6 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
    <h1 style="margin: 0; font-size: 28px;">⚡ New Registration</h1>
    <p style="margin: 10px 0 0 0; font-size: 18px; opacity: 0.9;">Admin Notification</p>
  </div>

  <div style="background: #f8fafc; padding: 30px; border-radius: 0 0 8px 8px; border: 1px solid #e2e8f0;">
    <h2 style="color: #7c3aed; margin-top: 0;">New Team Registration</h2>

    <div style="background: white; padding: 20px; border-radius: 6px; border-left: 4px solid #7c3aed; margin: 25px 0;">
      <h3 style="margin-top: 0; color: #6d28d9;">Registration Details</h3>
      <ul style="margin: 0; padding-left: 20px;">
        <li><strong>Team Name:</strong> ${data.teamName}</li>
        <li><strong>Package:</strong> ${data.packageName}</li>
        <li><strong>Contact:</strong> ${data.contactName}</li>
        <li><strong>Email:</strong> ${data.contactEmail}</li>
        <li><strong>Payment:</strong> $${data.paymentAmount.toLocaleString()}</li>
        <li><strong>Registration ID:</strong> ${data.registrationId}</li>
      </ul>
    </div>

    <div style="text-align: center; margin: 30px 0;">
      <a href="${data.adminDashboardUrl}" style="background: #7c3aed; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
        View in Admin Dashboard
      </a>
    </div>
  </div>
</body>
</html>
  `;
}

export function getTeamNotificationHtml(data: { teamName: string; packageName: string; registrationId: string }): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Registration Confirmed - ${data.teamName}</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #059669 0%, #10b981 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
    <h1 style="margin: 0; font-size: 28px;">🏀 Registration Complete</h1>
    <p style="margin: 10px 0 0 0; font-size: 18px; opacity: 0.9;">${data.teamName}</p>
  </div>

  <div style="background: #f8fafc; padding: 30px; border-radius: 0 0 8px 8px; border: 1px solid #e2e8f0;">
    <p style="font-size: 16px; margin-bottom: 25px;">
      Your team <strong>${data.teamName}</strong> has been successfully registered for the <strong>${data.packageName}</strong>.
    </p>

    <p style="font-size: 14px; color: #6b7280;">
      Registration ID: ${data.registrationId}
    </p>

    <p style="font-size: 14px; color: #6b7280; margin-bottom: 0;">
      You should receive detailed confirmation information at the primary contact email address.
    </p>
  </div>
</body>
</html>
  `;
}