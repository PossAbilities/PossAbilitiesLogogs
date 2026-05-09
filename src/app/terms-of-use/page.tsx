import { GlassCard } from "@/components/GlassCard";

export default function TermsOfUsePage() {
  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <h1 className="text-4xl md:text-5xl font-extrabold text-purple-900 text-center">Terms of Use</h1>

      <GlassCard className="bg-white/80">
        <div className="space-y-6">
          <section>
            <h2 className="text-3xl font-bold mb-4 text-purple-800 flex items-center gap-3">
              <span aria-hidden="true">🤝</span> Our rules for using the website
            </h2>
            <div className="bg-purple-50/50 p-6 rounded-2xl">
              <p className="easy-read-text font-medium text-gray-800">
                When you use our website, you agree to follow our simple rules. This keeps everyone safe and happy.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-3xl font-bold mb-4 text-purple-800 flex items-center gap-3">
              <span aria-hidden="true">👍</span> Being kind
            </h2>
            <div className="bg-purple-50/50 p-6 rounded-2xl">
              <p className="easy-read-text font-medium text-gray-800">
                We must all be kind to each other. Do not use bad words or say mean things to other people on the website.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-3xl font-bold mb-4 text-purple-800 flex items-center gap-3">
              <span aria-hidden="true">🔒</span> Keeping secrets safe
            </h2>
            <div className="bg-purple-50/50 p-6 rounded-2xl">
              <p className="easy-read-text font-medium text-gray-800">
                Do not share your passwords with anyone. We will keep your information safe and will not give it to strangers.
              </p>
            </div>
          </section>
        </div>
      </GlassCard>
    </div>
  );
}
