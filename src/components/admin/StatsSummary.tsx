
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Users, 
  UserCheck, 
  AlertTriangle, 
  FileText, 
  DollarSign, 
  CreditCard, 
  CalendarDays 
} from 'lucide-react';
import { useStatsSummary } from '@/hooks/useStatsSummary';
import { Skeleton } from '@/components/ui/skeleton';

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(amount);
};

const StatsSummary = () => {
  const { stats, isLoading } = useStatsSummary();

  const statCards = [
    {
      title: 'Total Users',
      value: stats.totalUsers.toString(),
      description: 'Registered users',
      icon: Users,
      color: 'text-blue-500',
      bgColor: 'bg-blue-100'
    },
    {
      title: 'Active Users',
      value: stats.activeUsers.toString(),
      description: `${stats.totalUsers ? Math.round((stats.activeUsers / stats.totalUsers) * 100) : 0}% of total users`,
      icon: UserCheck,
      color: 'text-green-500',
      bgColor: 'bg-green-100'
    },
    {
      title: 'Total Tax Due',
      value: formatCurrency(stats.totalTaxDue),
      description: 'Across all users',
      icon: DollarSign,
      color: 'text-red-500',
      bgColor: 'bg-red-100'
    },
    {
      title: 'Tax Filings',
      value: stats.taxFilings.toString(),
      description: `${stats.pendingFilings} pending review`,
      icon: FileText,
      color: 'text-irs-blue',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Tax Credits',
      value: formatCurrency(stats.taxCredits),
      description: 'Available to users',
      icon: CreditCard,
      color: 'text-emerald-500',
      bgColor: 'bg-emerald-100'
    },
    {
      title: 'Approaching Deadlines',
      value: stats.approachingDeadlines.toString(),
      description: 'Due in the next 30 days',
      icon: CalendarDays,
      color: 'text-amber-500',
      bgColor: 'bg-amber-100'
    },
    {
      title: 'Issues Reported',
      value: stats.issuesReported.toString(),
      description: `${stats.openIssues} require attention`,
      icon: AlertTriangle,
      color: 'text-orange-500',
      bgColor: 'bg-orange-100'
    }
  ];

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7">
      {statCards.map((stat, index) => {
        const IconComponent = stat.icon;
        return (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <div className={`rounded-full ${stat.bgColor} p-2`}>
                <IconComponent className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <>
                  <Skeleton className="h-8 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2" />
                </>
              ) : (
                <>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {stat.description}
                  </p>
                </>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default StatsSummary;
