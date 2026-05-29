export async function onRequest(context) {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>Get Notified - Cashmere Cottontail Farm</title>
  <meta name="description" content="Sign up for text alerts from Cashmere Cottontail Farm. Text CASHMERE to get updates about new litters, available animals, and farm news.">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: Georgia, 'Times New Roman', serif; background: #faf8f5; color: #2c2826; min-height: 100vh; }
    .wrap { max-width: 480px; margin: 0 auto; padding: 40px 20px; }
    .logo { text-align: center; margin-bottom: 24px; }
    .logo img { height: 56px; border-radius: 8px; }
    h1 { font-size: 28px; font-weight: 700; text-align: center; margin-bottom: 8px; }
    .subtitle { font-size: 14px; color: #807a72; text-align: center; margin-bottom: 32px; line-height: 1.5; }

    /* Text-to-Join CTA */
    .cta-box { background: #2c2826; color: #fff; border-radius: 16px; padding: 28px 24px; text-align: center; margin-bottom: 24px; }
    .cta-label { font-size: 13px; text-transform: uppercase; letter-spacing: 2px; color: #c8c1b4; margin-bottom: 12px; }
    .cta-keyword { font-size: 36px; font-weight: 700; letter-spacing: 4px; margin-bottom: 4px; }
    .cta-number { font-size: 20px; color: #c8c1b4; margin-bottom: 16px; }
    .cta-btn { display: inline-block; background: #6b6259; color: #fff; text-decoration: none;
      padding: 14px 32px; border-radius: 24px; font-size: 15px; font-weight: 700; font-family: Georgia, serif;
      transition: background 0.2s; }
    .cta-btn:hover { background: #4a4440; }

    .divider { display: flex; align-items: center; gap: 12px; margin: 28px 0; }
    .divider-line { flex: 1; height: 1px; background: #e4ddd2; }
    .divider-text { font-size: 12px; color: #a09888; }

    /* What you get */
    .benefits { margin-bottom: 28px; }
    .benefits h2 { font-size: 16px; font-weight: 700; margin-bottom: 12px; }
    .benefit { display: flex; align-items: flex-start; gap: 12px; margin-bottom: 12px; }
    .benefit-icon { font-size: 20px; flex-shrink: 0; margin-top: 2px; }
    .benefit-text { font-size: 14px; color: #4a4440; line-height: 1.4; }
    .benefit-text strong { color: #2c2826; }

    /* Compliance */
    .compliance { background: #f0ece5; border-radius: 12px; padding: 16px; margin-bottom: 24px; }
    .compliance p { font-size: 11px; color: #807a72; line-height: 1.6; margin-bottom: 4px; }
    .compliance strong { color: #2c2826; }
    .compliance a { color: #6b6259; }

    /* QR placeholder */
    .qr-section { text-align: center; margin: 24px 0; }
    .qr-section p { font-size: 12px; color: #a09888; margin-top: 8px; }

    .footer { text-align: center; font-size: 11px; color: #a09888; margin-top: 32px; padding-top: 20px; border-top: 1px solid #e4ddd2; line-height: 1.6; }
    .footer a { color: #6b6259; }
  </style>
</head>
<body>
  <div class="wrap">
    <div class="logo">
      <img src="/logo.jpeg" alt="Cashmere Cottontail Farm">
    </div>

    <h1>Get Notified</h1>
    <p class="subtitle">Be the first to know about new litters, available animals, and farm updates.</p>

    <!-- Text-to-Join CTA -->
    <div class="cta-box">
      <div class="cta-label">Text the word</div>
      <div class="cta-keyword">CASHMERE</div>
      <div class="cta-number">to (833) 350-8275</div>
      <a href="sms:+18333508275&body=CASHMERE" class="cta-btn">Tap to Text CASHMERE Now</a>
    </div>

    <div class="divider">
      <div class="divider-line"></div>
      <span class="divider-text">what you'll get</span>
      <div class="divider-line"></div>
    </div>

    <!-- Benefits -->
    <div class="benefits">
      <div class="benefit">
        <span class="benefit-icon">&#x1F423;</span>
        <div class="benefit-text"><strong>New Litter Alerts</strong> - Know the moment babies are born</div>
      </div>
      <div class="benefit">
        <span class="benefit-icon">&#x1F3F7;</span>
        <div class="benefit-text"><strong>Availability Updates</strong> - First dibs on new animals for sale</div>
      </div>
      <div class="benefit">
        <span class="benefit-icon">&#x1F4F8;</span>
        <div class="benefit-text"><strong>Farm News</strong> - Behind-the-scenes updates and events</div>
      </div>
    </div>

    <!-- Compliance -->
    <div class="compliance">
      <p>By texting <strong>CASHMERE</strong> to the number above, you consent to receive recurring automated marketing text messages from Cashmere Cottontail Farm at the number used to opt in. Approximately 2-4 messages per month. Message and data rates may apply. Consent is not a condition of purchase.</p>
      <p>Text <strong>STOP</strong> to unsubscribe at any time. Text <strong>HELP</strong> for help.</p>
      <p><a href="/privacy">Privacy Policy</a> &middot; <a href="/terms">Terms &amp; Conditions</a></p>
    </div>

    <div class="footer">
      <p>Cashmere Cottontail Farm, LLC</p>
      <p>17799 Bethlehem Rd, Winslow, AR 72762</p>
      <p>(479) 531-0849 &middot; <a href="mailto:raegon@cashmerecottontailfarm.com">raegon@cashmerecottontailfarm.com</a></p>
      <p><a href="/">Back to cashmerecottontailfarm.com</a></p>
    </div>
  </div>
</body>
</html>`;

  return new Response(html, {
    headers: {
      'Content-Type': 'text/html;charset=UTF-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
