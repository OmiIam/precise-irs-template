
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface StatsSummary {
  totalUsers: number;
  activeUsers: number;
  totalTaxDue: number;
  taxFilings: number;
  pendingFilings: number;
  taxCredits: number;
  approachingDeadlines: number;
  issuesReported: number;
  openIssues: number;
}

export const useStatsSummary = () => {
  const [stats, setStats] = useState<StatsSummary>({
    totalUsers: 0,
    activeUsers: 0,
    totalTaxDue: 0,
    taxFilings: 0,
    pendingFilings: 0,
    taxCredits: 0,
    approachingDeadlines: 0,
    issuesReported: 0,
    openIssues: 0
  });
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const fetchStats = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Get total users count from profiles
      const { count: totalUsers, error: usersError } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });
      
      if (usersError) throw usersError;
      
      // Get active users count from profiles
      const { count: activeUsers, error: activeUsersError } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'Active');
      
      if (activeUsersError) throw activeUsersError;
      
      // Get total tax due from profiles
      const { data: taxData, error: taxError } = await supabase
        .from('profiles')
        .select('tax_due');
      
      if (taxError) throw taxError;
      
      const totalTaxDue = taxData.reduce((sum, user) => sum + (user.tax_due || 0), 0);
      
      // Get tax filings count
      const { count: taxFilings, error: filingsError } = await supabase
        .from('filings')
        .select('*', { count: 'exact', head: true });
      
      if (filingsError) throw filingsError;
      
      // Get pending filings count
      const { count: pendingFilings, error: pendingFilingsError } = await supabase
        .from('filings')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'Pending');
      
      if (pendingFilingsError) throw pendingFilingsError;
      
      // Get total tax credits from profiles
      const { data: creditsData, error: creditsError } = await supabase
        .from('profiles')
        .select('available_credits');
      
      if (creditsError) throw creditsError;
      
      const taxCredits = creditsData.reduce((sum, user) => sum + (user.available_credits || 0), 0);
      
      // Get approaching deadlines (next 30 days)
      const thirtyDaysFromNow = new Date();
      thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
      
      const { count: approachingDeadlines, error: deadlinesError } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .lt('filing_deadline', thirtyDaysFromNow.toISOString())
        .gt('filing_deadline', new Date().toISOString());
      
      if (deadlinesError) throw deadlinesError;
      
      // Get issues reported
      const { count: issuesReported, error: issuesError } = await supabase
        .from('reports')
        .select('*', { count: 'exact', head: true });
      
      if (issuesError) throw issuesError;
      
      // Get open issues
      const { count: openIssues, error: openIssuesError } = await supabase
        .from('reports')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'Open');
      
      if (openIssuesError) throw openIssuesError;
      
      setStats({
        totalUsers: totalUsers || 0,
        activeUsers: activeUsers || 0,
        totalTaxDue,
        taxFilings: taxFilings || 0,
        pendingFilings: pendingFilings || 0,
        taxCredits,
        approachingDeadlines: approachingDeadlines || 0,
        issuesReported: issuesReported || 0,
        openIssues: openIssues || 0
      });
    } catch (error: any) {
      console.error('Error fetching stats:', error);
      setError(error.message || 'Failed to fetch dashboard statistics');
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    fetchStats();
  }, []);
  
  return { stats, isLoading, error, fetchStats };
};
