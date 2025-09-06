export function SeasonsSummary() {
  return (
    <section className="hidden py-8">
      <div className="grid lg:grid-cols-2 gap-8">
        {/* NCHC Season 2 2025 */}
        <div className="border border-gray-200 rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">NCHC Season 2</h2>
            <span className="text-2xl font-bold text-gray-900">2025</span>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <div>
                <div className="font-semibold text-gray-900">Session 1</div>
                <div className="text-sm text-gray-600">West Capital</div>
              </div>
              <div className="text-right text-gray-900 font-medium">
                Nov 1-2 2025
              </div>
            </div>

            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <div>
                <div className="font-semibold text-gray-900">Session 2</div>
                <div className="text-sm text-gray-600">West Capital</div>
              </div>
              <div className="text-right text-gray-900 font-medium">
                Dec 19-20 2025
              </div>
            </div>

            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <div>
                <div className="font-semibold text-gray-900">Session 3</div>
                <div className="text-sm text-gray-600">East Capital</div>
              </div>
              <div className="text-right text-gray-900 font-medium">
                Jan 31-Feb 1 2026
              </div>
            </div>

            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <div>
                <div className="font-semibold text-gray-900">Session 4</div>
                <div className="text-sm text-gray-600">Quebec</div>
              </div>
              <div className="text-right text-gray-900 font-medium">
                Feb 28-Mar 1 2025
              </div>
            </div>

            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <div>
                <div className="font-semibold text-gray-900">Session 5</div>
                <div className="text-sm text-gray-600">Ontario East</div>
              </div>
              <div className="text-right text-gray-900 font-medium">
                Mar 27-28 2025
              </div>
            </div>

            <div className="flex justify-between items-center py-2">
              <div>
                <div className="font-semibold text-gray-900">Play-offs</div>
              </div>
              <div className="text-right text-gray-900 font-medium">
                April 27-28 2025
              </div>
            </div>
          </div>
        </div>

        {/* Summer Series 2026 */}
        <div className="border border-gray-200 rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Summer Series</h2>
            <span className="text-2xl font-bold text-gray-900">2026</span>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <div>
                <div className="font-semibold text-gray-900">Session 1</div>
                <div className="text-sm text-gray-600">West Capital</div>
              </div>
              <div className="text-right text-gray-900 font-medium">
                June 7-8 2026
              </div>
            </div>

            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <div>
                <div className="font-semibold text-gray-900">Session 2</div>
                <div className="text-sm text-gray-600">West Capital</div>
              </div>
              <div className="text-right text-gray-900 font-medium">
                Jul 5-6 2026
              </div>
            </div>

            <div className="flex justify-between items-center py-2">
              <div>
                <div className="font-semibold text-gray-900">Play-offs</div>
              </div>
              <div className="text-right text-gray-900 font-medium">
                Aug 7-8 2026
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
