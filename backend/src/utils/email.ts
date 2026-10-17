import nodemailer from 'nodemailer';

const port = parseInt(process.env.SMTP_PORT || '465');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: port,
  secure: port === 465,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  family: 4, // Forces IPv4 connection to bypass Render IPv6 timeouts
  connectionTimeout: 10000,
} as any);

// 1. Automatic reply for submission of user enquiries
export const sendEnquiryConfirmation = async (to: string, name: string, message: string) => {
  const mailOptions = {
    from: process.env.EMAIL_FROM || 'no-reply@reservationapp.com',
    to,
    subject: 'We Received Your Enquiry',
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
        <h2>Thank you for contacting us, ${name}!</h2>
        <p>We have received your message:</p>
        <blockquote style="background: #f9f9f9; padding: 10px; border-left: 4px solid #2fa4a5;">
          ${message}
        </blockquote>
        <p>Our team will get back to you shortly.</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

// 2. Confirmation email for successful property reservations
export const sendBookingConfirmation = async (
  to: string,
  userName: string,
  hotelName: string,
  checkIn: Date,
  checkOut: Date,
  totalPrice: number
) => {
  const mailOptions = {
    from: process.env.EMAIL_FROM || 'no-reply@reservationapp.com',
    to,
    subject: `Booking Confirmed - ${hotelName}`,
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
        <h2>Booking Confirmation</h2>
        <p>Dear ${userName},</p>
        <p>Your reservation at <strong>${hotelName}</strong> has been successfully confirmed!</p>
        
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
          <tr style="background: #f8f9fa;">
            <td style="padding: 10px; border: 1px solid #ddd;"><strong>Property:</strong></td>
            <td style="padding: 10px; border: 1px solid #ddd;">${hotelName}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border: 1px solid #ddd;"><strong>Check-In Date:</strong></td>
            <td style="padding: 10px; border: 1px solid #ddd;">${new Date(checkIn).toDateString()}</td>
          </tr>
          <tr style="background: #f8f9fa;">
            <td style="padding: 10px; border: 1px solid #ddd;"><strong>Check-Out Date:</strong></td>
            <td style="padding: 10px; border: 1px solid #ddd;">${new Date(checkOut).toDateString()}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border: 1px solid #ddd;"><strong>Total Amount:</strong></td>
            <td style="padding: 10px; border: 1px solid #ddd;"><strong>$${totalPrice.toFixed(2)}</strong></td>
          </tr>
        </table>
        
        <p>We look forward to hosting you!</p>
        <br />
        <p>Best regards,<br /><strong>Hotel Reservations Team</strong></p>
      </div>
    `,
  };

  return transporter.sendMail(mailOptions);
};