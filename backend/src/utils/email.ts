/**
 * Consolidated Email Service
 * Uses Resend HTTPS API (Port 443) to prevent Render SMTP timeouts.
 */

const sendEmailViaResend = async (to: string, subject: string, html: string) => {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    console.warn('[EMAIL SERVICE] RESEND_API_KEY environment variable is not set. Email dispatch skipped.');
    return;
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        from: process.env.EMAIL_FROM || 'FindYourPlace <onboarding@resend.dev>',
        to: [to],
        subject,
        html,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('[EMAIL SERVICE] Resend API Error:', errorData);
    } else {
      console.log(`[EMAIL SERVICE] Email successfully delivered to ${to}`);
    }
  } catch (error) {
    console.error('[EMAIL SERVICE] Failed to send email via Resend:', error);
  }
};

// Helper function to safely format Date objects or strings
const formatDate = (dateVal: any): string => {
  if (!dateVal) return '';
  if (dateVal instanceof Date) {
    return dateVal.toISOString().split('T')[0];
  }
  return String(dateVal);
};

// 1. Enquiry Confirmation Export
export const sendEnquiryConfirmation = async (
  to: string,
  name: string,
  message: string
): Promise<void> => {
  const subject = 'We Received Your Enquiry - FindYourPlace';
  const html = `
    <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; max-width: 600px;">
      <h2 style="color: #2fa4a5;">Thank you for contacting us, ${name}!</h2>
      <p>We have received your enquiry and will get back to you shortly.</p>
      <div style="background: #f8fafc; padding: 15px; border-left: 4px solid #2fa4a5; margin: 15px 0;">
        <p style="margin: 0; font-style: italic;">"${message}"</p>
      </div>
      <p style="color: #64748b; font-size: 12px;">FindYourPlace Support Team</p>
    </div>
  `;

  await sendEmailViaResend(to, subject, html);
};

// 2. Booking Confirmation Export (Flexible signatures to accept Prisma Date objects)
export const sendBookingConfirmation = async (
  to: string,
  detailsOrName?: any,
  hotelName?: any,
  checkIn?: any,
  checkOut?: any,
  totalPrice?: any
): Promise<void> => {
  let name = 'Valued Guest';
  let hotel = 'Your Property';
  let dates = '';
  let price = '';

  if (typeof detailsOrName === 'object' && detailsOrName !== null) {
    name = detailsOrName.name || detailsOrName.guestName || name;
    hotel = detailsOrName.hotelName || detailsOrName.hotel || hotel;
    const start = formatDate(detailsOrName.checkIn);
    const end = formatDate(detailsOrName.checkOut);
    if (start && end) {
      dates = `${start} to ${end}`;
    }
    if (detailsOrName.totalPrice || detailsOrName.price) {
      price = `$${detailsOrName.totalPrice || detailsOrName.price}`;
    }
  } else {
    if (typeof detailsOrName === 'string') name = detailsOrName;
    if (hotelName) hotel = String(hotelName);

    const start = formatDate(checkIn);
    const end = formatDate(checkOut);
    if (start && end) {
      dates = `${start} to ${end}`;
    }
    if (totalPrice !== undefined && totalPrice !== null) {
      price = `$${totalPrice}`;
    }
  }

  const subject = `Booking Confirmed - ${hotel}`;
  const html = `
    <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; max-width: 600px;">
      <h2 style="color: #2fa4a5;">Reservation Confirmed!</h2>
      <p>Hi <strong>${name}</strong>,</p>
      <p>Your reservation for <strong>${hotel}</strong> is confirmed.</p>
      <div style="background: #f8fafc; padding: 15px; border-radius: 8px; margin: 15px 0;">
        ${dates ? `<p style="margin: 4px 0;"><strong>Dates:</strong> ${dates}</p>` : ''}
        ${price ? `<p style="margin: 4px 0;"><strong>Total Paid:</strong> ${price}</p>` : ''}
      </div>
      <p>Thank you for booking with FindYourPlace!</p>
    </div>
  `;

  await sendEmailViaResend(to, subject, html);
};

export default {
  sendEnquiryConfirmation,
  sendBookingConfirmation,
};