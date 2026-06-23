import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { MockTestBreadcrumb, MockTestHero } from "@/components/mock-tests/mock-test-hero";
import { MockTestCompleteSummary } from "@/components/mock-tests/mock-test-complete-summary";
import { MockTestFormatDisclosure } from "@/components/mock-tests/mock-test-format-disclosure";
import { MockTestSkillAnalyticsCard } from "@/components/mock-tests/analytics/mock-test-skill-analytics-card";
import { MockTestSectionList } from "@/components/mock-tests/mock-test-section-list";
import type {
  MockTestCompleteLabels,
  MockTestDetailLabels,
  MockTestDetailViewModel,
  MockTestReviewLabels,
} from "@/lib/mock-tests/mock-test-types";
import type { MockTestAnalyticsLabels } from "@/lib/mock-tests/mock-test-analytics-types";
import { ArrowDown, Play, RotateCcw } from "lucide-react";

interface MockTestDetailShellProps {
  viewModel: MockTestDetailViewModel;
  labels: MockTestDetailLabels;
  completeLabels: MockTestCompleteLabels;
  reviewLabels: MockTestReviewLabels;
  analyticsLabels: MockTestAnalyticsLabels;
}

export function MockTestDetailShell({
  viewModel,
  labels,
  completeLabels,
  reviewLabels,
  analyticsLabels,
}: MockTestDetailShellProps) {
  const isFirstAttempt = viewModel.primaryCta === "start";

  return (
    <div className="camba-section-stack">
      <MockTestBreadcrumb labels={labels} />
      <MockTestHero viewModel={viewModel} labels={labels} />

      <div className="flex flex-col sm:flex-row gap-2">
        <Button variant="quest" size="lg" className="gap-2 flex-1" asChild>
          <Link href={viewModel.takeHref}>
            {isFirstAttempt ? (
              <>
                <Play className="h-4 w-4" />
                {labels.startTest}
              </>
            ) : (
              <>
                <RotateCcw className="h-4 w-4" />
                {labels.retakeTest}
              </>
            )}
          </Link>
        </Button>
        {viewModel.latestAttempt ? (
          <Button variant="outline" size="lg" className="gap-2 flex-1" asChild>
            <a href="#mock-test-latest-result">
              <ArrowDown className="h-4 w-4" />
              {labels.viewLatestResult}
            </a>
          </Button>
        ) : (
          <Button variant="outline" size="lg" className="gap-2 flex-1" asChild>
            <a href="#mock-test-structure">
              <ArrowDown className="h-4 w-4" />
              {labels.seeStructure}
            </a>
          </Button>
        )}
      </div>

      <MockTestFormatDisclosure
        format={viewModel.format}
        labels={labels.format}
        variant="card"
      />

      <div id="mock-test-structure">
        <MockTestSectionList sections={viewModel.sections} labels={labels} />
      </div>

      {viewModel.latestAttempt && (
        <div id="mock-test-latest-result" className="scroll-mt-4 space-y-3">
          <h2 className="camba-h2 text-foreground">{labels.latestResultTitle}</h2>
          <MockTestCompleteSummary
            testTitle={viewModel.title}
            attempt={viewModel.latestAttempt}
            takeHref={viewModel.takeHref}
            labels={completeLabels}
            reviewLabels={reviewLabels}
            analyticsLabels={analyticsLabels}
          />
        </div>
      )}

      {viewModel.latestAttempt && (
        <div id="mock-test-learning-insights" className="scroll-mt-4 space-y-3">
          <h2 className="camba-h2 text-foreground">{labels.learningInsightsTitle}</h2>
          <MockTestSkillAnalyticsCard
            analytics={viewModel.skillAnalytics}
            labels={analyticsLabels}
            hasAttempt
          />
        </div>
      )}

      <div className="flex justify-center pt-2">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/mock-tests">{labels.backToHubCta}</Link>
        </Button>
      </div>
    </div>
  );
}
