"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <motion.div
          className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm p-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>

          <div className="prose max-w-none">
            <p className="text-muted-foreground mb-6">Last updated: April 2, 2025</p>

            <h2 className="text-xl font-bold mt-8 mb-4">1. Introduction</h2>
            <p className="mb-4">
              Welcome to Second Home ("we," "our," or "us"). These Terms of Service ("Terms") govern your access to and
              use of the Second Home website, mobile application, and services (collectively, the "Services").
            </p>
            <p className="mb-4">
              By accessing or using our Services, you agree to be bound by these Terms. If you do not agree to these
              Terms, you may not access or use the Services.
            </p>

            <h2 className="text-xl font-bold mt-8 mb-4">2. Eligibility</h2>
            <p className="mb-4">
              You must be at least 18 years old to use our Services. By using our Services, you represent and warrant
              that you are at least 18 years old and have the legal capacity to enter into these Terms.
            </p>

            <h2 className="text-xl font-bold mt-8 mb-4">3. Account Registration</h2>
            <p className="mb-4">
              To access certain features of our Services, you may need to register for an account. You agree to provide
              accurate, current, and complete information during the registration process and to update such information
              to keep it accurate, current, and complete.
            </p>
            <p className="mb-4">
              You are responsible for safeguarding your account credentials and for all activities that occur under your
              account. You agree to notify us immediately of any unauthorized use of your account.
            </p>

            <h2 className="text-xl font-bold mt-8 mb-4">4. User Content</h2>
            <p className="mb-4">
              Our Services may allow you to post, upload, or submit content, including but not limited to text, photos,
              videos, reviews, and ratings ("User Content"). You retain ownership of your User Content, but you grant us
              a non-exclusive, royalty-free, worldwide, perpetual, irrevocable license to use, reproduce, modify, adapt,
              publish, translate, create derivative works from, distribute, and display such User Content in connection
              with our Services.
            </p>
            <p className="mb-4">
              You represent and warrant that your User Content does not violate any third-party rights, including
              intellectual property rights and privacy rights, and complies with all applicable laws and regulations.
            </p>

            <h2 className="text-xl font-bold mt-8 mb-4">5. Prohibited Conduct</h2>
            <p className="mb-4">You agree not to:</p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>
                Use our Services for any illegal purpose or in violation of any local, state, national, or international
                law
              </li>
              <li>
                Violate or encourage others to violate the rights of third parties, including intellectual property
                rights
              </li>
              <li>
                Post, upload, or distribute any content that is unlawful, defamatory, libelous, inaccurate, or that a
                reasonable person could deem to be objectionable, profane, indecent, pornographic, harassing,
                threatening, hateful, or otherwise inappropriate
              </li>
              <li>Interfere with security-related features of our Services</li>
              <li>Interfere with the proper working of our Services</li>
              <li>Engage in unauthorized spidering, scraping, or harvesting of content from our Services</li>
              <li>Impersonate another person or misrepresent your affiliation with a person or entity</li>
              <li>
                Engage in any conduct that restricts or inhibits any other user from using or enjoying our Services
              </li>
            </ul>

            <h2 className="text-xl font-bold mt-8 mb-4">6. Property Listings</h2>
            <p className="mb-4">
              Property owners who list their properties on our platform are solely responsible for the accuracy and
              completeness of their listings. We do not verify the accuracy of listings and are not responsible for any
              inaccuracies or misrepresentations in listings.
            </p>
            <p className="mb-4">
              We reserve the right to remove any listing from our platform at any time for any reason without notice.
            </p>

            <h2 className="text-xl font-bold mt-8 mb-4">7. Bookings and Payments</h2>
            <p className="mb-4">
              When you book a property through our Services, you enter into a contract directly with the property owner.
              We are not a party to this contract and are not responsible for the property owner's actions or omissions.
            </p>
            <p className="mb-4">
              Payment processing services for property owners on Second Home are provided by third-party payment
              processors. By using our Services, you agree to be bound by the terms and conditions of these payment
              processors.
            </p>

            <h2 className="text-xl font-bold mt-8 mb-4">8. Termination</h2>
            <p className="mb-4">
              We may terminate or suspend your access to our Services at any time, without prior notice or liability,
              for any reason whatsoever, including without limitation if you breach these Terms.
            </p>
            <p className="mb-4">
              Upon termination, your right to use the Services will immediately cease. If you wish to terminate your
              account, you may simply discontinue using the Services.
            </p>

            <h2 className="text-xl font-bold mt-8 mb-4">9. Disclaimer of Warranties</h2>
            <p className="mb-4">
              Our Services are provided on an "as is" and "as available" basis. We make no warranties, expressed or
              implied, regarding the operation of our Services or the information, content, or materials included on our
              Services.
            </p>
            <p className="mb-4">
              We do not warrant that our Services will be uninterrupted or error-free, that defects will be corrected,
              or that our Services or the servers that make them available are free of viruses or other harmful
              components.
            </p>

            <h2 className="text-xl font-bold mt-8 mb-4">10. Limitation of Liability</h2>
            <p className="mb-4">
              To the fullest extent permitted by applicable law, in no event will we be liable for any indirect,
              incidental, special, consequential, or punitive damages, including without limitation, loss of profits,
              data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to
              access or use the Services.
            </p>

            <h2 className="text-xl font-bold mt-8 mb-4">11. Changes to Terms</h2>
            <p className="mb-4">
              We reserve the right to modify these Terms at any time. If we make changes to these Terms, we will provide
              notice of such changes, such as by sending an email notification, providing notice through our Services,
              or updating the "Last Updated" date at the beginning of these Terms.
            </p>
            <p className="mb-4">
              Your continued use of our Services following the posting of revised Terms means that you accept and agree
              to the changes.
            </p>

            <h2 className="text-xl font-bold mt-8 mb-4">12. Contact Us</h2>
            <p className="mb-4">If you have any questions about these Terms, please contact us at:</p>
            <p className="mb-4">
              Email: legal@secondhome.com
              <br />
              Address: 123 Startup Hub, Koramangala, Bangalore, India - 560034
            </p>
          </div>

          <div className="mt-10 flex justify-center">
            <Button asChild>
              <Link href="/">Return to Home</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
