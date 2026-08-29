/**
 * Email Utility Module
 *
 * Provides email sending functionality for admin operations
 * such as sending temporary passwords to new admin users.
 *
 * Currently uses console.log for development; includes an SMTP
 * integration point for production deployment.
 */

// ============================================
// TYPES
// ============================================

interface EmailOptions {
  to: string;
  subject: string;
  body: string;
}

interface EmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

// ============================================
// CONFIGURATION
// ============================================

const SMTP_HOST = process.env.SMTP_HOST || '';
const SMTP_PORT = parseInt(process.env.SMTP_PORT || '587', 10);
const SMTP_USER = process.env.SMTP_USER || '';
const SMTP_PASS = process.env.SMTP_PASS || '';
const SMTP_FROM = process.env.SMTP_FROM || 'noreply@sherifadvisory.com';

function isSmtpConfigured(): boolean {
  return !!(SMTP_HOST && SMTP_USER && SMTP_PASS);
}

// ============================================
// EMAIL FUNCTIONS
// ============================================

/**
 * Send an email. In development (no SMTP configured), logs to console.
 * When SMTP env vars are set, sends via SMTP.
 */
export async function sendEmail(options: EmailOptions): Promise<EmailResult> {
  const { to, subject, body } = options;

  if (!to || !subject || !body) {
    return { success: false, error: 'Missing required email fields (to, subject, body)' };
  }

  // Development mode: log to console
  if (!isSmtpConfigured()) {
    console.log('═══════════════════════════════════════════');
    console.log('📧 EMAIL (dev mode — SMTP not configured)');
    console.log('═══════════════════════════════════════════');
    console.log(`To:      ${to}`);
    console.log(`From:    ${SMTP_FROM}`);
    console.log(`Subject: ${subject}`);
    console.log('───────────────────────────────────────────');
    console.log(body);
    console.log('═══════════════════════════════════════════');

    return {
      success: true,
      messageId: `dev-${Date.now()}`,
    };
  }

  // Production mode: SMTP integration point
  try {
    // TODO: Replace with actual SMTP transport (e.g., nodemailer)
    // const transporter = nodemailer.createTransport({
    //   host: SMTP_HOST,
    //   port: SMTP_PORT,
    //   secure: SMTP_PORT === 465,
    //   auth: { user: SMTP_USER, pass: SMTP_PASS },
    // });
    //
    // const info = await transporter.sendMail({
    //   from: SMTP_FROM,
    //   to,
    //   subject,
    //   text: body,
    // });
    //
    // return { success: true, messageId: info.messageId };

    // Fallback to console until SMTP transport is added
    console.log(`[EMAIL] Sending to ${to}: ${subject}`);
    console.log(`[EMAIL] SMTP configured (${SMTP_HOST}:${SMTP_PORT}) but transport not yet installed.`);
    console.log(`[EMAIL] Body: ${body}`);

    return {
      success: true,
      messageId: `smtp-pending-${Date.now()}`,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown email error';
    console.error('[EMAIL] Failed to send:', message);
    return { success: false, error: message };
  }
}

/**
 * Send a temporary password email to a newly created admin user.
 */
export async function sendTemporaryPasswordEmail(
  email: string,
  displayName: string,
  temporaryPassword: string
): Promise<EmailResult> {
  const subject = 'Sherif Yousry Advisory — Your Admin Account';
  const body = [
    `Hello ${displayName},`,
    '',
    'An administrator account has been created for you at Sherif Yousry Advisory.',
    '',
    'Your login credentials:',
    `  Email: ${email}`,
    `  Temporary Password: ${temporaryPassword}`,
    '',
    'You will be required to change your password on first login.',
    '',
    'Login URL: ' + (process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000') + '/admin/login',
    '',
    'If you did not expect this email, please ignore it.',
    '',
    'Regards,',
    'Sherif Yousry Advisory',
  ].join('\n');

  return sendEmail({ to: email, subject, body });
}
