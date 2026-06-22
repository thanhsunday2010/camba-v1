import { redirect, notFound } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/current-user";
import { StudentPageShell } from "@/components/camba";
import { getMockTestDetailViewModel } from "@/lib/mock-tests/mock-test-page";
import { buildMockTestPageLabels } from "@/lib/mock-tests/mock-test-labels";
import { MockTestDetailShell } from "@/components/mock-tests/mock-test-detail-shell";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";

interface MockTestDetailPageProps {
  params: Promise<{ mockTestId: string }>;
}

export default async function MockTestDetailPage({ params }: MockTestDetailPageProps) {
  const { mockTestId } = await params;
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const labels = await buildMockTestPageLabels();
  const viewModel = await getMockTestDetailViewModel(user.id, mockTestId);

  if (!viewModel) notFound();

  if (viewModel.questionCount === 0) {
    return (
      <StudentPageShell narrow>
        <div className="text-center py-12 space-y-4">
          <p className="camba-body text-muted">{labels.detail.notAvailable}</p>
          <Button variant="outline" asChild>
            <Link href="/mock-tests">{labels.detail.backToHub}</Link>
          </Button>
        </div>
      </StudentPageShell>
    );
  }

  return (
    <StudentPageShell narrow>
      <MockTestDetailShell
        viewModel={viewModel}
        labels={labels.detail}
        completeLabels={labels.complete}
        reviewLabels={labels.review}
      />
    </StudentPageShell>
  );
}
