import { PageNavDropdown } from "./components/PageNavDropdown";
import { Scale, Shield, FileText, Lock, AlertCircle, Mail } from "lucide-react";

export default function Legal() {
  // Define page sections for jump-to navigation
  const pageSections = [
    { label: "Terms of Use", id: "terms-of-use" },
    { label: "Privacy Policy", id: "privacy-policy" },
    { label: "Cookie Policy", id: "cookie-policy" },
    { label: "Copyright Notice", id: "copyright-notice" },
    { label: "User Conduct", id: "user-conduct" },
    { label: "Disclaimer", id: "disclaimer" },
    { label: "Contact Information", id: "contact" },
  ];

  return (
    <main className="max-w-7xl mx-auto px-4 py-12 flex-1">
      {/* Page Navigation Dropdown */}
      <div className="mb-6 flex justify-end lg:mb-0 lg:absolute lg:top-0 lg:right-0 lg:z-10">
        <PageNavDropdown items={pageSections} />
      </div>

      {/* Page Header */}
      <div className="mb-12 text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="bg-blue-100 p-3 rounded-lg">
            <Scale className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="mb-0">Legal Information</h1>
        </div>
        <p className="text-gray-600 max-w-3xl mx-auto">
          Please read these terms carefully before using the LOREWEAVER Publications website. 
          By accessing or using our site, you agree to be bound by these terms and policies.
        </p>
        <p className="text-sm text-gray-500 mt-2">
          Last Updated: November 16, 2025
        </p>
      </div>

      <div className="space-y-12">
        {/* Terms of Use Section */}
        <section id="terms-of-use" className="bg-white rounded-lg shadow-md p-8 border border-gray-200">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-blue-100 p-2 rounded-lg">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <h2 className="mb-0">Terms of Use</h2>
          </div>

          <div className="space-y-6 text-gray-700">
            <div>
              <h3 className="mb-3">1. Acceptance of Terms</h3>
              <p>
                Welcome to LOREWEAVER Publications ("we," "us," or "our"). By accessing or using our website 
                (the "Site"), you agree to comply with and be bound by these Terms of Use. If you do not agree 
                to these terms, please do not use our Site.
              </p>
            </div>

            <div>
              <h3 className="mb-3">2. Use of the Site</h3>
              <p className="mb-2">
                You may use our Site for lawful purposes only. You agree not to:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Violate any applicable laws or regulations</li>
                <li>Infringe upon the intellectual property rights of others</li>
                <li>Transmit any harmful, offensive, or illegal content</li>
                <li>Attempt to gain unauthorized access to any portion of the Site</li>
                <li>Interfere with or disrupt the Site's operation or servers</li>
                <li>Use automated systems (bots, scrapers) without our express permission</li>
              </ul>
            </div>

            <div>
              <h3 className="mb-3">3. User Accounts</h3>
              <p>
                If you create an account on our Site, you are responsible for maintaining the confidentiality 
                of your account credentials and for all activities that occur under your account. You agree to 
                notify us immediately of any unauthorized use of your account.
              </p>
            </div>

            <div>
              <h3 className="mb-3">4. Intellectual Property</h3>
              <p>
                All content on this Site, including but not limited to text, graphics, logos, images, audio clips, 
                digital downloads, and software, is the property of LOREWEAVER Publications or its content suppliers 
                and is protected by international copyright, trademark, and other intellectual property laws.
              </p>
            </div>

            <div>
              <h3 className="mb-3">5. User-Generated Content</h3>
              <p className="mb-2">
                If you submit content to our Site (including comments, fan fiction, or other materials), you grant 
                LOREWEAVER Publications a non-exclusive, royalty-free, perpetual, and worldwide license to use, 
                reproduce, modify, and distribute such content. You represent and warrant that:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>You own or have the necessary rights to the content you submit</li>
                <li>Your content does not infringe upon any third-party rights</li>
                <li>Your content complies with these Terms of Use</li>
              </ul>
            </div>

            <div>
              <h3 className="mb-3">6. Links to Third-Party Sites</h3>
              <p>
                Our Site may contain links to third-party websites. We are not responsible for the content, 
                accuracy, or practices of these external sites. Your use of third-party websites is at your 
                own risk and subject to their respective terms and conditions.
              </p>
            </div>

            <div>
              <h3 className="mb-3">7. Limitation of Liability</h3>
              <p>
                To the fullest extent permitted by law, LOREWEAVER Publications shall not be liable for any 
                indirect, incidental, special, consequential, or punitive damages arising out of or related to 
                your use of the Site. Our total liability shall not exceed the amount paid by you, if any, for 
                accessing the Site.
              </p>
            </div>

            <div>
              <h3 className="mb-3">8. Indemnification</h3>
              <p>
                You agree to indemnify and hold harmless LOREWEAVER Publications, its affiliates, and their 
                respective officers, directors, employees, and agents from any claims, damages, losses, or 
                expenses (including reasonable attorneys' fees) arising out of your use of the Site or violation 
                of these Terms of Use.
              </p>
            </div>

            <div>
              <h3 className="mb-3">9. Modifications to Terms</h3>
              <p>
                We reserve the right to modify these Terms of Use at any time. Changes will be effective 
                immediately upon posting to the Site. Your continued use of the Site after any changes 
                constitutes acceptance of the modified terms.
              </p>
            </div>

            <div>
              <h3 className="mb-3">10. Termination</h3>
              <p>
                We reserve the right to terminate or suspend your access to the Site at any time, without 
                notice, for conduct that we believe violates these Terms of Use or is harmful to other users, 
                us, or third parties, or for any other reason.
              </p>
            </div>

            <div>
              <h3 className="mb-3">11. Governing Law</h3>
              <p>
                These Terms of Use shall be governed by and construed in accordance with the laws of the 
                jurisdiction in which LOREWEAVER Publications operates, without regard to its conflict of 
                law provisions.
              </p>
            </div>
          </div>
        </section>

        {/* Privacy Policy Section */}
        <section id="privacy-policy" className="bg-white rounded-lg shadow-md p-8 border border-gray-200">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-green-100 p-2 rounded-lg">
              <Shield className="w-6 h-6 text-green-600" />
            </div>
            <h2 className="mb-0">Privacy Policy</h2>
          </div>

          <div className="space-y-6 text-gray-700">
            <div>
              <h3 className="mb-3">1. Introduction</h3>
              <p>
                LOREWEAVER Publications ("we," "us," or "our") is committed to protecting your privacy. 
                This Privacy Policy explains how we collect, use, disclose, and safeguard your information 
                when you visit our website. Please read this policy carefully.
              </p>
            </div>

            <div>
              <h3 className="mb-3">2. Information We Collect</h3>
              <p className="mb-2">
                We may collect the following types of information:
              </p>
              <div className="ml-4 space-y-3">
                <div>
                  <p className="mb-1">
                    <strong>Personal Information:</strong> When you subscribe to our newsletter, create an 
                    account, or make a purchase, we may collect personal information such as your name, email 
                    address, mailing address, and payment information.
                  </p>
                </div>
                <div>
                  <p className="mb-1">
                    <strong>Usage Data:</strong> We automatically collect information about your interactions 
                    with our Site, including your IP address, browser type, operating system, pages viewed, 
                    time spent on pages, and referring website addresses.
                  </p>
                </div>
                <div>
                  <p className="mb-1">
                    <strong>Cookies and Tracking Technologies:</strong> We use cookies and similar tracking 
                    technologies to enhance your experience on our Site. See our Cookie Policy for more details.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="mb-3">3. How We Use Your Information</h3>
              <p className="mb-2">
                We use the information we collect for the following purposes:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>To provide, maintain, and improve our Site and services</li>
                <li>To process transactions and send you related information</li>
                <li>To send you newsletters, marketing communications, and promotional materials</li>
                <li>To respond to your comments, questions, and customer service requests</li>
                <li>To monitor and analyze usage and trends to improve user experience</li>
                <li>To detect, prevent, and address technical issues and security concerns</li>
                <li>To comply with legal obligations and protect our rights</li>
              </ul>
            </div>

            <div>
              <h3 className="mb-3">4. Information Sharing and Disclosure</h3>
              <p className="mb-2">
                We do not sell, trade, or rent your personal information to third parties. We may share your 
                information in the following circumstances:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li><strong>Service Providers:</strong> We may share your information with third-party service 
                providers who perform services on our behalf (e.g., payment processing, email delivery, hosting)</li>
                <li><strong>Legal Requirements:</strong> We may disclose your information if required by law or 
                in response to valid legal requests</li>
                <li><strong>Business Transfers:</strong> In the event of a merger, acquisition, or sale of assets, 
                your information may be transferred to the acquiring entity</li>
                <li><strong>With Your Consent:</strong> We may share your information with your explicit consent</li>
              </ul>
            </div>

            <div>
              <h3 className="mb-3">5. Data Security</h3>
              <p>
                We implement appropriate technical and organizational security measures to protect your personal 
                information from unauthorized access, disclosure, alteration, or destruction. However, no method 
                of transmission over the Internet or electronic storage is 100% secure, and we cannot guarantee 
                absolute security.
              </p>
            </div>

            <div>
              <h3 className="mb-3">6. Data Retention</h3>
              <p>
                We retain your personal information for as long as necessary to fulfill the purposes outlined in 
                this Privacy Policy, unless a longer retention period is required or permitted by law. When your 
                information is no longer needed, we will securely delete or anonymize it.
              </p>
            </div>

            <div>
              <h3 className="mb-3">7. Your Rights and Choices</h3>
              <p className="mb-2">
                Depending on your jurisdiction, you may have the following rights regarding your personal information:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li><strong>Access:</strong> Request access to the personal information we hold about you</li>
                <li><strong>Correction:</strong> Request correction of inaccurate or incomplete information</li>
                <li><strong>Deletion:</strong> Request deletion of your personal information</li>
                <li><strong>Objection:</strong> Object to our processing of your personal information</li>
                <li><strong>Portability:</strong> Request transfer of your information to another service</li>
                <li><strong>Opt-Out:</strong> Unsubscribe from marketing communications at any time</li>
              </ul>
              <p className="mt-2">
                To exercise any of these rights, please contact us using the information provided in the Contact 
                section below.
              </p>
            </div>

            <div>
              <h3 className="mb-3">8. Children's Privacy</h3>
              <p>
                Our Site is not intended for children under the age of 13. We do not knowingly collect personal 
                information from children under 13. If we become aware that we have collected such information, 
                we will take steps to delete it promptly.
              </p>
            </div>

            <div>
              <h3 className="mb-3">9. International Data Transfers</h3>
              <p>
                Your information may be transferred to and processed in countries other than your country of 
                residence. These countries may have different data protection laws. By using our Site, you 
                consent to the transfer of your information to these countries.
              </p>
            </div>

            <div>
              <h3 className="mb-3">10. Changes to This Privacy Policy</h3>
              <p>
                We may update this Privacy Policy from time to time. We will notify you of any changes by posting 
                the new policy on this page and updating the "Last Updated" date. Your continued use of the Site 
                after any changes constitutes acceptance of the updated policy.
              </p>
            </div>
          </div>
        </section>

        {/* Cookie Policy Section */}
        <section id="cookie-policy" className="bg-white rounded-lg shadow-md p-8 border border-gray-200">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-purple-100 p-2 rounded-lg">
              <Lock className="w-6 h-6 text-purple-600" />
            </div>
            <h2 className="mb-0">Cookie Policy</h2>
          </div>

          <div className="space-y-6 text-gray-700">
            <div>
              <h3 className="mb-3">1. What Are Cookies?</h3>
              <p>
                Cookies are small text files that are placed on your device when you visit a website. They are 
                widely used to make websites work more efficiently and provide information to website owners.
              </p>
            </div>

            <div>
              <h3 className="mb-3">2. Types of Cookies We Use</h3>
              <div className="ml-4 space-y-3">
                <div>
                  <p className="mb-1">
                    <strong>Essential Cookies:</strong> These cookies are necessary for the Site to function 
                    properly. They enable basic functions like page navigation and access to secure areas.
                  </p>
                </div>
                <div>
                  <p className="mb-1">
                    <strong>Performance Cookies:</strong> These cookies help us understand how visitors interact 
                    with our Site by collecting and reporting information anonymously.
                  </p>
                </div>
                <div>
                  <p className="mb-1">
                    <strong>Functionality Cookies:</strong> These cookies enable the Site to remember your 
                    preferences and provide enhanced, personalized features.
                  </p>
                </div>
                <div>
                  <p className="mb-1">
                    <strong>Targeting/Advertising Cookies:</strong> These cookies may be set by our advertising 
                    partners to build a profile of your interests and show you relevant ads on other sites.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="mb-3">3. Managing Cookies</h3>
              <p>
                Most web browsers allow you to control cookies through their settings. You can set your browser 
                to refuse cookies or delete certain cookies. However, if you disable or refuse cookies, some 
                parts of our Site may not function properly.
              </p>
            </div>

            <div>
              <h3 className="mb-3">4. Third-Party Cookies</h3>
              <p>
                Some cookies on our Site are placed by third-party services. We do not control these cookies or 
                how the third parties use them. We encourage you to review the privacy policies of these third 
                parties for more information.
              </p>
            </div>
          </div>
        </section>

        {/* Copyright Notice Section */}
        <section id="copyright-notice" className="bg-white rounded-lg shadow-md p-8 border border-gray-200">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-orange-100 p-2 rounded-lg">
              <FileText className="w-6 h-6 text-orange-600" />
            </div>
            <h2 className="mb-0">Copyright Notice</h2>
          </div>

          <div className="space-y-6 text-gray-700">
            <div>
              <h3 className="mb-3">1. Copyright Ownership</h3>
              <p>
                All content published on the LOREWEAVER Publications website, including but not limited to text, 
                graphics, logos, images, photographs, illustrations, audio clips, video clips, and software, is 
                the property of LOREWEAVER Publications or its content suppliers and is protected by United States 
                and international copyright laws.
              </p>
            </div>

            <div>
              <h3 className="mb-3">2. Permitted Use</h3>
              <p>
                You may view, download, and print content from our Site for personal, non-commercial use only, 
                provided that you do not modify the content and that you retain all copyright and other proprietary 
                notices. Any other use, including reproduction, modification, distribution, transmission, or 
                republication, requires our prior written permission.
              </p>
            </div>

            <div>
              <h3 className="mb-3">3. Trademarks</h3>
              <p>
                LOREWEAVER Publications and all related logos, product names, and service names are trademarks or 
                registered trademarks of LOREWEAVER Publications. All other trademarks appearing on this Site are 
                the property of their respective owners.
              </p>
            </div>

            <div>
              <h3 className="mb-3">4. DMCA Notice</h3>
              <p className="mb-2">
                If you believe that your copyrighted work has been copied in a way that constitutes copyright 
                infringement, please provide our designated copyright agent with the following information:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>A description of the copyrighted work that you claim has been infringed</li>
                <li>A description of where the material is located on our Site</li>
                <li>Your contact information (address, telephone number, email address)</li>
                <li>A statement that you have a good faith belief that the disputed use is not authorized</li>
                <li>A statement, under penalty of perjury, that the information is accurate and that you are 
                authorized to act on behalf of the copyright owner</li>
                <li>Your physical or electronic signature</li>
              </ul>
            </div>
          </div>
        </section>

        {/* User Conduct Section */}
        <section id="user-conduct" className="bg-white rounded-lg shadow-md p-8 border border-gray-200">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-red-100 p-2 rounded-lg">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
            <h2 className="mb-0">User Conduct Policy</h2>
          </div>

          <div className="space-y-6 text-gray-700">
            <div>
              <h3 className="mb-3">1. Community Standards</h3>
              <p>
                LOREWEAVER Publications is committed to fostering a welcoming, inclusive, and respectful community. 
                We expect all users to treat others with courtesy and respect.
              </p>
            </div>

            <div>
              <h3 className="mb-3">2. Prohibited Conduct</h3>
              <p className="mb-2">
                You agree not to engage in any of the following prohibited activities:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Harassment, bullying, or intimidation of other users</li>
                <li>Posting hateful, discriminatory, or offensive content</li>
                <li>Impersonating another person or entity</li>
                <li>Spamming or posting unsolicited advertising or promotional content</li>
                <li>Posting content that is illegal, harmful, threatening, abusive, or defamatory</li>
                <li>Sharing personal information of others without their consent</li>
                <li>Attempting to circumvent security measures or gain unauthorized access</li>
                <li>Distributing malware, viruses, or other harmful code</li>
              </ul>
            </div>

            <div>
              <h3 className="mb-3">3. Content Guidelines for User Submissions</h3>
              <p className="mb-2">
                When submitting content to our Site (including fan fiction, comments, or forum posts), please ensure:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Your content is original or properly attributed</li>
                <li>Your content does not infringe upon intellectual property rights</li>
                <li>Your content is appropriate for a general audience</li>
                <li>Your content complies with all applicable laws and regulations</li>
              </ul>
            </div>

            <div>
              <h3 className="mb-3">4. Enforcement and Consequences</h3>
              <p>
                Violation of this User Conduct Policy may result in removal of content, suspension or termination 
                of your account, and/or legal action. We reserve the right to remove any content that violates 
                this policy or is otherwise objectionable in our sole discretion.
              </p>
            </div>
          </div>
        </section>

        {/* Disclaimer Section */}
        <section id="disclaimer" className="bg-white rounded-lg shadow-md p-8 border border-gray-200">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-yellow-100 p-2 rounded-lg">
              <AlertCircle className="w-6 h-6 text-yellow-600" />
            </div>
            <h2 className="mb-0">Disclaimer</h2>
          </div>

          <div className="space-y-6 text-gray-700">
            <div>
              <h3 className="mb-3">1. No Warranties</h3>
              <p>
                This Site and all content, materials, information, and services are provided "as is" and "as 
                available" without warranties of any kind, either express or implied. LOREWEAVER Publications 
                disclaims all warranties, including but not limited to implied warranties of merchantability, 
                fitness for a particular purpose, and non-infringement.
              </p>
            </div>

            <div>
              <h3 className="mb-3">2. Accuracy of Information</h3>
              <p>
                While we strive to provide accurate and up-to-date information, we make no representations or 
                warranties regarding the accuracy, reliability, completeness, or timeliness of any content on 
                this Site. Information may be changed or updated without notice.
              </p>
            </div>

            <div>
              <h3 className="mb-3">3. Professional Advice Disclaimer</h3>
              <p>
                The content on this Site is for general informational and entertainment purposes only. It should 
                not be considered professional advice. You should consult with appropriate professionals for 
                specific advice tailored to your situation.
              </p>
            </div>

            <div>
              <h3 className="mb-3">4. External Links Disclaimer</h3>
              <p>
                Our Site may contain links to external websites. These links are provided for your convenience 
                only. We do not endorse or assume responsibility for the content, accuracy, or practices of 
                third-party websites.
              </p>
            </div>

            <div>
              <h3 className="mb-3">5. Limitation of Liability</h3>
              <p>
                In no event shall LOREWEAVER Publications, its affiliates, or their respective officers, directors, 
                employees, or agents be liable for any direct, indirect, incidental, special, consequential, or 
                punitive damages arising out of or relating to your use of or inability to use the Site.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Information Section */}
        <section id="contact" className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg shadow-md p-8 border border-blue-200">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-blue-100 p-2 rounded-lg">
              <Mail className="w-6 h-6 text-blue-600" />
            </div>
            <h2 className="mb-0">Contact Information</h2>
          </div>

          <div className="space-y-4 text-gray-700">
            <p>
              If you have any questions, concerns, or requests regarding these legal policies, or if you wish to 
              exercise any of your rights under our Privacy Policy, please contact us:
            </p>
            
            <div className="bg-white rounded-lg p-6 space-y-3">
              <div>
                <p className="mb-1"><strong>LOREWEAVER Publications</strong></p>
                <p className="text-sm">Legal Department</p>
              </div>
              
              <div className="space-y-1 text-sm">
                <p><strong>Email:</strong> legal@loreweaverpublications.com</p>
                <p><strong>Mail:</strong> [Physical Address]</p>
                <p><strong>Phone:</strong> [Contact Number]</p>
              </div>

              <div className="pt-3 border-t border-gray-200">
                <p className="text-sm text-gray-600">
                  We will respond to all inquiries within 30 business days. For DMCA notices or urgent legal 
                  matters, please clearly indicate the nature of your request in the subject line.
                </p>
              </div>
            </div>

            <div className="bg-blue-100 rounded-lg p-4 mt-6">
              <p className="text-sm">
                <strong>Note:</strong> This legal documentation is provided for informational purposes. For the 
                most current version of our policies, please check this page regularly. The "Last Updated" date 
                at the top of this page indicates when changes were last made.
              </p>
            </div>
          </div>
        </section>

        {/* Return to Top Button */}
        <div className="text-center pt-8">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
          >
            Return to Top
          </button>
        </div>
      </div>
    </main>
  );
}
