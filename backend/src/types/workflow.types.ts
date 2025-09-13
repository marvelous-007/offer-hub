// Basic workflow types for backend
export interface WorkflowState {
  id: string;
  disputeId: string;
  currentStage: WorkflowStageName;
  status: 'active' | 'completed' | 'cancelled';
  progress: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface WorkflowStage {
  id: string;
  name: WorkflowStageName;
  status: WorkflowStageStatus;
  deadline?: Date;
  metadata?: Record<string, any>;
}

export interface WorkflowProgress {
  id: string;
  disputeId: string;
  progressPercentage: number;
  milestone: string;
  notes?: string;
  updatedBy: string;
  updatedAt: Date;
}

export interface WorkflowNotification {
  id: string;
  disputeId: string;
  userId: string;
  notificationType: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
}

export interface WorkflowAuditTrail {
  id: string;
  disputeId: string;
  action: string;
  performedBy: string;
  oldState?: any;
  newState?: any;
  metadata?: Record<string, any>;
  timestamp: Date;
}

export interface WorkflowAnalytics {
  totalDisputes: number;
  resolvedDisputes: number;
  averageResolutionTime: string;
  stageDistribution: Record<string, number>;
}

export interface WorkflowConfiguration {
  disputeType: string;
  stages: WorkflowStage[];
  timeouts: Record<string, number>;
  notifications: Record<string, boolean>;
}

export type WorkflowStageName = 
  | 'dispute_initiation'
  | 'mediator_assignment'
  | 'evidence_collection'
  | 'mediation'
  | 'resolution'
  | 'arbitration'
  | 'resolution_implementation';

export type WorkflowStageStatus = 
  | 'pending'
  | 'in_progress'
  | 'completed'
  | 'failed'
  | 'skipped';

export type DisputeOutcome = 
  | 'resolved_in_favor_of_client'
  | 'resolved_in_favor_of_freelancer'
  | 'resolved_partially'
  | 'escalated_to_arbitration'
  | 'cancelled';

export type NotificationType = 
  | 'stage_transition'
  | 'deadline_warning'
  | 'deadline_expired'
  | 'evidence_submitted'
  | 'resolution_required'
  | 'arbitration_required'
  | 'workflow_completed';

export type DeliveryMethod = 
  | 'email'
  | 'push'
  | 'sms'
  | 'in_app';
