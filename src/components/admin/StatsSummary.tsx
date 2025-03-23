
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, UserCheck, AlertTriangle, FileText } from 'lucide-react';

const StatsSummary = () => {
  // Mock statistics data
  const stats = [
    {
      title: 'Total Users',
      value: '2,847',
      description: '152 new this month',
      icon: Users,
      color: 'text-blue-500',
      bgColor: 'bg-blue-100'
    },
    {
      title: 'Active Users',
      value: '2,431',
      description: '85.4% of total users',
      icon: UserCheck,
      color: 'text-green-500',
      bgColor: 'bg-green-100'
    },
    {
      title: 'Issues Reported',
      value: '24',
      description: '6 require immediate attention',
      icon: AlertTriangle,
      color: 'text-amber-500',
      bgColor: 'bg-amber-100'
    },
    {
      title: 'Tax Filings',
      value: '1,287',
      description: '32 pending review',
      icon: FileText,
      color: 'text-irs-blue',
      bgColor: 'bg-blue-50'
    }
  ];

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => {
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
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default StatsSummary;
