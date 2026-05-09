import { GlassCard } from "@/components/GlassCard";

export default function ComplimentsComplaintsPage() {
  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <h1 className="text-4xl md:text-5xl font-extrabold text-green-900 text-center">Compliments & Complaints</h1>

      <GlassCard className="bg-white/80">
        <div className="space-y-8">
          <section>
            <h2 className="text-3xl font-bold mb-4 text-green-800 flex items-center gap-3">
              <span aria-hidden="true">⭐</span> Compliments (Saying well done)
            </h2>
            <div className="bg-green-50/50 p-6 rounded-2xl">
              <p className="easy-read-text font-medium text-gray-800">
                If someone has done a really good job, or you are very happy with something, please tell us! We love to hear good news.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-3xl font-bold mb-4 text-red-800 flex items-center gap-3">
              <span aria-hidden="true">😟</span> Complaints (Saying you are unhappy)
            </h2>
            <div className="bg-red-50/50 p-6 rounded-2xl">
              <p className="easy-read-text font-medium text-gray-800">
                If you are unhappy or upset about something we have done, you must tell us. This helps us get better.
              </p>
              <ul className="list-disc pl-6 mt-4 easy-read-text font-medium text-gray-800 space-y-2">
                <li>We will listen to you.</li>
                <li>We will try to fix the problem.</li>
                <li>We will say sorry if we got it wrong.</li>
              </ul>
            </div>
          </section>
        </div>
      </GlassCard>
    </div>
  );
}
