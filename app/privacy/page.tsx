"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <motion.div
          className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm p-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>

          <div className="prose max-w-none">
            <p className="text-muted-foreground mb-6">Last updated: April 2, 2025</p>

            <p className="mb-4">
              This Privacy Policy describes how Second Home ("we," "our," or "us") collects, uses, and shares your
              personal information when you use our website, mobile application, and services (collectively, the
              "Services").
            </p>

            <h2 className="text-xl font-bold mt-8 mb-4">1. Information We Collect</h2>

            <h3 className="text-lg font-semibold mt-6 mb-3">1.1 Information You Provide to Us</h3>
            <p className="mb-4">We collect information you provide directly to us when you:</p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>Create an account or profile</li>
              <li>Fill out forms on our Services</li>
              <li>List a property</li>
              <li>Make a booking</li>
              <li>Submit reviews or ratings</li>
              <li>Communicate with us or other users through our Services</li>
              <li>Subscribe to our newsletters or marketing communications</li>
            </ul>
            <p className="mb-4">
              This information may include your name, email address, phone number, postal address, payment information,
              photos, and any other information you choose to provide.
            </p>

            <h3 className="text-lg font-semibold mt-6 mb-3">1.2 Information We Collect Automatically</h3>
            <p className="mb-4">
              When you access or use our Services, we automatically collect certain information, including:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>
                Log Information: We collect log information about your use of our Services, including the type of
                browser you use, access times, pages viewed, your IP address, and the page you visited before navigating
                to our Services.
              </li>
              <li>
                Device Information: We collect information about the device you use to access our Services, including
                the hardware model, operating system and version, unique device identifiers, and mobile network
                information.
              </li>
              <li>
                Location Information: We may collect information about your location when you access or use our
                Services, such as your IP address or mobile device's GPS signal.
              </li>
              <li>
                Cookies and Similar Technologies: We use cookies and similar technologies to collect information about
                your interactions with our Services and other websites.
              </li>
            </ul>

            <h2 className="text-xl font-bold mt-8 mb-4">2. How We Use Your Information</h2>
            <p className="mb-4">We use the information we collect to:</p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>Provide, maintain, and improve our Services</li>
              <li>Process transactions and send related information, including confirmations and receipts</li>
              <li>Send you technical notices, updates, security alerts, and support and administrative messages</li>
              <li>Respond to your comments, questions, and requests</li>
              <li>
                Communicate with you about products, services, offers, promotions, and events, and provide news and
                information we think will be of interest to you
              </li>
              <li>Monitor and analyze trends, usage, and activities in connection with our Services</li>
              <li>
                Detect, investigate, and prevent fraudulent transactions and other illegal activities and protect the
                rights and property of Second Home and others
              </li>
              <li>
                Personalize and improve the Services and provide content or features that match user profiles or
                interests
              </li>
            </ul>

            <h2 className="text-xl font-bold mt-8 mb-4">3. Sharing of Information</h2>
            <p className="mb-4">We may share your information as follows:</p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>With property owners when you make a booking</li>
              <li>With other users when you post reviews or ratings</li>
              <li>
                With vendors, consultants, and other service providers who need access to such information to carry out
                work on our behalf
              </li>
              <li>
                In response to a request for information if we believe disclosure is in accordance with, or required by,
                any applicable law, regulation, or legal process
              </li>
              <li>
                If we believe your actions are inconsistent with our user agreements or policies, or to protect the
                rights, property, and safety of Second Home or others
              </li>
              <li>
                In connection with, or during negotiations of, any merger, sale of company assets, financing, or
                acquisition of all or a portion of our business by another company
              </li>
              <li>
                Between and among Second Home and our current and future parents, affiliates, subsidiaries, and other
                companies under common control and ownership
              </li>
              <li>With your consent or at your direction</li>
            </ul>

            <h2 className="text-xl font-bold mt-8 mb-4">4. Data Retention</h2>
            <p className="mb-4">
              We store the information we collect about you for as long as is necessary for the purpose(s) for which we
              originally collected it. We may retain certain information for legitimate business purposes or as required
              by law.
            </p>

            <h2 className="text-xl font-bold mt-8 mb-4">5. Your Rights and Choices</h2>
            <p className="mb-4">You have several rights regarding your personal information:</p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>
                Account Information: You may update, correct, or delete your account information at any time by logging
                into your account or contacting us.
              </li>
              <li>
                Marketing Communications: You may opt out of receiving promotional emails from us by following the
                instructions in those emails. If you opt out, we may still send you non-promotional emails, such as
                those about your account or our ongoing business relations.
              </li>
              <li>
                Cookies: Most web browsers are set to accept cookies by default. If you prefer, you can usually choose
                to set your browser to remove or reject browser cookies.
              </li>
              <li>
                Access, Correction, Deletion: Depending on your location, you may have the right to access personal
                information we hold about you and to ask that your personal information be corrected, updated, or
                deleted.
              </li>
            </ul>

            <h2 className="text-xl font-bold mt-8 mb-4">6. Data Security</h2>
            <p className="mb-4">
              We take reasonable measures to help protect information about you from loss, theft, misuse, and
              unauthorized access, disclosure, alteration, and destruction.
            </p>

            <h2 className="text-xl font-bold mt-8 mb-4">7. Children's Privacy</h2>
            <p className="mb-4">
              Our Services are not directed to children under 18 years of age, and we do not knowingly collect personal
              information from children under 18. If we learn that we have collected personal information of a child
              under 18, we will take steps to delete such information from our files as soon as possible.
            </p>

            <h2 className="text-xl font-bold mt-8 mb-4">8. Changes to this Privacy Policy</h2>
            <p className="mb-4">
              We may change this Privacy Policy from time to time. If we make changes, we will notify you by revising
              the date at the top of the policy and, in some cases, we may provide you with additional notice (such as
              adding a statement to our website or sending you a notification).
            </p>

            <h2 className="text-xl font-bold mt-8 mb-4">9. Contact Us</h2>
            <p className="mb-4">If you have any questions about this Privacy Policy, please contact us at:</p>
            <p className="mb-4">
              Email: second.home2k25@gmail.com
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
