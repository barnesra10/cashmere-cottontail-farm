export async function onRequest(context) {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Terms and Conditions - Cashmere Cottontail Farm</title>
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
    <h1>Terms &amp; Conditions</h1>
    <p class="updated">Last updated: April 2026</p>
    <p>These Terms and Conditions govern your use of cashmerecottontailfarm.com and related services operated by <strong>Cashmere Cottontail Farm, LLC</strong>.</p>
    <h2>Text Message Program</h2>
    <p><strong>Program Name:</strong> Cashmere Cottontail Farm Notifications</p>
    <p><strong>Description:</strong> By signing up for text notifications on our website, you agree to receive recurring automated text messages from Cashmere Cottontail Farm about animal availability, new litters, breeding updates, and farm news.</p>
    <p><strong>Message Frequency:</strong> Message frequency varies based on farm activity, approximately 2-4 messages per month.</p>
    <p><strong>Message and Data Rates:</strong> Message and data rates may apply depending on your mobile carrier plan.</p>
    <p><strong>Opt-Out:</strong> You can cancel the SMS service at any time. Text <strong>STOP</strong> to the number from which you received messages. After you send the STOP message, you will receive a confirmation that you have been unsubscribed. You will no longer receive text messages from this program.</p>
    <p><strong>Help:</strong> If you are experiencing issues, reply <strong>HELP</strong> for more assistance, or contact us directly at (479) 531-0849 or raegon@cashmerecottontailfarm.com.</p>
    <p><strong>Consent:</strong> Consent to receive text messages is not a condition of purchase. You may purchase animals from Cashmere Cottontail Farm without signing up for text notifications.</p>
    <p><strong>Carriers:</strong> Carriers are not liable for delayed or undelivered messages.</p>
    <h2>Website Use</h2>
    <p>The content on this website is for informational purposes. Animal descriptions, pricing, and availability are subject to change without notice.</p>
    <h2>Animal Sales</h2>
    <p>All animal sales are governed by our Bill of Sale, which includes terms regarding transfer of ownership, AS-IS sale conditions, health representations, assumption of risk, no-refund policy, and prohibition of resale for slaughter.</p>
    <h2>Limitation of Liability</h2>
    <p>Cashmere Cottontail Farm, LLC is not responsible for any damages arising from use of this website or our text messaging service.</p>
    <h2>Governing Law</h2>
    <p>These terms are governed by the laws of the State of Arkansas.</p>
    <h2>Contact</h2>
    <p>Cashmere Cottontail Farm, LLC<br>17799 Bethlehem Rd, Winslow, AR 72762<br>Phone: (479) 531-0849<br>Email: raegon@cashmerecottontailfarm.com</p>
    <div class="footer"><p>&copy; 2026 Cashmere Cottontail Farm, LLC</p></div>
  </div>
</body>
</html>`;
  return new Response(html, { headers: { 'Content-Type': 'text/html;charset=UTF-8' } });
}
