import { MainLayout } from "@/components/layout/MainLayout";
import { WellBeingScore } from "@/components/dashboard/WellBeingScore";
import { QuickStats } from "@/components/dashboard/QuickStats";
import { SpendingChart } from "@/components/dashboard/SpendingChart";
import { GoalsProgress } from "@/components/dashboard/GoalsProgress";
import { RecentAlerts } from "@/components/dashboard/RecentAlerts";
import { InvestmentSummary } from "@/components/dashboard/InvestmentSummary";

const Index = () => {
  return (
    <MainLayout>
      {/* Page Header */}
      <div className="mb-8 animate-fade-up">
        <h1 className="font-serif text-3xl font-bold text-foreground">
          Good Morning, <span className="gradient-text">Arjun</span>
        </h1>
        <p className="text-muted-foreground mt-2">
          Here's your financial overview for today
        </p>
      </div>

      {/* Quick Stats */}
      <div className="mb-8">
        <QuickStats />
      </div>

      {/* Well-Being Score */}
      <div className="mb-8">
        <WellBeingScore score={72} previousScore={68} />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <SpendingChart />
        <GoalsProgress />
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <InvestmentSummary />
        <RecentAlerts />
      </div>
    </MainLayout>
  );
};

export default Index;
