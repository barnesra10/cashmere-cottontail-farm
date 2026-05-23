export async function onRequest(context) {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Privacy Policy - Cashmere Cottontail Farm</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: Georgia, serif; background: #faf8f5; color: #2c2826; }
    .wrap { max-width: 640px; margin: 0 auto; padding: 48px 20px; }
    h1 { font-size: 28px; margin-bottom: 8px; }
    .updated { font-size: 12px; color: #a09888; margin-bottom: 32px; }
    h2 { font-size: 18px; margin: 24px 0 8px; color: #2c2826; }
    p { font-size: 14px; line-height: 1.7; color: #4a4440; margin-bottom: 12px; }
    strong { color: #2c2826; }
    a { color: #6b6259; }
    .footer { text-align: center; font-size: 11px; color: #a09888; margin-top: 40px; padding-top: 20px; border-top: 1px solid #e4ddd2; }
  </style>
</head>
<body>
  <div class="wrap">
    <h1>Privacy Policy</h1>
    <p class="updated">Last updated: April 2026</p>
    <p><strong>Cashmere Cottontail Farm, LLC</strong> ("we," "us," or "our") operates the website cashmerecottontailfarm.com and related text messaging services. This Privacy Policy describes how we collect, use, and protect your information.</p>
    <h2>Information We Collect</h2>
    <p>When you interact with our website or sign up for notifications, we may collect your name, email address, and phone number when you voluntarily provide them through our contact form, notification sign-up, or bill of sale process. We also collect your notification preferences.</p>
    <h2>How We Use Your Information</h2>
    <p>We use your information to respond to your inquiries, send you text message and/or email notifications you have opted into (such as new litter announcements, animal availability, and farm updates), process animal sales and generate bills of sale, and improve our website and services.</p>
    <h2>Text Message Notifications</h2>
    <p>If you sign up for text alerts, you consent to receive recurring text messages from Cashmere Cottontail Farm at the phone number you provided. Message frequency varies (approximately 2-4 messages per month). Message and data rates may apply. You can opt out at any time by replying <strong>STOP</strong> to any text message. Reply <strong>HELP</strong> for assistance. Your phone number is stored securely in our database and is never sold or shared.</p>
    <h2>Information Sharing</h2>
    <p>We do not sell, trade, or rent your personal information to third parties. We do not share your information for marketing purposes. Your information may be shared only with service providers who help us operate our business (such as our messaging provider for text alerts), and only to the extent necessary.</p>
    <h2>Data Security</h2>
    <p>We implement reasonable security measures to protect your personal information. However, no method of electronic storage is 100% secure.</p>
    <h2>Your Rights</h2>
    <p>You may request to view, update, or delete your personal information at any time by contacting us. You may unsubscribe from text messages by replying STOP and from emails by clicking the unsubscribe link.</p>
    <h2>Contact Us</h2>
    <p>Cashmere Cottontail Farm, LLC<br>17799 Bethlehem Rd, Winslow, AR 72762<br>Phone: (479) 531-0849<br>Email: raegon@cashmerecottontailfarm.com</p>
    <div class="footer"><p>&copy; 2026 Cashmere Cottontail Farm, LLC</p></div>
  </div>
</body>
</html>`;
  return new Response(html, { headers: { 'Content-Type': 'text/html;charset=UTF-8' } });
}
