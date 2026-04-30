import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      message: 'Method not allowed.'
    });
  }

  try {
    const {
      name,
      email,
      organisation,
      enquiryType,
      subject,
      message,
      consent
    } = req.body || {};

    if (!name || !email || !enquiryType || !message || !consent) {
      return res.status(400).json({
        success: false,
        message: 'Please complete all required fields.'
      });
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address.'
      });
    }

    const emailSubject = `[CSRI Contact] ${enquiryType} – ${name}`;

    const html = `
      <h2>New CSRI contact form submission</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Organisation:</strong> ${organisation || '-'}</p>
      <p><strong>Type of enquiry:</strong> ${enquiryType}</p>
      <p><strong>Subject:</strong> ${subject || '-'}</p>
      <p><strong>Message:</strong></p>
      <p>${message.replace(/\n/g, '<br>')}</p>
    `;

    const { data, error } = await resend.emails.send({
      from: 'CSRI Contact <onboarding@resend.dev>',
      to: ['delivered@resend.dev'],
      reply_to: email,
      subject: emailSubject,
      html
    });

    if (error) {
      console.error('Resend error:', error);
      return res.status(500).json({
        success: false,
        message: error.message || 'Email sending failed.'
      });
    }

    console.log('Resend success:', data);

    return res.status(200).json({
      success: true,
      message: 'Thank you. Your message has been sent successfully.'
    });
  } catch (err) {
    console.error('Handler error:', err);
    return res.status(500).json({
      success: false,
      message: 'Something went wrong. Please try again.'
    });
  }
}
