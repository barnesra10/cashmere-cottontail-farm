export async function onRequest(context) {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>Get Notified - Cashmere Cottontail Farm</title>
  <meta name="description" content="Sign up for text and email alerts from Cashmere Cottontail Farm about new litters, available animals, and farm updates.">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: Georgia, 'Times New Roman', serif; background: #faf8f5; color: #2c2826; min-height: 100vh; }
    .wrap { max-width: 480px; margin: 0 auto; padding: 48px 20px; }
    .logo { text-align: center; margin-bottom: 32px; }
    .logo img { height: 60px; border-radius: 8px; }
    h1 { font-size: 28px; font-weight: 700; text-align: center; margin-bottom: 8px; }
    .subtitle { font-size: 14px; color: #807a72; text-align: center; margin-bottom: 32px; line-height: 1.5; }
    .form-group { margin-bottom: 16px; }
    label { display: block; font-size: 12px; font-weight: 700; color: #6b6259; margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.5px; }
    input[type="text"], input[type="tel"], input[type="email"] {
      width: 100%; padding: 14px 16px; font-size: 16px; border: 1px solid #e4ddd2;
      border-radius: 12px; background: #fff; font-family: Georgia, serif; color: #2c2826;
    }
    input:focus { outline: none; border-color: #6b6259; box-shadow: 0 0 0 3px rgba(107,98,89,0.15); }
    .interests { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 16px; }
    .interest-btn { padding: 8px 14px; font-size: 13px; border: 1px solid #e4ddd2; border-radius: 20px;
      background: #f5f3ee; cursor: pointer; font-family: Georgia, serif; color: #6b6259; transition: all 0.2s; }
    .interest-btn.active { background: #6b6259; color: #fff; border-color: #6b6259; }
    .consent { display: flex; align-items: flex-start; gap: 12px; margin: 20px 0; }
    .consent input[type="checkbox"] { width: 20px; height: 20px; margin-top: 2px; flex-shrink: 0; accent-color: #6b6259; }
    .consent-text { font-size: 12px; color: #807a72; line-height: 1.6; }
    .consent-text a { color: #6b6259; }
    .consent-text strong { color: #2c2826; }
    .submit-btn { width: 100%; padding: 16px; font-size: 15px; font-weight: 700; color: #fff;
      background: #6b6259; border: none; border-radius: 24px; cursor: pointer; font-family: Georgia, serif;
      transition: background 0.2s; }
    .submit-btn:hover { background: #4a4440; }
    .submit-btn:disabled { opacity: 0.4; cursor: not-allowed; }
    .disclosure { font-size: 11px; color: #a09888; text-align: center; margin-top: 24px; line-height: 1.5; }
    .disclosure a { color: #6b6259; }
    .footer { text-align: center; font-size: 11px; color: #a09888; margin-top: 32px; padding-top: 20px; border-top: 1px solid #e4ddd2; }
    .success { text-align: center; padding: 60px 20px; }
    .success-icon { width: 64px; height: 64px; background: #6b6259; border-radius: 50%; display: flex;
      align-items: center; justify-content: center; margin: 0 auto 20px; font-size: 28px; color: #fff; }
    .success h2 { font-size: 24px; margin-bottom: 12px; }
    .success p { font-size: 14px; color: #807a72; line-height: 1.5; }
    .hidden { display: none; }
  </style>
</head>
<body>
  <div class="wrap">
    <div class="logo">
      <img src="/logo.jpeg" alt="Cashmere Cottontail Farm">
    </div>

    <!-- Sign-up Form -->
    <div id="form-section">
      <h1>Get Notified</h1>
      <p class="subtitle">Be the first to know about new litters, available animals, and farm updates from Cashmere Cottontail Farm.</p>

      <form id="signup-form" onsubmit="return handleSubmit(event)">
        <div class="form-group">
          <label for="name">Your Name (optional)</label>
          <input type="text" id="name" name="name" placeholder="Jane Smith">
        </div>

        <div class="form-group">
          <label for="phone">Phone Number (for text alerts)</label>
          <input type="tel" id="phone" name="phone" placeholder="(479) 555-1234">
        </div>

        <div class="form-group">
          <label for="email">Email Address</label>
          <input type="email" id="email" name="email" placeholder="jane@example.com">
        </div>

        <div class="form-group">
          <label>I'm interested in:</label>
          <div class="interests">
            <button type="button" class="interest-btn" onclick="toggleInterest(this)" data-id="litters">&#x1F423; New Litters</button>
            <button type="button" class="interest-btn" onclick="toggleInterest(this)" data-id="available">&#x1F3F7; Available Animals</button>
            <button type="button" class="interest-btn" onclick="toggleInterest(this)" data-id="social">&#x1F4F8; Farm Updates</button>
          </div>
        </div>

        <div class="consent">
          <input type="checkbox" id="consent" name="consent" required>
          <span class="consent-text">
            I agree to receive recurring automated text messages and/or emails from Cashmere Cottontail Farm
            about animal availability, new litters, and farm updates at the phone number and/or email provided above.
            Message frequency varies (approximately 2-4 messages per month). Message and data rates may apply.
            Reply <strong>STOP</strong> to unsubscribe from texts at any time.
            Reply <strong>HELP</strong> for help.
            View our <a href="/privacy">Privacy Policy</a> and <a href="/terms">Terms &amp; Conditions</a>.
            Consent is not a condition of purchase.
          </span>
        </div>

        <button type="submit" class="submit-btn" id="submit-btn" disabled>Sign Up for Notifications</button>
      </form>

      <div class="disclosure">
        <p>Cashmere Cottontail Farm, LLC &middot; 17799 Bethlehem Rd, Winslow, AR 72762</p>
        <p>(479) 531-0849 &middot; <a href="mailto:raegon@cashmerecottontailfarm.com">raegon@cashmerecottontailfarm.com</a></p>
        <p style="margin-top:8px">Text <strong>STOP</strong> to cancel. Text <strong>HELP</strong> for help.</p>
        <p><a href="/privacy">Privacy Policy</a> &middot; <a href="/terms">Terms &amp; Conditions</a></p>
      </div>

      <div class="footer">
        <p>&copy; 2026 Cashmere Cottontail Farm, LLC &middot; Winslow, Arkansas</p>
      </div>
    </div>

    <!-- Success Message -->
    <div id="success-section" class="hidden">
      <div class="success">
        <div class="success-icon">&#x2713;</div>
        <h2>You're In!</h2>
        <p>We'll notify you about new animals, litters, and farm updates. You can unsubscribe anytime by replying <strong>STOP</strong> to any text message or clicking unsubscribe in any email.</p>
      </div>
      <div class="footer">
        <p>&copy; 2026 Cashmere Cottontail Farm, LLC &middot; Winslow, Arkansas</p>
      </div>
    </div>
  </div>

  <script>
    function toggleInterest(btn) {
      btn.classList.toggle('active');
    }

    document.getElementById('consent').addEventListener('change', function() {
      var phone = document.getElementById('phone').value.trim();
      var email = document.getElementById('email').value.trim();
      document.getElementById('submit-btn').disabled = !(this.checked && (phone || email));
    });

    ['phone', 'email'].forEach(function(id) {
      document.getElementById(id).addEventListener('input', function() {
        var phone = document.getElementById('phone').value.trim();
        var email = document.getElementById('email').value.trim();
        var consent = document.getElementById('consent').checked;
        document.getElementById('submit-btn').disabled = !(consent && (phone || email));
      });
    });

    function handleSubmit(e) {
      e.preventDefault();
      var name = document.getElementById('name').value.trim();
      var phone = document.getElementById('phone').value.trim();
      var email = document.getElementById('email').value.trim();
      var interests = [];
      document.querySelectorAll('.interest-btn.active').forEach(function(btn) {
        interests.push(btn.getAttribute('data-id'));
      });

      fetch('https://szzofkefbrqvsfkwojdj.supabase.co/rest/v1/subscribers', {
        method: 'POST',
        headers: {
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN6em9ma2VmYnJxdnNma3dvamRqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ3MTUwNjMsImV4cCI6MjA5MDI5MTA2M30.euvg_NuoNi_tgioOJFB2nvV7Cbe1J5_-veE8Z3Qw0JY',
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN6em9ma2VmYnJxdnNma3dvamRqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ3MTUwNjMsImV4cCI6MjA5MDI5MTA2M30.euvg_NuoNi_tgioOJFB2nvV7Cbe1J5_-veE8Z3Qw0JY',
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify({
          name: name || null,
          phone: phone || null,
          email: email || null,
          notify_sms: !!phone,
          notify_email: !!email,
          notify_new_litters: interests.indexOf('litters') >= 0,
          notify_available: interests.indexOf('available') >= 0,
          notify_social: interests.indexOf('social') >= 0
        })
      }).then(function() {
        document.getElementById('form-section').classList.add('hidden');
        document.getElementById('success-section').classList.remove('hidden');
      }).catch(function() {
        document.getElementById('form-section').classList.add('hidden');
        document.getElementById('success-section').classList.remove('hidden');
      });

      return false;
    }
  </script>
</body>
</html>`;

  return new Response(html, {
    headers: {
      'Content-Type': 'text/html;charset=UTF-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
