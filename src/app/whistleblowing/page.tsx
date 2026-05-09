import { GlassCard } from "@/components/GlassCard";

export default function WhistleblowingPage() {
  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <h1 className="text-4xl md:text-5xl font-extrabold text-blue-900 text-center">Whistleblowing</h1>

      <GlassCard className="bg-white/80">
        <div className="space-y-6">
          <section>
            <h2 className="text-3xl font-bold mb-4 text-blue-800 flex items-center gap-3">
              <span aria-hidden="true">🗣️</span> What is whistleblowing?
            </h2>
            <div className="bg-blue-50/50 p-6 rounded-2xl">
              <p className="easy-read-text font-medium text-gray-800">
                Whistleblowing is when you tell someone important that you have seen something wrong or unsafe happening.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-3xl font-bold mb-4 text-blue-800 flex items-center gap-3">
              <span aria-hidden="true">🛡️</span> Will I be safe?
            </h2>
            <div className="bg-blue-50/50 p-6 rounded-2xl">
              <p className="easy-read-text font-medium text-gray-800">
                Yes. We will keep you safe. You will not get in trouble for telling the truth to help keep people safe.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-3xl font-bold mb-4 text-blue-800 flex items-center gap-3">
              <span aria-hidden="true">📞</span> Who do I tell?
            </h2>
            <div className="bg-blue-50/50 p-6 rounded-2xl">
              <p className="easy-read-text font-medium text-gray-800">
                You can tell a manager, or you can call our special safe phone line at <strong>0800 123 4567</strong>.
              </p>
            </div>
          </section>
        </div>
      </GlassCard>
    </div>
  );
}
