import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <div className="mb-6">
        <Button variant="ghost" asChild className="mb-4">
          <Link href="/" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center">Privacy Policy</CardTitle>
          <p className="text-center text-sm text-gray-500">Last updated: 6th of June 2025</p>
        </CardHeader>
        <CardContent className="prose prose-gray max-w-none">
          <div className="space-y-8">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <p className="text-lg leading-relaxed text-gray-700">
                At Kaatch, we care about your privacy. Here's everything you need to know — no fine print, no legal
                jargon.
              </p>
            </div>

            <div className="space-y-6">
              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Who's responsible for your data?</h2>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start gap-3">
                    <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                    <span>Data controller: PEOPLE FUTURE S.L.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                    <span>
                      Contact email:{" "}
                      <a href="mailto:legal@kaatch.co" className="text-blue-600 hover:text-blue-800 underline">
                        legal@kaatch.co
                      </a>
                    </span>
                  </li>
                </ul>
              </section>

              <Separator />

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">What data do we collect?</h2>
                <p className="text-gray-700 mb-4">When you create or update your profile, we may collect:</p>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start gap-3">
                    <span className="inline-block w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                    <span>Contact details: name, email, country of residence.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="inline-block w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                    <span>
                      Professional info: experience, tools, languages, sectors, availability, types of projects.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="inline-block w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                    <span>Project preferences: industries, company size, work setup, preferred fee.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="inline-block w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                    <span>Anything else you decide to include in your profile: CV, profile photo, job title.</span>
                  </li>
                </ul>
              </section>

              <Separator />

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Why do we collect this data?</h2>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start gap-3">
                    <span className="inline-block w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></span>
                    <span>To create and manage your freelancer profile.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="inline-block w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></span>
                    <span>To help us match you with relevant projects and companies.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="inline-block w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></span>
                    <span>To generate a public link to your profile, which we may share with potential clients.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="inline-block w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></span>
                    <span>To communicate with you (about opportunities, updates, etc.).</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="inline-block w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></span>
                    <span>To improve our matching and platform experience.</span>
                  </li>
                </ul>
              </section>

              <Separator />

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">What's the legal basis?</h2>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start gap-3">
                    <span className="inline-block w-2 h-2 bg-amber-500 rounded-full mt-2 flex-shrink-0"></span>
                    <span>Your consent, when you submit your profile.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="inline-block w-2 h-2 bg-amber-500 rounded-full mt-2 flex-shrink-0"></span>
                    <span>Legitimate interest, to connect talent with companies.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="inline-block w-2 h-2 bg-amber-500 rounded-full mt-2 flex-shrink-0"></span>
                    <span>Pre-contractual relationship, if you're being considered for a project.</span>
                  </li>
                </ul>
              </section>

              <Separator />

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Do we share your data?</h2>
                <p className="text-gray-700 mb-4">Yes, but only when necessary:</p>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start gap-3">
                    <span className="inline-block w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></span>
                    <span>With client companies, interested in your profile.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="inline-block w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></span>
                    <span>
                      With external tools we use to operate (e.g. Airtable, Make), always under GDPR-compliant terms and
                      proper safeguards if outside the EU.
                    </span>
                  </li>
                </ul>
                <p className="text-gray-700 mt-4 font-semibold">We never sell your data. Ever.</p>
              </section>

              <Separator />

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">How long do we keep your data?</h2>
                <p className="text-gray-700">
                  As long as your profile is active. If there's no activity for over 12 months, we'll contact you to
                  confirm whether to keep or delete it.
                </p>
              </section>

              <Separator />

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">What are your rights?</h2>
                <p className="text-gray-700 mb-4">You can contact us at any time to:</p>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start gap-3">
                    <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                    <span>Access your data.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                    <span>Correct inaccurate data.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                    <span>Delete your profile.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                    <span>Restrict or object to how we use your data.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                    <span>Transfer your data to another provider.</span>
                  </li>
                </ul>
                <p className="text-gray-700 mt-4">
                  Just email us at{" "}
                  <a href="mailto:legal@kaatch.co" className="text-blue-600 hover:text-blue-800 underline">
                    legal@kaatch.co
                  </a>{" "}
                  and we'll sort it quickly.
                </p>
              </section>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mt-8">
              <p className="text-sm text-gray-600 text-center">
                If you have any questions about this privacy policy, please contact us at{" "}
                <a href="mailto:legal@kaatch.co" className="text-blue-600 hover:text-blue-800 underline">
                  legal@kaatch.co
                </a>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
