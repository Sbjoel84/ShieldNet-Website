import React from 'react'

export function PrivacyPolicy() {
  return (
    <div>
      {/* Hero */}
      <div className="bg-gradient-to-b from-green-500/10 to-transparent border-b border-border py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <div className="w-20 h-20 rounded-2xl overflow-hidden ring-2 ring-green-500/30 shadow-lg mx-auto mb-6">
            <img src="/logo-alt.svg" alt="ShieldNet" className="w-full h-full object-contain bg-white" />
          </div>
          <h1 className="text-4xl font-bold mb-3">Privacy Policy</h1>
          <p className="text-muted-foreground">Last updated: April 18, 2026</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16">

      <div className="prose prose-invert max-w-none space-y-10 text-foreground/85">

        <section>
          <p className="text-base leading-relaxed">
            ShieldNet Core Technologies Ltd ("ShieldNet", "we", "us", or "our") is committed to protecting your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform — including ShieldNet AI, ShieldFarm, and ShieldNet Properties — accessible via our website and mobile applications.
          </p>
          <p className="text-base leading-relaxed mt-3">
            By using our services, you agree to the collection and use of information in accordance with this policy. If you do not agree, please do not use our platform.
          </p>
        </section>

        <Section title="1. Information We Collect">
          <Subsection title="1.1 Information You Provide Directly">
            <ul>
              <li><strong>Account Information:</strong> Full name, email address, phone number, and password when you register.</li>
              <li><strong>Identity Verification:</strong> BVN (Bank Verification Number), NIN (National Identification Number), and government-issued ID documents for KYC compliance.</li>
              <li><strong>Property Listings:</strong> Property details, photographs, title documents, and location data submitted by agents.</li>
              <li><strong>Farm Data:</strong> Farm location, crop type, acreage, diary entries, and crop images uploaded for AI diagnosis.</li>
              <li><strong>Communications:</strong> Messages sent through our contact forms, inquiry submissions, and support requests.</li>
              <li><strong>Payment Information:</strong> We do not store card details directly. Payments are processed by our PCI-DSS compliant payment partners.</li>
            </ul>
          </Subsection>
          <Subsection title="1.2 Information Collected Automatically">
            <ul>
              <li>IP address, browser type, and operating system.</li>
              <li>Pages visited, time spent, and actions taken within the platform.</li>
              <li>Device identifiers and mobile advertising IDs.</li>
              <li>Location data (with your permission) for map-based features.</li>
              <li>Cookies and similar tracking technologies (see Section 7).</li>
            </ul>
          </Subsection>
          <Subsection title="1.3 Information from Third Parties">
            <ul>
              <li>Identity verification results from our KYC partners.</li>
              <li>Property registry data from official government sources.</li>
              <li>Satellite and geospatial data for property verification.</li>
              <li>Social login data if you sign in via Google or other providers.</li>
            </ul>
          </Subsection>
        </Section>

        <Section title="2. How We Use Your Information">
          <p>We use the information we collect to:</p>
          <ul>
            <li>Create and manage your ShieldNet account.</li>
            <li>Verify your identity and assign your Shield Score.</li>
            <li>Process property listings, farm registrations, and inquiries.</li>
            <li>Run AI-powered fraud detection and crop diagnosis models.</li>
            <li>Deliver real-time market prices and agricultural intelligence.</li>
            <li>Communicate with you about your account, transactions, and platform updates.</li>
            <li>Investigate fraud reports and enforce our Terms of Service.</li>
            <li>Comply with legal obligations under Nigerian law, including NITDA data protection regulations.</li>
            <li>Improve our platform through aggregated analytics and model training (using anonymised data only).</li>
          </ul>
        </Section>

        <Section title="3. Legal Basis for Processing">
          <p>We process your personal data on the following legal grounds:</p>
          <ul>
            <li><strong>Contract Performance:</strong> To provide the services you sign up for.</li>
            <li><strong>Legitimate Interests:</strong> To prevent fraud, improve our platform, and maintain security.</li>
            <li><strong>Legal Obligation:</strong> To comply with KYC, AML, and NDPR requirements.</li>
            <li><strong>Consent:</strong> Where you have given explicit consent, such as for marketing communications.</li>
          </ul>
        </Section>

        <Section title="4. Sharing Your Information">
          <p>We do not sell your personal data. We may share information with:</p>
          <ul>
            <li><strong>Verified Agents and Buyers:</strong> Contact information shared only when you initiate an inquiry or transaction.</li>
            <li><strong>Service Providers:</strong> Cloud hosting (Supabase), payment processors, KYC providers, and analytics tools — all bound by data processing agreements.</li>
            <li><strong>Regulatory Authorities:</strong> When required by Nigerian law, court order, or to protect ShieldNet's legal rights.</li>
            <li><strong>Business Transfers:</strong> In the event of a merger or acquisition, your data may transfer to the new entity under equivalent protections.</li>
          </ul>
        </Section>

        <Section title="5. Data Retention">
          <p>We retain your data for as long as your account is active or as needed to provide services. Specifically:</p>
          <ul>
            <li>Account data: retained for the life of your account plus 3 years after closure.</li>
            <li>Transaction records: retained for 7 years for legal and audit compliance.</li>
            <li>Fraud reports: retained indefinitely to maintain platform integrity.</li>
            <li>Crop diagnosis images: retained for 12 months, then anonymised.</li>
          </ul>
          <p className="mt-3">You may request deletion of your account and personal data at any time (see Section 8), subject to our legal retention obligations.</p>
        </Section>

        <Section title="6. Data Security">
          <p>We implement industry-standard security measures including:</p>
          <ul>
            <li>AES-256 encryption for data at rest.</li>
            <li>TLS 1.3 encryption for all data in transit.</li>
            <li>Role-based access controls limiting staff access to personal data.</li>
            <li>Regular security audits and penetration testing.</li>
            <li>Multi-factor authentication for all platform accounts.</li>
          </ul>
          <p className="mt-3">Despite these measures, no system is completely secure. In the event of a data breach affecting your rights, we will notify you within 72 hours as required by the NDPR.</p>
        </Section>

        <Section title="7. Cookies">
          <p>We use the following types of cookies:</p>
          <ul>
            <li><strong>Essential Cookies:</strong> Required for authentication and core platform functionality. These cannot be disabled.</li>
            <li><strong>Analytics Cookies:</strong> Help us understand how users interact with the platform (e.g. PostHog, Google Analytics). You may opt out via your browser settings.</li>
            <li><strong>Preference Cookies:</strong> Remember your settings such as language and city filter.</li>
          </ul>
          <p className="mt-3">You can manage cookie preferences in your browser. Disabling non-essential cookies will not affect core functionality.</p>
        </Section>

        <Section title="8. Your Rights">
          <p>Under the Nigeria Data Protection Regulation (NDPR) and NDPA 2023, you have the right to:</p>
          <ul>
            <li><strong>Access:</strong> Request a copy of the personal data we hold about you.</li>
            <li><strong>Rectification:</strong> Correct inaccurate or incomplete data.</li>
            <li><strong>Erasure:</strong> Request deletion of your data, subject to legal retention obligations.</li>
            <li><strong>Portability:</strong> Receive your data in a machine-readable format.</li>
            <li><strong>Objection:</strong> Object to processing based on legitimate interests.</li>
            <li><strong>Withdraw Consent:</strong> At any time, for processing based on consent.</li>
          </ul>
          <p className="mt-3">To exercise any of these rights, email us at <a href="mailto:privacy@shieldnet.ng" className="text-green-400 hover:underline">privacy@shieldnet.ng</a>. We will respond within 30 days.</p>
        </Section>

        <Section title="9. Children's Privacy">
          <p>Our platform is not directed at persons under the age of 18. We do not knowingly collect personal data from minors. If we become aware that a minor has provided us with personal data, we will delete it promptly.</p>
        </Section>

        <Section title="10. International Transfers">
          <p>Your data is primarily processed and stored within Nigeria. Where data is transferred internationally (e.g. to cloud infrastructure providers), we ensure adequate protections are in place through contractual safeguards consistent with NDPR requirements.</p>
        </Section>

        <Section title="11. Changes to This Policy">
          <p>We may update this Privacy Policy from time to time. We will notify you of material changes via email or a prominent notice on the platform at least 14 days before the change takes effect. Continued use of the platform after that date constitutes acceptance of the updated policy.</p>
        </Section>

        <Section title="12. Contact Us">
          <p>For privacy-related questions, requests, or complaints:</p>
          <ul>
            <li><strong>Data Protection Officer:</strong> ShieldNet Core Technologies Ltd</li>
            <li><strong>Email:</strong> <a href="mailto:privacy@shieldnet.ng" className="text-green-400 hover:underline">privacy@shieldnet.ng</a></li>
            <li><strong>Address:</strong> Abuja, Federal Capital Territory, Nigeria</li>
            <li><strong>Regulator:</strong> You may also lodge a complaint with the Nigeria Data Protection Commission (NDPC) at <a href="https://ndpc.gov.ng" className="text-green-400 hover:underline" target="_blank" rel="noopener noreferrer">ndpc.gov.ng</a></li>
          </ul>
        </Section>

      </div>
      </div>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="text-xl font-bold mb-4 text-foreground">{title}</h2>
      <div className="space-y-3 text-sm leading-relaxed text-foreground/80">{children}</div>
    </section>
  )
}

function Subsection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-4">
      <h3 className="text-base font-semibold mb-2 text-foreground">{title}</h3>
      <div className="space-y-2 text-sm leading-relaxed pl-1">{children}</div>
    </div>
  )
}
