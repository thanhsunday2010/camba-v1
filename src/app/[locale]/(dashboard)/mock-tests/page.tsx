import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/current-user";
import { StudentPageShell } from "@/components/camba";
import { getMockTestHubViewModel } from "@/lib/mock-tests/mock-test-hub";
import { buildMockTestPageLabels } from "@/lib/mock-tests/mock-test-labels";
import { MockTestHubFilters, MockTestHubHero } from "@/components/mock-tests/mock-test-hub-filters";

export default async function MockTestsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const labels = await buildMockTestPageLabels();
  const hub = await getMockTestHubViewModel(user.id);

  const availableCount = labels.hub.availableCount.replace(
    "{count}",
    String(hub.totalCount)
  );

  return (
    <StudentPageShell narrow>
      <div className="camba-section-stack">
        <MockTestHubHero
          title={labels.hub.title}
          subtitle={labels.hub.subtitle}
          availableCount={availableCount}
        />
        <MockTestHubFilters tests={hub.tests} labels={labels.hub} />
      </div>
    </StudentPageShell>
  );
}
