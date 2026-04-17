import Reveal from "@/components/shared/Reveal";

const rows = [
  {
    feature: "Cost",
    devforge: "Free forever",
    typical: "Free tier, limits apply",
    saas: "$29/mo after trial",
  },
  {
    feature: "Account required",
    devforge: "No account",
    typical: "Email signup",
    saas: "Credit card required",
  },
  {
    feature: "Data leaves browser",
    devforge: "Never",
    typical: "Sent to their servers",
    saas: "Stored in their database",
  },
  {
    feature: "Offline support",
    devforge: "Full offline via service worker",
    typical: "Requires internet",
    saas: "Requires internet",
  },
  {
    feature: "Sharing mechanism",
    devforge: "State encoded in URL",
    typical: "Share link to saved result",
    saas: "Invite collaborator (paid)",
  },
  {
    feature: "Source available",
    devforge: "Open source (MIT)",
    typical: "Closed source",
    saas: "Closed source",
  },
  {
    feature: "Ads",
    devforge: "None",
    typical: "Display ads on free tier",
    saas: "None (subscription model)",
  },
  {
    feature: "Rate limits",
    devforge: "None",
    typical: "API call limits on free tier",
    saas: "Usage limits per plan",
  },
];

export default function ComparisonTable() {
  return (
    <section className="page-section">
      <div className="page-container">
        <Reveal>
          <div className="mb-10">
            <p className="font-mono text-[10px] tracking-[0.08em] uppercase text-[rgba(10,10,10,0.35)] mb-2">Comparison</p>
            <h2
              className="font-display font-bold tracking-[-0.025em] text-[#0A0A0A]"
              style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)" }}
            >
              How DevForge stacks up.
            </h2>
          </div>
        </Reveal>

        <Reveal>
          <div className="overflow-x-auto rounded-[16px] border border-[rgba(0,0,0,0.08)]">
            <table className="w-full text-[14px]" aria-label="DevForge comparison to typical online tools and SaaS competitors">
              <caption className="sr-only">
                Feature comparison: DevForge vs typical online tools vs SaaS competitors
              </caption>
              <thead>
                <tr className="border-b border-[rgba(0,0,0,0.08)]">
                  <th
                    scope="col"
                    className="px-5 py-4 text-left font-mono text-[11px] tracking-[0.06em] uppercase text-[rgba(10,10,10,0.40)] font-normal w-[220px]"
                  >
                    Feature
                  </th>
                  <th
                    scope="col"
                    className="px-5 py-4 text-left font-display font-semibold text-[13px] text-[#0A0A0A]"
                  >
                    DevForge
                  </th>
                  <th
                    scope="col"
                    className="px-5 py-4 text-left font-display font-medium text-[13px] text-[rgba(10,10,10,0.55)]"
                  >
                    Typical online tool
                  </th>
                  <th
                    scope="col"
                    className="px-5 py-4 text-left font-display font-medium text-[13px] text-[rgba(10,10,10,0.55)]"
                  >
                    SaaS competitor
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, i) => (
                  <tr
                    key={row.feature}
                    className="border-b border-[rgba(0,0,0,0.06)] last:border-0"
                    style={{ background: i % 2 === 0 ? "transparent" : "rgba(0,0,0,0.02)" }}
                  >
                    <th
                      scope="row"
                      className="px-5 py-3.5 text-left font-mono text-[12px] text-[rgba(10,10,10,0.50)] font-normal"
                    >
                      {row.feature}
                    </th>
                    <td className="px-5 py-3.5 text-[13px] text-[#0A0A0A] font-medium">
                      {row.devforge}
                    </td>
                    <td className="px-5 py-3.5 text-[13px] text-[rgba(10,10,10,0.55)]">
                      {row.typical}
                    </td>
                    <td className="px-5 py-3.5 text-[13px] text-[rgba(10,10,10,0.55)]">
                      {row.saas}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
