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

    return res.status(200).json({
      success: true,
      message: 'Thank you. Your message has been sent successfully.'
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Something went wrong. Please try again.'
    });
  }
}
