'use client';

import React, { useState, useEffect } from 'react';
import { useAchievementSystem } from '@/hooks/use-achievement-system';
import { Achievement } from '@/types/achievement.types';
import { BadgeCategories, CategoryFilter, CategoryStats } from './badge-categories';
import { BadgeDisplay, BadgeGrid, BadgeCollection } from './badge-display';
import { AchievementTracking } from './achievement-tracking';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Trophy, 
  Search, 
   Grid, 
  List, 
  RefreshCw,
  Target,
  Bell
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface AchievementSystemProps {
  userId?: string;
  initialTab?: string;
  className?: string;
}

export const AchievementSystem: React.FC<AchievementSystemProps> = ({
  userId,
  initialTab = 'overview',
  className
}) => {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null);
  const [filterRarity, setFilterRarity] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string | null>(null);

  const {
    achievements,
    userAchievements,
    categories,
    analytics,
    notifications,
    leaderboard,
    isLoading,
    error,
    loadAchievements,
    loadUserAchievements,
    checkAchievements,
    claimAchievement,
    shareAchievement,
    markNotificationRead,
    updateUserProgress,
    refreshAnalytics,
    refreshLeaderboard,
    filteredAchievements
  } = useAchievementSystem(userId);

  // Filter achievements based on search and filters
  const localFilteredAchievements = React.useMemo(() => {
    let filtered = achievements;

    // Category filter
    if (selectedCategory) {
      filtered = filteredAchievements.byCategory(selectedCategory);
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(achievement =>
        achievement.name.toLowerCase().includes(query) ||
        achievement.description.toLowerCase().includes(query) ||
        achievement.category.toLowerCase().includes(query) ||
        achievement.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // Rarity filter
    if (filterRarity) {
      filtered = filtered.filter(achievement => achievement.rarity === filterRarity);
    }

    // Status filter
    if (filterStatus && userId) {
      filtered = filtered.filter(achievement => {
        const userAchievement = userAchievements[achievement.id];
        const status = userAchievement?.status || 'locked';
        return status === filterStatus;
      });
    }

    return filtered;
  }, [
    achievements,
    selectedCategory,
    searchQuery,
    filterRarity,
    filterStatus,
    userAchievements,
    userId,
    filteredAchievements
  ]);

  // Handle achievement selection
  const handleAchievementSelect = (achievement: Achievement) => {
    setSelectedAchievement(achievement);
  };

  // Handle achievement sharing
  const handleShare = async (achievement: Achievement, platform: string) => {
    await shareAchievement(achievement.id, platform);
  };

  // Handle achievement claiming
  const handleClaim = async (achievementId: string) => {
    if (userId) {
      await claimAchievement(achievementId, userId);
    }
  };

  // Handle category selection
  const handleCategorySelect = (categoryId: string | null) => {
    setSelectedCategory(categoryId);
  };

  // Refresh data
  const handleRefresh = async () => {
    await Promise.all([
      loadAchievements(),
      userId ? loadUserAchievements(userId) : Promise.resolve(),
      refreshAnalytics(),
      refreshLeaderboard()
    ]);
  };

  // Auto-refresh notifications
  useEffect(() => {
    const interval = setInterval(() => {
      if (userId) {
        loadUserAchievements(userId);
      }
    }, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, [userId, loadUserAchievements]);

  if (isLoading && achievements.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600">Loading achievement system...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="p-8 text-center">
        <div className="text-red-500 mb-4">
          <Trophy className="w-12 h-12 mx-auto mb-2" />
          <h3 className="text-lg font-medium">Error Loading Achievements</h3>
          <p className="text-sm mt-2">{error}</p>
        </div>
        <Button onClick={handleRefresh} variant="outline">
          <RefreshCw className="w-4 h-4 mr-2" />
          Try Again
        </Button>
      </Card>
    );
  }

  return (
    <div className={cn('space-y-6', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Achievement System</h1>
          <p className="text-gray-600">Track your progress and earn badges for your accomplishments</p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={handleRefresh}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          
          {notifications.length > 0 && (
            <Button variant="outline" size="sm">
              <Bell className="w-4 h-4 mr-2" />
              Notifications
              <Badge variant="destructive" className="ml-2 text-xs">
                {notifications.filter(n => !n.isRead).length}
              </Badge>
            </Button>
          )}
        </div>
      </div>

      {/* Quick Stats */}
      {analytics && (
        <CategoryStats 
          categories={categories}
          userAchievements={userAchievements}
        />
      )}

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="tracking">Tracking</TabsTrigger>
          <TabsTrigger value="collection">Collection</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Recent Achievements */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Trophy className="w-5 h-5" />
                  <span>Recent Achievements</span>
                </CardTitle>
                <CardDescription>Your latest accomplishments</CardDescription>
              </CardHeader>
              <CardContent>
                {Object.values(userAchievements)
                  .filter(ua => ua.status === 'completed' || ua.status === 'claimed')
                  .sort((a, b) => new Date(b.completedAt || 0).getTime() - new Date(a.completedAt || 0).getTime())
                  .slice(0, 5)
                  .map((userAchievement) => {
                    const achievement = achievements.find(a => a.id === userAchievement.achievementId);
                    if (!achievement) return null;

                    return (
                      <div key={userAchievement.achievementId} className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg mb-2">
                        <div className="text-2xl">{achievement.icon}</div>
                        <div className="flex-1">
                          <div className="font-medium">{achievement.name}</div>
                          <div className="text-sm text-gray-600">{achievement.category}</div>
                        </div>
                        <Badge variant="outline" className="text-green-600 border-green-300">
                          Completed
                        </Badge>
                      </div>
                    );
                  })}
              </CardContent>
            </Card>

            {/* In Progress */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="w-5 h-5" />
                  <span>In Progress</span>
                </CardTitle>
                <CardDescription>Achievements you're working towards</CardDescription>
              </CardHeader>
              <CardContent>
                {Object.values(userAchievements)
                  .filter(ua => ua.status === 'in_progress')
                  .sort((a, b) => b.progress - a.progress)
                  .slice(0, 5)
                  .map((userAchievement) => {
                    const achievement = achievements.find(a => a.id === userAchievement.achievementId);
                    if (!achievement) return null;

                    return (
                      <div key={userAchievement.achievementId} className="space-y-2 mb-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <div className="text-lg">{achievement.icon}</div>
                            <span className="font-medium text-sm">{achievement.name}</span>
                          </div>
                          <span className="text-sm font-medium">{userAchievement.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${userAchievement.progress}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Achievements Tab */}
        <TabsContent value="achievements" className="space-y-4">
          {/* Filters and Search */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Search achievements..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <select
                    value={filterRarity || ''}
                    onChange={(e) => setFilterRarity(e.target.value || null)}
                    className="px-3 py-2 border rounded-md text-sm"
                  >
                    <option value="">All Rarities</option>
                    <option value="common">Common</option>
                    <option value="uncommon">Uncommon</option>
                    <option value="rare">Rare</option>
                    <option value="epic">Epic</option>
                    <option value="legendary">Legendary</option>
                    <option value="mythic">Mythic</option>
                  </select>
                  
                  {userId && (
                    <select
                      value={filterStatus || ''}
                      onChange={(e) => setFilterStatus(e.target.value || null)}
                      className="px-3 py-2 border rounded-md text-sm"
                    >
                      <option value="">All Status</option>
                      <option value="completed">Completed</option>
                      <option value="in_progress">In Progress</option>
                      <option value="locked">Locked</option>
                    </select>
                  )}
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                  >
                    {viewMode === 'grid' ? <List className="w-4 h-4" /> : <Grid className="w-4 h-4" />}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Achievement Display */}
          {localFilteredAchievements.length > 0 ? (
            <BadgeGrid
              achievements={localFilteredAchievements}
              userAchievements={userAchievements}
              onAchievementSelect={handleAchievementSelect}
              onShare={handleShare}
              onClaim={handleClaim}
              config={{ size: 'md', showProgress: true, showRarity: true }}
            />
          ) : (
            <Card className="p-8 text-center">
              <Trophy className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium mb-2">No Achievements Found</h3>
              <p className="text-sm text-gray-500">
                Try adjusting your search or filter criteria
              </p>
            </Card>
          )}
        </TabsContent>

        {/* Categories Tab */}
        <TabsContent value="categories" className="space-y-4">
          <BadgeCategories
            categories={categories}
            userAchievements={userAchievements}
            onCategorySelect={handleCategorySelect}
            onAchievementSelect={handleAchievementSelect}
            selectedCategory={selectedCategory || undefined}
          />
        </TabsContent>

        {/* Tracking Tab */}
        <TabsContent value="tracking" className="space-y-4">
          <AchievementTracking
            achievements={achievements}
            userAchievements={userAchievements}
            analytics={analytics}
            notifications={notifications}
            leaderboard={leaderboard}
            onMarkNotificationRead={markNotificationRead}
            onUpdateProgress={(metric: string, value: number) => updateUserProgress(userId || '', metric, value)}
          />
        </TabsContent>

        {/* Collection Tab */}
        <TabsContent value="collection" className="space-y-4">
          <BadgeCollection
            userAchievements={userAchievements}
            achievements={achievements}
          />
          
          {/* Detailed Badge Collection */}
          <Card>
            <CardHeader>
              <CardTitle>Your Badge Collection</CardTitle>
              <CardDescription>All achievements you've earned</CardDescription>
            </CardHeader>
            <CardContent>
              <BadgeGrid
                achievements={achievements.filter(a => {
                  const userAchievement = userAchievements[a.id];
                  return userAchievement?.status === 'completed' || userAchievement?.status === 'claimed';
                })}
                userAchievements={userAchievements}
                onAchievementSelect={handleAchievementSelect}
                onShare={handleShare}
                onClaim={handleClaim}
                config={{ size: 'lg', showProgress: false, showRarity: true }}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Selected Achievement Modal/Details */}
      {selectedAchievement && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Achievement Details</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedAchievement(null)}
              >
                ×
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <BadgeDisplay
              achievement={selectedAchievement}
              userAchievement={userAchievements[selectedAchievement.id]}
              config={{ size: 'xl', showProgress: true, showRarity: true, showTooltip: false }}
              onShare={handleShare}
              onClaim={handleClaim}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AchievementSystem;

