import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function TermsPage() {
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
          <CardTitle className="text-3xl font-bold text-center">Terms & Conditions of Use</CardTitle>
          <p className="text-center text-sm text-gray-500">Last updated: 6th of June 2025</p>
        </CardHeader>
        <CardContent className="prose prose-gray max-w-none">
          <div className="space-y-8">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <p className="text-lg leading-relaxed text-gray-700">
                Welcome to the Kaatch freelancer app. These are the simple rules of how this space works.
              </p>
            </div>

            <div className="space-y-6">
              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. What is this app for?</h2>
                <p className="text-gray-700 leading-relaxed">
                  This is a private space where you can build and manage your professional profile as an HR expert. Our
                  goal: help match you with great projects through our network of client companies.
                </p>
              </section>

              <Separator />

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. How does it work?</h2>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start gap-3">
                    <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                    <span>You decide what information to include in your profile.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                    <span>
                      We review your profile and, if there's a good fit, we may share it with companies looking for
                      talent like you.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                    <span>Each profile includes a public link, shared only in professional matchmaking contexts.</span>
                  </li>
                </ul>
              </section>

              <Separator />

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. What are your responsibilities?</h2>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start gap-3">
                    <span className="inline-block w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                    <span>Provide accurate and up-to-date information.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="inline-block w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                    <span>Use the app only for professional purposes related to Kaatch.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="inline-block w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                    <span>Let us know if you're no longer available for projects.</span>
                  </li>
                </ul>
              </section>

              <Separator />

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. What can Kaatch do?</h2>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start gap-3">
                    <span className="inline-block w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></span>
                    <span>Remove or edit your profile if there's misuse or long-term inactivity.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="inline-block w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></span>
                    <span>Share your profile only with companies and only for professional purposes.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="inline-block w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></span>
                    <span>Update and improve the app over time.</span>
                  </li>
                </ul>
              </section>

              <Separator />

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Who owns the content?</h2>
                <p className="text-gray-700 leading-relaxed">
                  Everything you submit is yours. You just give us permission to use it for professional matching while
                  your profile is active.
                </p>
              </section>

              <Separator />

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Cancelling your profile</h2>
                <p className="text-gray-700 leading-relaxed">
                  You can request to delete your profile at any time by emailing us at{" "}
                  <a href="mailto:legal@kaatch.co" className="text-blue-600 hover:text-blue-800 underline">
                    legal@kaatch.co
                  </a>
                  , or directly in the app if available. We may also remove your profile if there's long-term
                  inactivity.
                </p>
              </section>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mt-8">
              <p className="text-sm text-gray-600 text-center">
                If you have any questions about these terms, please contact us at{" "}
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
