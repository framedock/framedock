import React from 'react';
import { ArrowLeftIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Footer } from '../components/Footer';
import { Navbar } from '../components/Navbar';

export function TermsPage() {
  return (
    <div className="min-h-screen bg-[#f6f7fb] text-[#10111f]">
      <Navbar />

      <main className="px-5 pb-20 pt-28 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-6xl">
          <div className="mb-6 flex items-center">
            <Link
              to="/"
              className="inline-flex items-center gap-2 rounded-full border border-[#dce4ef] bg-white/80 px-4 py-2 text-sm font-medium text-[#163437] transition hover:-translate-y-0.5 hover:bg-white"
            >
              <ArrowLeftIcon size={16} />
              Back to home
            </Link>
          </div>

          <div className="overflow-hidden rounded-[32px] border border-white/70 bg-white/80 shadow-[0_24px_80px_rgba(16,17,31,.08)] backdrop-blur">
            <div className="border-b border-[#e8eaf4] bg-gradient-to-r from-[#edf2ff] to-[#edfbf7] px-8 py-10 sm:px-10">
              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.24em] text-[#4f46e5]">
                Legal
              </p>
              <h1 className="text-3xl font-semibold tracking-[-0.03em] text-[#10111f] sm:text-4xl">
                Terms and Conditions
              </h1>
              <p className="mt-3 text-sm text-[#656a80]">Last updated: July 16, 2026</p>
              <p className="mt-4 max-w-3xl text-base leading-7 text-[#42505f]">
                Please read these terms and conditions carefully before using our service.
              </p>
            </div>

            <article className="space-y-8 px-8 py-10 text-[15px] leading-8 text-[#24313d] sm:px-10">
              <section>
                <h2 className="text-xl font-semibold text-[#10111f]">Interpretation and Definitions</h2>
                <h3 className="mt-4 text-lg font-semibold text-[#163437]">Interpretation</h3>
                <p>
                  The words whose initial letters are capitalized have meanings defined under the following conditions. The following definitions shall have the same meaning regardless of whether they appear in singular or plural.
                </p>

                <h3 className="mt-5 text-lg font-semibold text-[#163437]">Definitions</h3>
                <p className="mt-2">For the purposes of these Terms and Conditions:</p>
                <ul className="mt-4 list-disc space-y-3 pl-6">
                  <li>
                    <strong>Affiliate</strong> means an entity that controls, is controlled by, or is under common control with a party, where “control” means ownership of 50% or more of the shares, equity interest or other securities entitled to vote for election of directors or other managing authority.
                  </li>
                  <li>
                    <strong>Country</strong> refers to: California, United States.
                  </li>
                  <li>
                    <strong>Company</strong> (referred to as either “the Company”, “We”, “Us” or “Our” in these Terms and Conditions) refers to FrameDock, 633 W 5th Street, Los Angeles, CA 90012, USA.
                  </li>
                  <li>
                    <strong>Device</strong> means any device that can access the Service such as a computer, a cell phone or a digital tablet.
                  </li>
                  <li>
                    <strong>Service</strong> refers to the Website.
                  </li>
                  <li>
                    <strong>Terms and Conditions</strong> (also referred to as “Terms”) means these Terms and Conditions, including any documents expressly incorporated by reference, which govern Your access to and use of the Service and form the entire agreement between You and the Company regarding the Service.
                  </li>
                  <li>
                    <strong>Third-Party Social Media Service</strong> means any services or content (including data, information, products or services) provided by a third party that is displayed, included, made available, or linked to through the Service.
                  </li>
                  <li>
                    <strong>Website</strong> refers to Framedock, accessible from <a href="https://framedock.one/" target="_blank" rel="noreferrer" className="font-medium text-[#4f46e5] underline decoration-[#4f46e5]/40 underline-offset-2">https://framedock.one/</a>.
                  </li>
                  <li>
                    <strong>You</strong> means the individual accessing or using the Service, or the company, or other legal entity on behalf of which such individual is accessing or using the Service, as applicable.
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-[#10111f]">Acknowledgment</h2>
                <p className="mt-3">
                  These are the Terms and Conditions governing the use of this Service and the agreement between You and the Company. These Terms and Conditions set out the rights and obligations of all users regarding the use of the Service.
                </p>
                <p className="mt-3">
                  Your access to and use of the Service is conditioned on Your acceptance of and compliance with these Terms and Conditions. These Terms and Conditions apply to all visitors, users and others who access or use the Service.
                </p>
                <p className="mt-3">
                  By accessing or using the Service You agree to be bound by these Terms and Conditions. If You disagree with any part of these Terms and Conditions then You may not access the Service.
                </p>
                <p className="mt-3">
                  You represent that you are over the age of 18. The Company does not permit those under 18 to use the Service.
                </p>
                <p className="mt-3">
                  Your access to and use of the Service is also subject to Our Privacy Policy, which describes how We collect, use, and disclose personal information. Please read Our Privacy Policy carefully before using Our Service.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-[#10111f]">Links to Other Websites</h2>
                <p className="mt-3">
                  Our Service may contain links to third-party websites or services that are not owned or controlled by the Company.
                </p>
                <p className="mt-3">
                  The Company has no control over, and assumes no responsibility for, the content, privacy policies, or practices of any third-party websites or services. You further acknowledge and agree that the Company shall not be responsible or liable, directly or indirectly, for any damage or loss caused or alleged to be caused by or in connection with the use of or reliance on any such content, goods or services available on or through any such websites or services.
                </p>
                <p className="mt-3">
                  We strongly advise You to read the terms and conditions and privacy policies of any third-party websites or services that You visit.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-[#10111f]">Termination</h2>
                <p className="mt-3">
                  We may terminate or suspend Your access immediately, without prior notice or liability, for any reason whatsoever, including without limitation if You breach these Terms and Conditions.
                </p>
                <p className="mt-3">
                  Upon termination, Your right to use the Service will cease immediately.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-[#10111f]">Limitation of Liability</h2>
                <p className="mt-3">
                  Notwithstanding any damages that You might incur, the entire liability of the Company and any of its suppliers under any provision of these Terms and Your exclusive remedy for all of the foregoing shall be limited to the amount actually paid by You through the Service or 100 USD if You haven’t purchased anything through the Service.
                </p>
                <p className="mt-3">
                  To the maximum extent permitted by applicable law, in no event shall the Company or its suppliers be liable for any special, incidental, indirect, or consequential damages whatsoever, including but not limited to damages for loss of profits, loss of data or other information, business interruption, personal injury, or loss of privacy arising out of or in any way related to the use of or inability to use the Service.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-[#10111f]">“AS IS” and “AS AVAILABLE” Disclaimer</h2>
                <p className="mt-3">
                  The Service is provided to You “AS IS” and “AS AVAILABLE” and with all faults and defects without warranty of any kind. To the maximum extent permitted under applicable law, the Company expressly disclaims all warranties, whether express, implied, statutory or otherwise, with respect to the Service.
                </p>
                <p className="mt-3">
                  Without limiting the foregoing, neither the Company nor any of the company’s providers make any representation or warranty of any kind, express or implied, as to the availability, accuracy, reliability, or security of the Service.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-[#10111f]">Governing Law</h2>
                <p className="mt-3">
                  The laws of the Country, excluding its conflicts of law rules, shall govern these Terms and Your use of the Service. Your use of the Application may also be subject to other local, state, national, or international laws.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-[#10111f]">Disputes Resolution</h2>
                <p className="mt-3">
                  If You have any concern or dispute about the Service, You agree to first try to resolve the dispute informally by contacting the Company.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-[#10111f]">For European Union (EU) Users</h2>
                <p className="mt-3">
                  If You are a European Union consumer, you will benefit from any mandatory provisions of the law of the country in which You are resident.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-[#10111f]">United States Legal Compliance</h2>
                <p className="mt-3">
                  You represent and warrant that (i) You are not located in a country that is subject to the United States government embargo, or that has been designated by the United States government as a “terrorist supporting” country, and (ii) You are not listed on any United States government list of prohibited or restricted parties.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-[#10111f]">Severability and Waiver</h2>
                <h3 className="mt-4 text-lg font-semibold text-[#163437]">Severability</h3>
                <p className="mt-2">
                  If any provision of these Terms is held to be unenforceable or invalid, such provision will be changed and interpreted to accomplish the objectives of such provision to the greatest extent possible under applicable law and the remaining provisions will continue in full force and effect.
                </p>
                <h3 className="mt-4 text-lg font-semibold text-[#163437]">Waiver</h3>
                <p className="mt-2">
                  Except as provided herein, the failure to exercise a right or to require performance of an obligation under these Terms shall not affect a party’s ability to exercise such right or require such performance at any time thereafter nor shall the waiver of a breach constitute a waiver of any subsequent breach.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-[#10111f]">Translation Interpretation</h2>
                <p className="mt-3">
                  These Terms and Conditions may have been translated if We have made them available to You on our Service. You agree that the original English text shall prevail in the case of a dispute.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-[#10111f]">Changes to These Terms and Conditions</h2>
                <p className="mt-3">
                  We reserve the right, at Our sole discretion, to modify or replace these Terms at any time. If a revision is material We will make reasonable efforts to provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at Our sole discretion.
                </p>
                <p className="mt-3">
                  By continuing to access or use Our Service after those revisions become effective, You agree to be bound by the revised terms. If You do not agree to the new terms, in whole or in part, please stop using the Service.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-[#10111f]">Contact Us</h2>
                <p className="mt-3">If you have any questions about these Terms and Conditions, You can contact us:</p>
                <ul className="mt-4 list-disc space-y-2 pl-6">
                  <li>By email: connect@framedock.one</li>
                  <li>
                    By visiting this page on our website: <a href="https://framedock.one/" target="_blank" rel="noreferrer" className="font-medium text-[#4f46e5] underline decoration-[#4f46e5]/40 underline-offset-2">https://framedock.one/</a>
                  </li>
                  <li>By phone: +1 (213) 555-2118</li>
                </ul>
              </section>
            </article>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
