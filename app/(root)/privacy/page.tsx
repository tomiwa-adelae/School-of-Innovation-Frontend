import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "School of Innovation Privacy Policy — how we collect and use your data.",
};

export default function PrivacyPage() {
  return (
    <div className="container max-w-3xl py-16">
      <div className="mb-10">
        <p className="text-sm text-muted-foreground mb-2">Legal</p>
        <h1 className="text-4xl font-bold mb-3">Privacy Policy</h1>
        <p className="text-muted-foreground text-sm">
          Last updated: June 2025
        </p>
      </div>

      <div className="prose prose-gray dark:prose-invert max-w-none space-y-8 text-sm leading-relaxed text-muted-foreground">

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">1. Information We Collect</h2>
          <p>We collect the following types of information when you use School of Innovation:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong className="text-foreground">Account information:</strong> name, email address, password (hashed), profile picture, and bio</li>
            <li><strong className="text-foreground">Profile data:</strong> phone number, location, date of birth, and interests you choose to provide</li>
            <li><strong className="text-foreground">Learning data:</strong> enrolled courses, lesson progress, quiz results, and certificates earned</li>
            <li><strong className="text-foreground">Payment data:</strong> transaction IDs processed by Flutterwave (we do not store card numbers or bank account details)</li>
            <li><strong className="text-foreground">Usage data:</strong> pages visited, features used, and browser/device information</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">2. How We Use Your Information</h2>
          <p>We use your information to:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Create and manage your account</li>
            <li>Deliver courses and track your learning progress</li>
            <li>Process payments and issue refunds</li>
            <li>Generate and issue certificates of completion</li>
            <li>Send transactional emails (enrollment confirmation, certificate issuance, account notifications)</li>
            <li>Improve our Platform through analytics</li>
            <li>Respond to support requests</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">3. Information Sharing</h2>
          <p>
            We do not sell, trade, or rent your personal information to third parties. We may share information with:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong className="text-foreground">Payment processors (Flutterwave):</strong> to complete transactions</li>
            <li><strong className="text-foreground">Cloud providers (AWS S3):</strong> to store uploaded files securely</li>
            <li><strong className="text-foreground">Email services (Mailjet):</strong> to send transactional emails</li>
            <li><strong className="text-foreground">Instructors:</strong> your name may be visible on certificates and reviews you submit</li>
          </ul>
          <p>
            We may disclose information if required by law or to protect the rights, property, or safety of our users.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">4. Cookies and Tracking</h2>
          <p>
            We use HTTP-only cookies to maintain your login session securely. These cookies are not accessible to JavaScript and cannot be read by third-party scripts. We do not use advertising tracking cookies.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">5. Data Security</h2>
          <p>
            We implement industry-standard security practices including password hashing (bcrypt), HTTPS encryption, HTTP-only authentication cookies, and access-controlled cloud storage. However, no system is 100% secure and we cannot guarantee absolute security.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">6. Data Retention</h2>
          <p>
            We retain your account data as long as your account is active. If you request account deletion, we will remove your personal information within 30 days, except where retention is required by law (e.g., payment records).
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">7. Your Rights</h2>
          <p>You have the right to:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Access the personal data we hold about you</li>
            <li>Request correction of inaccurate data</li>
            <li>Request deletion of your account and personal data</li>
            <li>Opt out of non-essential emails</li>
          </ul>
          <p>
            To exercise these rights, contact us at{" "}
            <a href="mailto:support@schoolofinnovation.com.ng" className="text-blue-500 hover:underline">
              support@schoolofinnovation.com.ng
            </a>
            .
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">8. Children&apos;s Privacy</h2>
          <p>
            Our Platform is not directed at children under 13. We do not knowingly collect personal information from children under 13. If you believe a child has provided us with personal information, please contact us immediately.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">9. Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy periodically. We will notify you of significant changes via email or a prominent notice on the Platform. Continued use after changes constitutes acceptance of the updated policy.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">10. Contact Us</h2>
          <p>
            For privacy-related questions or requests, contact our team at{" "}
            <a href="mailto:support@schoolofinnovation.com.ng" className="text-blue-500 hover:underline">
              support@schoolofinnovation.com.ng
            </a>
            .
          </p>
        </section>
      </div>

      <div className="mt-12 pt-8 border-t border-gray-100 dark:border-gray-800 flex gap-4 text-sm text-muted-foreground">
        <Link href="/terms" className="hover:text-foreground transition-colors">Terms of Service</Link>
        <Link href="/contact" className="hover:text-foreground transition-colors">Contact Us</Link>
      </div>
    </div>
  );
}
