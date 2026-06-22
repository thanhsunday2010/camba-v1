import { redirect, notFound } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/current-user";
import { getMockTestTakeViewModel } from "@/lib/mock-tests/mock-test-page";
import { buildMockTestPageLabels } from "@/lib/mock-tests/mock-test-labels";
import { MockTestPageContent } from "@/components/mock-tests/mock-test-page-content";
import { StudentPageShell } from "@/components/camba";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";

interface MockTestTakePageProps {
  params: Promise<{ mockTestId: string }>;
}

export default async function MockTestTakePage({ params }: MockTestTakePageProps) {
  const { mockTestId } = await params;
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const [labels, viewModel] = await Promise.all([
    buildMockTestPageLabels(),
    getMockTestTakeViewModel(user.id, mockTestId),
  ]);

  if (!viewModel) notFound();

  if (viewModel.questionCount === 0) {
    return (
      <StudentPageShell narrow>
        <div className="text-center py-12 space-y-4">
          <p className="camba-body text-muted">{labels.detail.notAvailable}</p>
          <Button variant="outline" asChild>
            <Link href={viewModel.detailHref}>{labels.detail.backToHub}</Link>
          </Button>
        </div>
      </StudentPageShell>
    );
  }

  return <MockTestPageContent viewModel={viewModel} labels={labels} />;
}
