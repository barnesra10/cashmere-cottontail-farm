import SEO from '../components/SEO';

export default function Terms() {
  return (
    <>
      <SEO title="Terms & Conditions" description="Cashmere Cottontail Farm terms and conditions" />
      <div className="max-w-2xl mx-auto px-4 py-12">
        <h1 className="font-display text-3xl font-bold text-charcoal-600 mb-8">Terms & Conditions</h1>
        <p className="text-xs text-charcoal-300 mb-6">Last updated: April 2026</p>

        <div className="prose prose-sm text-charcoal-500 space-y-4 font-body text-sm leading-relaxed">
          <p>These Terms and Conditions govern your use of cashmerecottontailfarm.com and related services operated by <strong>Cashmere Cottontail Farm, LLC</strong>.</p>

          <h2 className="font-display text-lg font-bold text-charcoal-600 mt-6">Text Message Program</h2>
          <p><strong>Program Name:</strong> Cashmere Cottontail Farm Notifications</p>
          <p><strong>Description:</strong> By signing up for text notifications on our website, you agree to receive recurring automated text messages from Cashmere Cottontail Farm about animal availability, new litters, breeding updates, and farm news.</p>
          <p><strong>Message Frequency:</strong> Message frequency varies based on farm activity, typically 1-10 messages per month.</p>
          <p><strong>Message and Data Rates:</strong> Message and data rates may apply depending on your mobile carrier plan.</p>
          <p><strong>Opt-Out:</strong> You can cancel the SMS service at any time. Simply text <strong>STOP</strong> to the number from which you received messages. After you send the STOP message, you will receive a confirmation that you have been unsubscribed.</p>
          <p><strong>Help:</strong> If you are experiencing issues with the messaging program, reply <strong>HELP</strong> for more assistance, or contact us directly at (479) 531-0849 or raegon@cashmerecottontailfarm.com.</p>
          <p><strong>Carriers:</strong> Carriers are not liable for delayed or undelivered messages.</p>

          <h2 className="font-display text-lg font-bold text-charcoal-600 mt-6">Website Use</h2>
          <p>The content on this website is for informational purposes. Animal descriptions, pricing, and availability are subject to change without notice. Photos represent individual animals and may not reflect current appearance.</p>

          <h2 className="font-display text-lg font-bold text-charcoal-600 mt-6">Animal Sales</h2>
          <p>All animal sales are governed by our Bill of Sale, which includes specific terms regarding transfer of ownership, AS-IS sale conditions, health representations, assumption of risk, no-refund policy, and prohibition of resale for slaughter. Full terms are provided at the time of purchase.</p>

          <h2 className="font-display text-lg font-bold text-charcoal-600 mt-6">Limitation of Liability</h2>
          <p>Cashmere Cottontail Farm, LLC is not responsible for any damages arising from use of this website or our text messaging service.</p>

          <h2 className="font-display text-lg font-bold text-charcoal-600 mt-6">Governing Law</h2>
          <p>These terms are governed by the laws of the State of Arkansas.</p>

          <h2 className="font-display text-lg font-bold text-charcoal-600 mt-6">Contact</h2>
          <p>Cashmere Cottontail Farm, LLC<br/>17799 Bethlehem Rd, Winslow, AR 72762<br/>Phone: (479) 531-0849<br/>Email: raegon@cashmerecottontailfarm.com</p>
        </div>
      </div>
    </>
  );
}
