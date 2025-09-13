import { SupabaseClient } from '@supabase/supabase-js';
import { 
  WorkflowState,
  WorkflowStage,
  WorkflowProgress,
  WorkflowNotification,
  WorkflowAuditTrail,
  WorkflowAnalytics,
  WorkflowConfiguration,
  WorkflowStageName,
  WorkflowStageStatus,
  NotificationType,
  DeliveryMethod,
  DisputeOutcome
} from '../types/workflow.types';
import { createClient } from '../lib/supabase/supabase';
// Simple logger using console
const logger = {
  error: (message: string, error?: any) => {
    console.error(`[ERROR] ${message}`, error);
  },
  info: (message: string, data?: any) => {
    console.log(`[INFO] ${message}`, data);
  },
  warn: (message: string, data?: any) => {
    console.warn(`[WARN] ${message}`, data);
  }
};

export class WorkflowService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient();
  }

  // Workflow State Management
  async getWorkflowState(disputeId: string): Promise<WorkflowState | null> {
    try {
      // Get workflow stages
      const { data: stages, error: stagesError } = await this.supabase
        .from('workflow_stages')
        .select('*')
        .eq('dispute_id', disputeId)
        .order('stage_order');

      if (stagesError) throw stagesError;

      // Get workflow progress
      const { data: progress, error: progressError } = await this.supabase
        .from('workflow_progress')
        .select('*')
        .eq('dispute_id', disputeId);

      if (progressError) throw progressError;

      // Get notifications
      const { data: notifications, error: notificationsError } = await this.supabase
        .from('workflow_notifications')
        .select('*')
        .eq('dispute_id', disputeId);

      if (notificationsError) throw notificationsError;

      // Get audit trail
      const { data: auditTrail, error: auditError } = await this.supabase
        .from('workflow_audit_trail')
        .select('*')
        .eq('dispute_id', disputeId);

      if (auditError) throw auditError;

      // Get configuration
      const { data: config, error: configError } = await this.supabase
        .from('workflow_configurations')
        .select('configuration')
        .eq('dispute_type', 'standard')
        .eq('is_active', true)
        .single();

      if (configError) throw configError;

      const currentStage = stages.find(s => s.status === 'in_progress')?.stage_name || 'dispute_initiation';

      return {
        disputeId,
        currentStage: currentStage as WorkflowStageName,
        progress,
        notifications,
        auditTrail,
        configuration: config.configuration
      };
    } catch (error) {
      logger.error('Error getting workflow state:', error);
      throw error;
    }
  }

  async initializeWorkflow(disputeId: string, configuration?: Partial<WorkflowConfiguration>): Promise<WorkflowState> {
    try {
      const config = { ...this.getDefaultConfiguration(), ...configuration };
      
      // Insert workflow stages
      const stages = config.stages.map((stage, index) => ({
        dispute_id: disputeId,
        stage_name: stage.stageName,
        stage_order: index,
        status: index === 0 ? 'in_progress' : 'pending',
        deadline: new Date(Date.now() + stage.duration * 60 * 60 * 1000).toISOString(),
        metadata: {
          duration: stage.duration,
          requirements: stage.requirements,
          actions: stage.actions,
          autoAdvance: stage.autoAdvance,
          escalationAfter: stage.escalationAfter
        }
      }));

      const { error: stagesError } = await this.supabase
        .from('workflow_stages')
        .insert(stages);

      if (stagesError) throw stagesError;

      // Create initial progress entry
      const { error: progressError } = await this.supabase
        .from('workflow_progress')
        .insert({
          dispute_id: disputeId,
          stage_id: stages[0].id,
          progress_percentage: 0,
          milestone: 'Workflow initialized',
          notes: 'Dispute resolution workflow has been started',
          updated_by: 'system'
        });

      if (progressError) throw progressError;

      return this.getWorkflowState(disputeId) as Promise<WorkflowState>;
    } catch (error) {
      logger.error('Error initializing workflow:', error);
      throw error;
    }
  }

  async updateWorkflowState(disputeId: string, updates: Partial<WorkflowState>): Promise<WorkflowState> {
    try {
      // This would update the workflow state in the database
      // For now, we'll just return the current state
      return this.getWorkflowState(disputeId) as Promise<WorkflowState>;
    } catch (error) {
      logger.error('Error updating workflow state:', error);
      throw error;
    }
  }

  // Workflow Stages
  async getWorkflowStages(disputeId: string): Promise<WorkflowStage[]> {
    try {
      const { data, error } = await this.supabase
        .from('workflow_stages')
        .select('*')
        .eq('dispute_id', disputeId)
        .order('stage_order');

      if (error) throw error;
      return data || [];
    } catch (error) {
      logger.error('Error getting workflow stages:', error);
      throw error;
    }
  }

  async transitionStage(
    disputeId: string,
    stage: WorkflowStageName,
    data?: Record<string, any>
  ): Promise<WorkflowState> {
    try {
      // Get current stage
      const { data: currentStage, error: currentError } = await this.supabase
        .from('workflow_stages')
        .select('*')
        .eq('dispute_id', disputeId)
        .eq('stage_name', stage)
        .single();

      if (currentError) throw currentError;

      // Update current stage to completed
      const { error: updateError } = await this.supabase
        .from('workflow_stages')
        .update({
          status: 'completed',
          completed_at: new Date().toISOString(),
          metadata: { ...currentStage.metadata, transitionData: data }
        })
        .eq('id', currentStage.id);

      if (updateError) throw updateError;

      // Find next stage and set it to in_progress
      const { data: nextStage, error: nextError } = await this.supabase
        .from('workflow_stages')
        .select('*')
        .eq('dispute_id', disputeId)
        .gt('stage_order', currentStage.stage_order)
        .order('stage_order')
        .limit(1)
        .single();

      if (nextStage) {
        const { error: nextUpdateError } = await this.supabase
          .from('workflow_stages')
          .update({
            status: 'in_progress',
            started_at: new Date().toISOString(),
            deadline: new Date(Date.now() + (nextStage.metadata?.duration || 24) * 60 * 60 * 1000).toISOString()
          })
          .eq('id', nextStage.id);

        if (nextUpdateError) throw nextUpdateError;
      }

      return this.getWorkflowState(disputeId) as Promise<WorkflowState>;
    } catch (error) {
      logger.error('Error transitioning stage:', error);
      throw error;
    }
  }

  async updateStageStatus(
    disputeId: string,
    stageId: string,
    status: WorkflowStageStatus,
    metadata?: Record<string, any>
  ): Promise<WorkflowStage> {
    try {
      const { data, error } = await this.supabase
        .from('workflow_stages')
        .update({
          status,
          metadata: metadata ? { ...metadata } : undefined,
          updated_at: new Date().toISOString()
        })
        .eq('id', stageId)
        .eq('dispute_id', disputeId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      logger.error('Error updating stage status:', error);
      throw error;
    }
  }

  // Progress Tracking
  async getWorkflowProgress(disputeId: string): Promise<WorkflowProgress[]> {
    try {
      const { data, error } = await this.supabase
        .from('workflow_progress')
        .select('*')
        .eq('dispute_id', disputeId)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      logger.error('Error getting workflow progress:', error);
      throw error;
    }
  }

  async updateProgress(
    disputeId: string,
    progress: Partial<WorkflowProgress>
  ): Promise<WorkflowProgress> {
    try {
      const { data, error } = await this.supabase
        .from('workflow_progress')
        .update({
          ...progress,
          updated_at: new Date().toISOString()
        })
        .eq('dispute_id', disputeId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      logger.error('Error updating progress:', error);
      throw error;
    }
  }

  async addMilestone(
    disputeId: string,
    stageId: string,
    milestone: string,
    notes?: string,
    progressPercentage?: number
  ): Promise<WorkflowProgress> {
    try {
      const { data, error } = await this.supabase
        .from('workflow_progress')
        .insert({
          dispute_id: disputeId,
          stage_id: stageId,
          milestone,
          notes,
          progress_percentage: progressPercentage || 0,
          updated_by: 'current_user' // This should come from auth context
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      logger.error('Error adding milestone:', error);
      throw error;
    }
  }

  // Notifications
  async getNotifications(disputeId: string): Promise<WorkflowNotification[]> {
    try {
      const { data, error } = await this.supabase
        .from('workflow_notifications')
        .select('*')
        .eq('dispute_id', disputeId)
        .order('sent_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      logger.error('Error getting notifications:', error);
      throw error;
    }
  }

  async sendNotification(
    disputeId: string,
    notification: Omit<WorkflowNotification, 'id' | 'sentAt'>
  ): Promise<WorkflowNotification> {
    try {
      const { data, error } = await this.supabase
        .from('workflow_notifications')
        .insert({
          dispute_id: disputeId,
          user_id: notification.userId,
          notification_type: notification.notificationType,
          title: notification.title,
          message: notification.message,
          delivery_method: notification.deliveryMethod,
          metadata: notification.metadata || {}
        })
        .select()
        .single();

      if (error) throw error;

      // Here you would integrate with your notification system
      // to actually send the notification via email, SMS, push, etc.
      
      return data;
    } catch (error) {
      logger.error('Error sending notification:', error);
      throw error;
    }
  }

  async markNotificationAsRead(notificationId: string): Promise<void> {
    try {
      const { error } = await this.supabase
        .from('workflow_notifications')
        .update({ read_at: new Date().toISOString() })
        .eq('id', notificationId);

      if (error) throw error;
    } catch (error) {
      logger.error('Error marking notification as read:', error);
      throw error;
    }
  }

  async updateNotificationPreferences(
    disputeId: string,
    preferences: Record<string, any>
  ): Promise<void> {
    try {
      // This would update user notification preferences
      // Implementation depends on your user preferences structure
      logger.info('Notification preferences updated', { disputeId, preferences });
    } catch (error) {
      logger.error('Error updating notification preferences:', error);
      throw error;
    }
  }

  // Deadlines
  async getDeadlines(disputeId: string): Promise<any[]> {
    try {
      const { data, error } = await this.supabase
        .from('workflow_deadlines')
        .select(`
          *,
          workflow_deadline_extensions(*)
        `)
        .eq('dispute_id', disputeId)
        .order('deadline');

      if (error) throw error;
      return data || [];
    } catch (error) {
      logger.error('Error getting deadlines:', error);
      throw error;
    }
  }

  async extendDeadline(
    disputeId: string,
    stageId: string,
    extensionHours: number,
    reason: string
  ): Promise<void> {
    try {
      // Get current deadline
      const { data: deadline, error: deadlineError } = await this.supabase
        .from('workflow_deadlines')
        .select('*')
        .eq('dispute_id', disputeId)
        .eq('stage_id', stageId)
        .single();

      if (deadlineError) throw deadlineError;

      const newDeadline = new Date(deadline.deadline);
      newDeadline.setHours(newDeadline.getHours() + extensionHours);

      // Update deadline
      const { error: updateError } = await this.supabase
        .from('workflow_deadlines')
        .update({
          deadline: newDeadline.toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', deadline.id);

      if (updateError) throw updateError;

      // Add extension record
      const { error: extensionError } = await this.supabase
        .from('workflow_deadline_extensions')
        .insert({
          deadline_id: deadline.id,
          extended_by: 'current_user', // This should come from auth context
          original_deadline: deadline.deadline,
          new_deadline: newDeadline.toISOString(),
          extension_hours: extensionHours,
          reason
        });

      if (extensionError) throw extensionError;
    } catch (error) {
      logger.error('Error extending deadline:', error);
      throw error;
    }
  }

  async triggerEscalation(
    disputeId: string,
    stageId: string,
    reason: string
  ): Promise<void> {
    try {
      // Update deadline to mark escalation as triggered
      const { error: updateError } = await this.supabase
        .from('workflow_deadlines')
        .update({
          escalation_triggered: true,
          escalation_reason: reason,
          updated_at: new Date().toISOString()
        })
        .eq('dispute_id', disputeId)
        .eq('stage_id', stageId);

      if (updateError) throw updateError;

      // Log escalation event
      const { error: escalationError } = await this.supabase
        .from('workflow_escalations')
        .insert({
          dispute_id: disputeId,
          from_stage: stageId,
          to_stage: 'next_stage', // This would be determined by escalation rules
          trigger_type: 'manual',
          escalated_by: 'current_user', // This should come from auth context
          reason
        });

      if (escalationError) throw escalationError;
    } catch (error) {
      logger.error('Error triggering escalation:', error);
      throw error;
    }
  }

  // Audit Trail
  async getAuditTrail(disputeId: string): Promise<WorkflowAuditTrail[]> {
    try {
      const { data, error } = await this.supabase
        .from('workflow_audit_trail')
        .select('*')
        .eq('dispute_id', disputeId)
        .order('performed_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      logger.error('Error getting audit trail:', error);
      throw error;
    }
  }

  async logAuditEvent(
    disputeId: string,
    action: string,
    performedBy: string,
    oldState?: Record<string, any>,
    newState?: Record<string, any>,
    metadata?: Record<string, any>
  ): Promise<WorkflowAuditTrail> {
    try {
      const { data, error } = await this.supabase
        .from('workflow_audit_trail')
        .insert({
          dispute_id: disputeId,
          action,
          performed_by: performedBy,
          old_state: oldState,
          new_state: newState,
          metadata: metadata || {}
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      logger.error('Error logging audit event:', error);
      throw error;
    }
  }

  // Analytics
  async getWorkflowAnalytics(disputeId?: string, timeRange?: string): Promise<WorkflowAnalytics> {
    try {
      // Check if we have cached analytics
      const { data: cachedAnalytics, error: cacheError } = await this.supabase
        .from('workflow_analytics')
        .select('*')
        .eq('dispute_id', disputeId || null)
        .eq('analytics_type', disputeId ? 'dispute_specific' : 'platform_wide')
        .eq('time_range', timeRange || '30d')
        .gt('expires_at', new Date().toISOString())
        .order('calculated_at', { ascending: false })
        .limit(1)
        .single();

      if (cachedAnalytics && !cacheError) {
        return cachedAnalytics.analytics_data;
      }

      // Calculate fresh analytics
      const analytics = await this.calculateWorkflowAnalytics(disputeId, timeRange);

      // Cache the results
      const { error: cacheInsertError } = await this.supabase
        .from('workflow_analytics')
        .insert({
          dispute_id: disputeId || null,
          analytics_type: disputeId ? 'dispute_specific' : 'platform_wide',
          time_range: timeRange || '30d',
          analytics_data: analytics,
          expires_at: new Date(Date.now() + 60 * 60 * 1000).toISOString() // 1 hour cache
        });

      if (cacheInsertError) {
        logger.error('Error caching analytics:', cacheInsertError);
      }

      return analytics;
    } catch (error) {
      logger.error('Error getting workflow analytics:', error);
      throw error;
    }
  }

  private async calculateWorkflowAnalytics(disputeId?: string, timeRange?: string): Promise<WorkflowAnalytics> {
    try {
      // This is a simplified calculation - in real implementation,
      // you would calculate based on actual data from your tables
      
      const mockAnalytics: WorkflowAnalytics = {
        totalDisputes: 156,
        averageResolutionTime: 12.5,
        stageCompletionRates: {
          dispute_initiation: 98.5,
          mediator_assignment: 95.2,
          evidence_collection: 87.3,
          mediation_process: 78.9,
          resolution_or_escalation: 85.6,
          arbitration: 92.1,
          resolution_implementation: 96.8
        },
        escalationRates: {
          mediation_to_arbitration: 23.4,
          overall_escalation: 18.7
        },
        userSatisfactionScore: 4.2,
        performanceMetrics: {
          pageLoadTime: 1.2,
          apiResponseTime: 245,
          errorRate: 0.8
        }
      };

      return mockAnalytics;
    } catch (error) {
      logger.error('Error calculating workflow analytics:', error);
      throw error;
    }
  }

  async exportAnalytics(disputeId?: string, format: 'json' | 'csv' = 'json'): Promise<Blob> {
    try {
      const analytics = await this.getWorkflowAnalytics(disputeId);
      
      if (format === 'json') {
        return new Blob([JSON.stringify(analytics, null, 2)], { type: 'application/json' });
      } else {
        // Convert to CSV format
        const csvData = this.convertAnalyticsToCSV(analytics);
        return new Blob([csvData], { type: 'text/csv' });
      }
    } catch (error) {
      logger.error('Error exporting analytics:', error);
      throw error;
    }
  }

  private convertAnalyticsToCSV(analytics: WorkflowAnalytics): string {
    const rows = [
      ['Metric', 'Value'],
      ['Total Disputes', analytics.totalDisputes.toString()],
      ['Average Resolution Time (days)', analytics.averageResolutionTime.toString()],
      ['User Satisfaction Score', analytics.userSatisfactionScore.toString()],
      ['Page Load Time (seconds)', analytics.performanceMetrics.pageLoadTime.toString()],
      ['API Response Time (ms)', analytics.performanceMetrics.apiResponseTime.toString()],
      ['Error Rate (%)', analytics.performanceMetrics.errorRate.toString()]
    ];

    return rows.map(row => row.join(',')).join('\n');
  }

  // Configuration
  async getWorkflowConfiguration(disputeType: string): Promise<WorkflowConfiguration> {
    try {
      const { data, error } = await this.supabase
        .from('workflow_configurations')
        .select('configuration')
        .eq('dispute_type', disputeType)
        .eq('is_active', true)
        .single();

      if (error) {
        // Return default configuration if not found
        return this.getDefaultConfiguration();
      }

      return data.configuration;
    } catch (error) {
      logger.error('Error getting workflow configuration:', error);
      return this.getDefaultConfiguration();
    }
  }

  async updateWorkflowConfiguration(
    disputeType: string,
    configuration: Partial<WorkflowConfiguration>
  ): Promise<WorkflowConfiguration> {
    try {
      const { data, error } = await this.supabase
        .from('workflow_configurations')
        .update({
          configuration,
          updated_at: new Date().toISOString()
        })
        .eq('dispute_type', disputeType)
        .select()
        .single();

      if (error) throw error;
      return data.configuration;
    } catch (error) {
      logger.error('Error updating workflow configuration:', error);
      throw error;
    }
  }

  // Dispute-specific Operations
  async initiateDispute(disputeId: string, disputeData: Record<string, any>): Promise<WorkflowState> {
    return this.transitionStage(disputeId, 'dispute_initiation', disputeData);
  }

  async assignMediator(disputeId: string, mediatorId: string, adminId: string): Promise<WorkflowState> {
    return this.transitionStage(disputeId, 'mediator_assignment', {
      mediatorId,
      assignedBy: adminId
    });
  }

  async collectEvidence(disputeId: string, evidenceData: Record<string, any>): Promise<WorkflowState> {
    return this.transitionStage(disputeId, 'evidence_collection', evidenceData);
  }

  async conductMediation(disputeId: string, mediationData: Record<string, any>): Promise<WorkflowState> {
    return this.transitionStage(disputeId, 'mediation_process', mediationData);
  }

  async resolveDispute(disputeId: string, outcome: DisputeOutcome, resolutionData: Record<string, any>): Promise<WorkflowState> {
    return this.transitionStage(disputeId, 'resolution_or_escalation', {
      outcome,
      ...resolutionData
    });
  }

  async conductArbitration(disputeId: string, arbitrationData: Record<string, any>): Promise<WorkflowState> {
    return this.transitionStage(disputeId, 'arbitration', arbitrationData);
  }

  async implementResolution(disputeId: string, implementationData: Record<string, any>): Promise<WorkflowState> {
    return this.transitionStage(disputeId, 'resolution_implementation', implementationData);
  }

  // Utility Methods
  async healthCheck(): Promise<boolean> {
    try {
      const { error } = await this.supabase
        .from('workflow_configurations')
        .select('id')
        .limit(1);

      return !error;
    } catch (error) {
      return false;
    }
  }

  async retryFailedOperations(disputeId: string): Promise<void> {
    try {
      // This would implement retry logic for failed operations
      logger.info('Retrying failed operations for dispute', { disputeId });
    } catch (error) {
      logger.error('Error retrying failed operations:', error);
      throw error;
    }
  }

  async cleanupExpiredWorkflows(): Promise<number> {
    try {
      // This would clean up expired workflows
      // For now, return a mock number
      return 0;
    } catch (error) {
      logger.error('Error cleaning up expired workflows:', error);
      throw error;
    }
  }

  // Private helper methods
  private getDefaultConfiguration(): WorkflowConfiguration {
    return {
      disputeType: 'standard',
      stages: [
        {
          stageName: 'dispute_initiation',
          duration: 2,
          requirements: ['Valid dispute reason', 'Project identification', 'Initial description'],
          actions: ['Submit dispute form', 'Receive confirmation', 'Await mediator assignment'],
          autoAdvance: false,
        },
        {
          stageName: 'mediator_assignment',
          duration: 24,
          requirements: ['Automatic mediator assignment', 'Manual assignment by admin', 'Mediator acceptance'],
          actions: ['Mediator receives notification', 'Mediator reviews details', 'Mediator accepts/declines'],
          autoAdvance: false,
          escalationAfter: 24,
        },
        {
          stageName: 'evidence_collection',
          duration: 72,
          requirements: ['Both parties submit evidence', 'Mediator reviews evidence', 'Evidence validation'],
          actions: ['Upload supporting documents', 'Request additional evidence', 'Review and categorize'],
          autoAdvance: false,
          escalationAfter: 72,
        },
        {
          stageName: 'mediation_process',
          duration: 168,
          requirements: ['Mediator facilitates communication', 'Settlement negotiation', 'Progress documentation'],
          actions: ['Conduct mediation sessions', 'Negotiate settlement terms', 'Document progress'],
          autoAdvance: false,
          escalationAfter: 168,
        },
        {
          stageName: 'resolution_or_escalation',
          duration: 24,
          requirements: ['Mediation outcome documentation', 'Escalation decision', 'Resolution implementation'],
          actions: ['Execute settlement agreement', 'Escalate to arbitration', 'Implement resolution'],
          autoAdvance: false,
        },
        {
          stageName: 'arbitration',
          duration: 336,
          requirements: ['Arbitrator assignment', 'Final evidence review', 'Binding decision'],
          actions: ['Assign arbitrator', 'Review evidence', 'Make final decision'],
          autoAdvance: false,
          escalationAfter: 336,
        },
        {
          stageName: 'resolution_implementation',
          duration: 48,
          requirements: ['Fund release execution', 'Resolution documentation', 'Final notifications'],
          actions: ['Release funds', 'Distribute according to decision', 'Close dispute'],
          autoAdvance: true,
        },
      ],
      timeouts: {
        dispute_initiation: 2,
        mediator_assignment: 24,
        evidence_collection: 72,
        mediation_process: 168,
        resolution_or_escalation: 24,
        arbitration: 336,
        resolution_implementation: 48,
      },
      escalationRules: [
        {
          fromStage: 'mediator_assignment',
          toStage: 'evidence_collection',
          trigger: 'timeout',
        },
        {
          fromStage: 'evidence_collection',
          toStage: 'mediation_process',
          trigger: 'timeout',
        },
        {
          fromStage: 'mediation_process',
          toStage: 'arbitration',
          trigger: 'condition',
          condition: 'mediation_failed',
        },
        {
          fromStage: 'arbitration',
          toStage: 'resolution_implementation',
          trigger: 'timeout',
        },
      ],
      notificationSettings: {
        enabled: true,
        channels: ['in_app', 'email', 'push'],
        timing: {
          immediate: ['stage_transition', 'action_required', 'deadline_alert'],
          daily: ['evidence_request', 'mediator_assignment'],
          weekly: ['resolution_update'],
        },
      },
    };
  }
}
