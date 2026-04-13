import SEO from '../components/SEO';

export default function Privacy() {
  return (
    <>
      <SEO title="Privacy Policy" description="Cashmere Cottontail Farm privacy policy" />
      <div className="max-w-2xl mx-auto px-4 py-12">
        <h1 className="font-display text-3xl font-bold text-charcoal-600 mb-8">Privacy Policy</h1>
        <p className="text-xs text-charcoal-300 mb-6">Last updated: April 2026</p>

        <div className="prose prose-sm text-charcoal-500 space-y-4 font-body text-sm leading-relaxed">
          <p><strong>Cashmere Cottontail Farm, LLC</strong> ("we," "us," or "our") operates the website cashmerecottontailfarm.com and related text messaging services. This Privacy Policy describes how we collect, use, and protect your information.</p>

          <h2 className="font-display text-lg font-bold text-charcoal-600 mt-6">Information We Collect</h2>
          <p>When you interact with our website or sign up for notifications, we may collect:</p>
          <p>Your name, email address, and phone number when you voluntarily provide them through our contact form, notification sign-up, or bill of sale process. We also collect your notification preferences (what types of updates you want to receive).</p>

          <h2 className="font-display text-lg font-bold text-charcoal-600 mt-6">How We Use Your Information</h2>
          <p>We use your information to: respond to your inquiries, send you text message and/or email notifications you've opted into (such as new litter announcements, animal availability, and farm updates), process animal sales and generate bills of sale, and improve our website and services.</p>

          <h2 className="font-display text-lg font-bold text-charcoal-600 mt-6">Text Message Notifications</h2>
          <p>If you sign up for text alerts, you consent to receive recurring text messages from Cashmere Cottontail Farm at the phone number you provided. Message frequency varies. Message and data rates may apply. You can opt out at any time by replying <strong>STOP</strong> to any text message. Reply <strong>HELP</strong> for assistance. Text messages are sent via our messaging provider and your phone number is stored securely in our database.</p>

          <h2 className="font-display text-lg font-bold text-charcoal-600 mt-6">Information Sharing</h2>
          <p>We do not sell, trade, or rent your personal information to third parties. We do not share your information for marketing purposes. Your information may be shared only with service providers who help us operate our business (such as our messaging provider for text alerts and our email provider), and only to the extent necessary to provide those services.</p>

          <h2 className="font-display text-lg font-bold text-charcoal-600 mt-6">Data Security</h2>
          <p>We implement reasonable security measures to protect your personal information. However, no method of electronic storage is 100% secure, and we cannot guarantee absolute security.</p>

          <h2 className="font-display text-lg font-bold text-charcoal-600 mt-6">Your Rights</h2>
          <p>You may request to view, update, or delete your personal information at any time by contacting us. You may unsubscribe from text messages by replying STOP and from emails by clicking the unsubscribe link.</p>

          <h2 className="font-display text-lg font-bold text-charcoal-600 mt-6">Contact Us</h2>
          <p>Cashmere Cottontail Farm, LLC<br/>17799 Bethlehem Rd, Winslow, AR 72762<br/>Phone: (479) 531-0849<br/>Email: raegon@cashmerecottontailfarm.com</p>
        </div>
      </div>
    </>
  );
}
