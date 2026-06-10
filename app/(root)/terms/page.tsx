import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "School of Innovation Terms of Service and usage agreement.",
};

export default function TermsPage() {
  return (
    <div className="container max-w-3xl py-16">
      <div className="mb-10">
        <p className="text-sm text-muted-foreground mb-2">Legal</p>
        <h1 className="text-4xl font-bold mb-3">Terms of Service</h1>
        <p className="text-muted-foreground text-sm">
          Last updated: June 2025
        </p>
      </div>

      <div className="prose prose-gray dark:prose-invert max-w-none space-y-8 text-sm leading-relaxed text-muted-foreground">

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">1. Acceptance of Terms</h2>
          <p>
            By accessing or using School of Innovation (&ldquo;the Platform&rdquo;), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the Platform.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">2. Description of Service</h2>
          <p>
            School of Innovation is an online learning platform that connects students with instructors to deliver educational courses, certifications, and skill development programs across technology, creative arts, and professional development.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">3. User Accounts</h2>
          <p>
            You must create an account to access most features of the Platform. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You agree to provide accurate, current, and complete information during registration.
          </p>
          <p>
            You must be at least 13 years of age to create an account. If you are under 18, you represent that your parent or legal guardian has reviewed and agreed to these Terms.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">4. Instructors</h2>
          <p>
            Instructor accounts are subject to review and approval by our team. Approved instructors may create and publish courses on the Platform. Instructors are responsible for the accuracy, quality, and legality of content they publish.
          </p>
          <p>
            We reserve the right to remove courses or revoke instructor status for violations of these Terms or our content guidelines.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">5. Payments and Refunds</h2>
          <p>
            Paid courses are processed through Flutterwave, a third-party payment processor. By making a purchase, you agree to Flutterwave&apos;s terms of service. All prices are listed in Nigerian Naira (NGN) unless otherwise stated.
          </p>
          <p>
            Refund requests must be submitted within 7 days of purchase and are evaluated on a case-by-case basis. Courses that have been substantially completed (more than 30% of lessons) are generally not eligible for refunds.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">6. Intellectual Property</h2>
          <p>
            All content on the Platform, including course materials, videos, text, and graphics, is owned by School of Innovation or its licensors. You may not reproduce, distribute, or create derivative works without express written permission.
          </p>
          <p>
            Instructors retain ownership of their course content but grant School of Innovation a non-exclusive license to host, distribute, and display that content on the Platform.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">7. Certificates</h2>
          <p>
            Certificates of completion are issued upon successfully completing all lessons in a course. These certificates are for educational purposes and are not guaranteed to be recognized by any employer, institution, or government body.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">8. Prohibited Conduct</h2>
          <p>You agree not to:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Share your account credentials with others</li>
            <li>Reproduce or redistribute course content without permission</li>
            <li>Upload harmful, illegal, or misleading content</li>
            <li>Attempt to circumvent the Platform&apos;s security measures</li>
            <li>Use the Platform for any unlawful purpose</li>
            <li>Harass, abuse, or threaten other users or instructors</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">9. Disclaimer of Warranties</h2>
          <p>
            The Platform is provided &ldquo;as is&rdquo; without warranties of any kind, express or implied. We do not guarantee that the Platform will be uninterrupted, error-free, or free of viruses.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">10. Limitation of Liability</h2>
          <p>
            To the fullest extent permitted by applicable law, School of Innovation shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the Platform.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">11. Changes to Terms</h2>
          <p>
            We may update these Terms at any time. Continued use of the Platform after changes are posted constitutes acceptance of the revised Terms. We will notify users of significant changes via email.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">12. Contact</h2>
          <p>
            For questions about these Terms, contact us at{" "}
            <a href="mailto:support@schoolofinnovation.com.ng" className="text-blue-500 hover:underline">
              support@schoolofinnovation.com.ng
            </a>
            .
          </p>
        </section>
      </div>

      <div className="mt-12 pt-8 border-t border-gray-100 dark:border-gray-800 flex gap-4 text-sm text-muted-foreground">
        <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link>
        <Link href="/contact" className="hover:text-foreground transition-colors">Contact Us</Link>
      </div>
    </div>
  );
}
