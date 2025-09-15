import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Achievement,
  UserAchievement,
  AchievementSystemState,
  AchievementSystemActions,
  AchievementAnalytics,
  AchievementNotification,
  AchievementLeaderboardEntry,
  BadgeCategory,
  AchievementProgressDetail,
  AchievementEvent,
  AchievementVerification,
  AchievementShare
} from '@/types/achievement.types';
import {
  calculateUserAnalytics,
  verifyAchievementProgress,
  calculateAchievementProgress,
  getRequirementProgress,
  createAchievementNotification,
  calculateLeaderboardRank,
  validateAchievementData,
  generateShareUrl,
  createAchievementVerification,
  shouldRefreshAchievements,
  filterAchievementsByCategory,
  filterAchievementsByRarity,
  filterAchievementsByType,
  sortAchievementsByRarity,
  sortAchievementsByProgress
} from '@/utils/achievement-helpers';

// Mock data for development - replace with actual API calls
const MOCK_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_project',
    name: 'First Project',
    description: 'Complete your first project',
    type: 'project_completion',
    category: 'Project Completion',
    rarity: 'common',
    icon: '●',
    color: '#3B82F6',
    backgroundColor: '#EFF6FF',
    requirements: [
      {
        id: 'complete_project',
        type: 'count',
        metric: 'projects_completed',
        target: 1,
        current: 0,
        description: 'Complete 1 project',
        isCompleted: false
      }
    ],
    rewards: [
      {
        id: 'points_reward',
        type: 'points',
        value: 100,
        description: '100 points'
      }
    ],
    isHidden: false,
    isRepeatable: false,
    tags: ['beginner', 'milestone'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'five_star_rating',
    name: 'Five Star Performer',
    description: 'Achieve a 5-star rating',
    type: 'rating_milestone',
    category: 'Rating Milestone',
    rarity: 'rare',
    icon: '★',
    color: '#F59E0B',
    backgroundColor: '#FFFBEB',
    requirements: [
      {
        id: 'five_star_requirement',
        type: 'value',
        metric: 'average_rating',
        target: 5,
        current: 0,
        unit: 'stars',
        description: 'Maintain 5-star average rating',
        isCompleted: false
      }
    ],
    rewards: [
      {
        id: 'badge_reward',
        type: 'badge',
        value: 'five_star_badge',
        description: 'Five Star Badge'
      },
      {
        id: 'points_reward',
        type: 'points',
        value: 500,
        description: '500 points'
      }
    ],
    isHidden: false,
    isRepeatable: false,
    tags: ['excellence', 'rating'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'community_helper',
    name: 'Community Helper',
    description: 'Help 10 community members',
    type: 'community_contribution',
    category: 'Community Contribution',
    rarity: 'uncommon',
    icon: '◈',
    color: '#10B981',
    backgroundColor: '#ECFDF5',
    requirements: [
      {
        id: 'help_members',
        type: 'count',
        metric: 'community_helps',
        target: 10,
        current: 0,
        description: 'Help 10 community members',
        isCompleted: false
      }
    ],
    rewards: [
      {
        id: 'points_reward',
        type: 'points',
        value: 300,
        description: '300 points'
      }
    ],
    isHidden: false,
    isRepeatable: false,
    tags: ['community', 'helping'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export const useAchievementSystem = (userId?: string) => {
  const [state, setState] = useState<AchievementSystemState>({
    achievements: [],
    userAchievements: {},
    categories: [],
    analytics: null,
    notifications: [],
    leaderboard: [],
    isLoading: true,
    error: null,
    lastUpdated: new Date().toISOString()
  });

  // Load achievements from API
  const loadAchievements = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      // TODO: Replace with actual API call
      // const response = await fetch('/api/achievements');
      // const achievements = await response.json();
      
      // Using mock data for now
      const achievements = MOCK_ACHIEVEMENTS;
      
      const categories = groupAchievementsByCategory(achievements);
      
      setState(prev => ({
        ...prev,
        achievements,
        categories,
        isLoading: false,
        lastUpdated: new Date().toISOString()
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to load achievements',
        isLoading: false
      }));
    }
  }, []);

  // Load user achievements
  const loadUserAchievements = useCallback(async (targetUserId: string) => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      // TODO: Replace with actual API call
      // const response = await fetch(`/api/users/${targetUserId}/achievements`);
      // const userAchievements = await response.json();
      
      // Using mock data for now
      const userAchievements: Record<string, UserAchievement> = {};
      
      setState(prev => ({
        ...prev,
        userAchievements,
        isLoading: false,
        lastUpdated: new Date().toISOString()
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to load user achievements',
        isLoading: false
      }));
    }
  }, []);

  // Check achievements based on event data
  const checkAchievements = useCallback(async (
    targetUserId: string,
    eventData: Record<string, any>
  ) => {
    try {
      const { achievements, userAchievements } = state;
      const updatedUserAchievements = { ...userAchievements };
      const newNotifications: AchievementNotification[] = [];

      for (const achievement of achievements) {
        if (updatedUserAchievements[achievement.id]?.status === 'completed') {
          continue; // Skip already completed achievements
        }

        const isCompleted = verifyAchievementProgress(achievement, eventData);
        const progress = calculateAchievementProgress(achievement, eventData);

        if (!updatedUserAchievements[achievement.id]) {
          // Initialize user achievement
          updatedUserAchievements[achievement.id] = {
            achievementId: achievement.id,
            status: isCompleted ? 'completed' : 'in_progress',
            progress,
            progressDetails: achievement.requirements.map(req => 
              getRequirementProgress(req, eventData)
            ),
            lastProgressUpdate: new Date().toISOString()
          };
        } else {
          // Update existing user achievement
          const currentUA = updatedUserAchievements[achievement.id];
          updatedUserAchievements[achievement.id] = {
            ...currentUA,
            progress,
            status: isCompleted ? 'completed' : 'in_progress',
            completedAt: isCompleted && !currentUA.completedAt 
              ? new Date().toISOString() 
              : currentUA.completedAt,
            progressDetails: achievement.requirements.map(req => 
              getRequirementProgress(req, eventData)
            ),
            lastProgressUpdate: new Date().toISOString()
          };
        }

        // Create notification for newly completed achievements
        if (isCompleted && !updatedUserAchievements[achievement.id].completedAt) {
          const notification = createAchievementNotification(
            achievement,
            targetUserId,
            'achievement_completed'
          );
          newNotifications.push(notification);
        }
      }

      setState(prev => ({
        ...prev,
        userAchievements: updatedUserAchievements,
        notifications: [...prev.notifications, ...newNotifications],
        lastUpdated: new Date().toISOString()
      }));

      // TODO: Send API request to update user progress
      // await fetch(`/api/users/${targetUserId}/achievements/progress`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(eventData)
      // });

    } catch (error) {
      console.error('Error checking achievements:', error);
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to check achievements'
      }));
    }
  }, [state.achievements, state.userAchievements]);

  // Claim achievement
  const claimAchievement = useCallback(async (achievementId: string, targetUserId: string) => {
    try {
      const { userAchievements } = state;
      const userAchievement = userAchievements[achievementId];

      if (!userAchievement || userAchievement.status !== 'completed') {
        throw new Error('Achievement not completed or not found');
      }

      // Update user achievement status
      const updatedUserAchievements = {
        ...userAchievements,
        [achievementId]: {
          ...userAchievement,
          status: 'claimed' as const,
          claimedAt: new Date().toISOString()
        }
      };

      setState(prev => ({
        ...prev,
        userAchievements: updatedUserAchievements,
        lastUpdated: new Date().toISOString()
      }));

      // TODO: Send API request to claim achievement
      // await fetch(`/api/users/${targetUserId}/achievements/${achievementId}/claim`, {
      //   method: 'POST'
      // });

    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to claim achievement'
      }));
    }
  }, [state.userAchievements]);

  // Share achievement
  const shareAchievement = useCallback(async (achievementId: string, platform: string) => {
    try {
      const { achievements } = state;
      const achievement = achievements.find(a => a.id === achievementId);

      if (!achievement || !userId) {
        throw new Error('Achievement or user not found');
      }

      const shareUrl = generateShareUrl(achievement, platform, userId);
      
      // Open sharing URL
      if (platform !== 'custom') {
        window.open(shareUrl, '_blank', 'noopener,noreferrer');
      }

      // TODO: Log share event to API
      // await fetch('/api/achievements/share', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     achievementId,
      //     userId,
      //     platform,
      //     shareUrl
      //   })
      // });

    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to share achievement'
      }));
    }
  }, [state.achievements, userId]);

  // Mark notification as read
  const markNotificationRead = useCallback(async (notificationId: string) => {
    try {
      setState(prev => ({
        ...prev,
        notifications: prev.notifications.map(notification =>
          notification.id === notificationId
            ? { ...notification, isRead: true }
            : notification
        ),
        lastUpdated: new Date().toISOString()
      }));

      // TODO: Send API request to mark notification as read
      // await fetch(`/api/notifications/${notificationId}/read`, {
      //   method: 'PATCH'
      // });

    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to mark notification as read'
      }));
    }
  }, []);

  // Update user progress
  const updateUserProgress = useCallback(async (targetUserId: string, metric: string, value: number) => {
    try {
      await checkAchievements(targetUserId, { [metric]: value });
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to update user progress'
      }));
    }
  }, [checkAchievements]);

  // Get achievement progress
  const getAchievementProgress = useCallback(async (achievementId: string, targetUserId: string) => {
    return state.userAchievements[achievementId] || null;
  }, [state.userAchievements]);

  // Refresh analytics
  const refreshAnalytics = useCallback(async () => {
    try {
      const analytics = calculateUserAnalytics(state.achievements, state.userAchievements);
      setState(prev => ({
        ...prev,
        analytics,
        lastUpdated: new Date().toISOString()
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to refresh analytics'
      }));
    }
  }, [state.achievements, state.userAchievements]);

  // Refresh leaderboard
  const refreshLeaderboard = useCallback(async () => {
    try {
      // TODO: Replace with actual API call
      // const response = await fetch('/api/achievements/leaderboard');
      // const leaderboard = await response.json();
      
      const leaderboard: AchievementLeaderboardEntry[] = [];
      const rankedLeaderboard = calculateLeaderboardRank(leaderboard);
      
      setState(prev => ({
        ...prev,
        leaderboard: rankedLeaderboard,
        lastUpdated: new Date().toISOString()
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to refresh leaderboard'
      }));
    }
  }, []);

  // Helper function to group achievements by category
  const groupAchievementsByCategory = useCallback((achievements: Achievement[]): BadgeCategory[] => {
    const categoryMap = new Map<string, Achievement[]>();
    
    achievements.forEach(achievement => {
      if (!categoryMap.has(achievement.category)) {
        categoryMap.set(achievement.category, []);
      }
      categoryMap.get(achievement.category)!.push(achievement);
    });

    return Array.from(categoryMap.entries()).map(([categoryName, categoryAchievements]) => ({
      id: categoryName.toLowerCase().replace(/\s+/g, '_'),
      name: categoryName,
      description: `Achievements related to ${categoryName.toLowerCase()}`,
      icon: categoryAchievements[0]?.icon || '●',
      color: categoryAchievements[0]?.color || '#6B7280',
      achievements: categoryAchievements,
      totalCount: categoryAchievements.length,
      completedCount: 0 // Will be calculated based on user achievements
    }));
  }, []);

  // Memoized filtered and sorted achievements
  const filteredAchievements = useMemo(() => {
    return {
      byCategory: (category: string) => filterAchievementsByCategory(state.achievements, category),
      byRarity: (rarity: string) => filterAchievementsByRarity(state.achievements, rarity as any),
      byType: (type: string) => filterAchievementsByType(state.achievements, type as any),
      byRaritySorted: () => sortAchievementsByRarity(state.achievements),
      byProgressSorted: () => sortAchievementsByProgress(state.achievements, state.userAchievements)
    };
  }, [state.achievements, state.userAchievements]);

  // Actions object
  const actions: AchievementSystemActions = {
    loadAchievements,
    loadUserAchievements,
    checkAchievements,
    claimAchievement,
    shareAchievement,
    markNotificationRead,
    updateUserProgress,
    getAchievementProgress,
    refreshAnalytics,
    refreshLeaderboard
  };

  // Load data on mount
  useEffect(() => {
    loadAchievements();
  }, [loadAchievements]);

  useEffect(() => {
    if (userId) {
      loadUserAchievements(userId);
    }
  }, [userId, loadUserAchievements]);

  // Refresh analytics when achievements or user achievements change
  useEffect(() => {
    if (state.achievements.length > 0 && Object.keys(state.userAchievements).length > 0) {
      refreshAnalytics();
    }
  }, [state.achievements, state.userAchievements, refreshAnalytics]);

  return {
    ...state,
    ...actions,
    filteredAchievements
  };
};
