import { body, param, query } from 'express-validator';

// Workflow State Validation Schemas
export const workflowValidationSchemas = {
  getWorkflowState: [
    param('disputeId').isUUID().withMessage('Dispute ID must be a valid UUID')
  ],
  
  initializeWorkflow: [
    body('disputeId').isUUID().withMessage('Dispute ID must be a valid UUID'),
    body('disputeType').optional().isIn(['standard', 'complex', 'urgent']).withMessage('Invalid dispute type'),
    body('configuration').optional().isObject().withMessage('Configuration must be an object')
  ],
  
  updateWorkflowState: [
    param('disputeId').isUUID().withMessage('Dispute ID must be a valid UUID'),
    body('currentStage').optional().isIn([
      'dispute_initiation',
      'mediator_assignment', 
      'evidence_collection',
      'mediation_process',
      'resolution_or_escalation',
      'arbitration',
      'resolution_implementation'
    ]).withMessage('Invalid workflow stage'),
    body('status').optional().isIn(['active', 'paused', 'completed', 'cancelled']).withMessage('Invalid workflow status')
  ],
  
  getAuditTrail: [
    param('disputeId').isUUID().withMessage('Dispute ID must be a valid UUID'),
    query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
    query('offset').optional().isInt({ min: 0 }).withMessage('Offset must be a non-negative integer')
  ],
  
  logAuditEvent: [
    param('disputeId').isUUID().withMessage('Dispute ID must be a valid UUID'),
    body('action').isString().isLength({ min: 1, max: 100 }).withMessage('Action must be between 1 and 100 characters'),
    body('details').optional().isObject().withMessage('Details must be an object')
  ],
  
  getConfiguration: [
    param('disputeType').isIn(['standard', 'complex', 'urgent']).withMessage('Invalid dispute type')
  ],
  
  updateConfiguration: [
    param('disputeType').isIn(['standard', 'complex', 'urgent']).withMessage('Invalid dispute type'),
    body('stages').optional().isArray().withMessage('Stages must be an array'),
    body('timeouts').optional().isObject().withMessage('Timeouts must be an object'),
    body('notificationSettings').optional().isObject().withMessage('Notification settings must be an object')
  ],
  
  initiateDispute: [
    param('disputeId').isUUID().withMessage('Dispute ID must be a valid UUID'),
    body('reason').isString().isLength({ min: 1, max: 500 }).withMessage('Reason must be between 1 and 500 characters'),
    body('description').isString().isLength({ min: 1, max: 2000 }).withMessage('Description must be between 1 and 2000 characters')
  ],
  
  assignMediator: [
    param('disputeId').isUUID().withMessage('Dispute ID must be a valid UUID'),
    body('mediatorId').isInt({ min: 1 }).withMessage('Mediator ID must be a positive integer')
  ],
  
  collectEvidence: [
    param('disputeId').isUUID().withMessage('Dispute ID must be a valid UUID'),
    body('evidenceType').isIn(['document', 'image', 'video', 'audio', 'link']).withMessage('Invalid evidence type'),
    body('description').isString().isLength({ min: 1, max: 500 }).withMessage('Description must be between 1 and 500 characters')
  ],
  
  conductMediation: [
    param('disputeId').isUUID().withMessage('Dispute ID must be a valid UUID'),
    body('sessionNotes').optional().isString().isLength({ max: 2000 }).withMessage('Session notes must be max 2000 characters')
  ],
  
  resolveDispute: [
    param('disputeId').isUUID().withMessage('Dispute ID must be a valid UUID'),
    body('resolutionType').isIn(['settlement', 'withdrawal', 'escalation']).withMessage('Invalid resolution type'),
    body('resolution').isString().isLength({ min: 1, max: 1000 }).withMessage('Resolution must be between 1 and 1000 characters')
  ],
  
  conductArbitration: [
    param('disputeId').isUUID().withMessage('Dispute ID must be a valid UUID'),
    body('arbitratorId').isInt({ min: 1 }).withMessage('Arbitrator ID must be a positive integer')
  ],
  
  implementResolution: [
    param('disputeId').isUUID().withMessage('Dispute ID must be a valid UUID'),
    body('implementationNotes').optional().isString().isLength({ max: 1000 }).withMessage('Implementation notes must be max 1000 characters')
  ],
  
  retryFailedOperations: [
    param('disputeId').isUUID().withMessage('Dispute ID must be a valid UUID'),
    body('operationType').optional().isString().withMessage('Operation type must be a string')
  ]
};

// Workflow Stage Validation Schemas
export const workflowStageValidationSchemas = {
  getStages: [
    param('disputeId').isUUID().withMessage('Dispute ID must be a valid UUID')
  ],
  
  transitionStage: [
    param('disputeId').isUUID().withMessage('Dispute ID must be a valid UUID'),
    body('targetStage').isIn([
      'dispute_initiation',
      'mediator_assignment',
      'evidence_collection', 
      'mediation_process',
      'resolution_or_escalation',
      'arbitration',
      'resolution_implementation'
    ]).withMessage('Invalid target stage'),
    body('reason').optional().isString().isLength({ max: 500 }).withMessage('Reason must be a string with max 500 characters'),
    body('metadata').optional().isObject().withMessage('Metadata must be an object')
  ],
  
  updateStage: [
    param('disputeId').isUUID().withMessage('Dispute ID must be a valid UUID'),
    param('stageId').isInt({ min: 1 }).withMessage('Stage ID must be a positive integer'),
    body('status').optional().isIn(['pending', 'in_progress', 'completed', 'cancelled']).withMessage('Invalid stage status'),
    body('notes').optional().isString().isLength({ max: 1000 }).withMessage('Notes must be a string with max 1000 characters'),
    body('metadata').optional().isObject().withMessage('Metadata must be an object')
  ],
  
  updateStageStatus: [
    param('disputeId').isUUID().withMessage('Dispute ID must be a valid UUID'),
    param('stageId').isInt({ min: 1 }).withMessage('Stage ID must be a positive integer'),
    body('status').isIn(['pending', 'in_progress', 'completed', 'cancelled']).withMessage('Invalid stage status'),
    body('notes').optional().isString().isLength({ max: 1000 }).withMessage('Notes must be a string with max 1000 characters')
  ]
};

// Workflow Progress Validation Schemas
export const workflowProgressValidationSchemas = {
  getProgress: [
    param('disputeId').isUUID().withMessage('Dispute ID must be a valid UUID')
  ],
  
  updateProgress: [
    param('disputeId').isUUID().withMessage('Dispute ID must be a valid UUID'),
    body('progressPercentage').isInt({ min: 0, max: 100 }).withMessage('Progress percentage must be between 0 and 100'),
    body('milestone').optional().isString().isLength({ max: 200 }).withMessage('Milestone must be a string with max 200 characters'),
    body('notes').optional().isString().isLength({ max: 1000 }).withMessage('Notes must be a string with max 1000 characters')
  ],
  
  addMilestone: [
    param('disputeId').isUUID().withMessage('Dispute ID must be a valid UUID'),
    body('milestone').isString().isLength({ min: 1, max: 200 }).withMessage('Milestone must be a string between 1 and 200 characters'),
    body('description').optional().isString().isLength({ max: 500 }).withMessage('Description must be a string with max 500 characters'),
    body('targetDate').optional().isISO8601().withMessage('Target date must be a valid ISO 8601 date')
  ]
};

// Workflow Notification Validation Schemas
export const workflowNotificationValidationSchemas = {
  getNotifications: [
    param('disputeId').isUUID().withMessage('Dispute ID must be a valid UUID'),
    query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
    query('offset').optional().isInt({ min: 0 }).withMessage('Offset must be a non-negative integer')
  ],
  
  sendNotification: [
    param('disputeId').isUUID().withMessage('Dispute ID must be a valid UUID'),
    body('type').isIn([
      'stage_transition',
      'deadline_alert',
      'action_required',
      'resolution_update',
      'system_alert',
      'evidence_request',
      'mediator_assignment',
      'arbitration_escalation'
    ]).withMessage('Invalid notification type'),
    body('title').isString().isLength({ min: 1, max: 200 }).withMessage('Title must be between 1 and 200 characters'),
    body('message').isString().isLength({ min: 1, max: 1000 }).withMessage('Message must be between 1 and 1000 characters'),
    body('deliveryMethod').isIn(['in_app', 'email', 'sms', 'push']).withMessage('Invalid delivery method'),
    body('priority').optional().isIn(['low', 'medium', 'high', 'urgent']).withMessage('Invalid priority level')
  ],
  
  markAsRead: [
    param('notificationId').isInt({ min: 1 }).withMessage('Notification ID must be a positive integer')
  ],
  
  updatePreferences: [
    param('disputeId').isUUID().withMessage('Dispute ID must be a valid UUID'),
    body('notificationPreferences').isObject().withMessage('Notification preferences must be an object'),
    body('deliveryMethods').optional().isArray().withMessage('Delivery methods must be an array')
  ]
};

// Workflow Deadline Validation Schemas
export const workflowDeadlineValidationSchemas = {
  getDeadlines: [
    param('disputeId').isUUID().withMessage('Dispute ID must be a valid UUID')
  ],
  
  extendDeadline: [
    param('disputeId').isUUID().withMessage('Dispute ID must be a valid UUID'),
    body('stageId').optional().isInt({ min: 1 }).withMessage('Stage ID must be a positive integer'),
    body('extensionHours').isInt({ min: 1, max: 168 }).withMessage('Extension must be between 1 and 168 hours'),
    body('reason').isString().isLength({ min: 1, max: 500 }).withMessage('Reason must be between 1 and 500 characters')
  ],
  
  escalateDispute: [
    param('disputeId').isUUID().withMessage('Dispute ID must be a valid UUID'),
    body('reason').isString().isLength({ min: 1, max: 500 }).withMessage('Reason must be between 1 and 500 characters'),
    body('urgency').optional().isIn(['low', 'medium', 'high', 'critical']).withMessage('Invalid urgency level')
  ],
  
  triggerEscalation: [
    param('disputeId').isUUID().withMessage('Dispute ID must be a valid UUID'),
    body('escalationReason').isString().isLength({ min: 1, max: 500 }).withMessage('Escalation reason must be between 1 and 500 characters'),
    body('targetStage').optional().isString().withMessage('Target stage must be a string')
  ]
};

// Workflow Analytics Validation Schemas
export const workflowAnalyticsValidationSchemas = {
  getAnalytics: [
    query('startDate').optional().isISO8601().withMessage('Start date must be a valid ISO 8601 date'),
    query('endDate').optional().isISO8601().withMessage('End date must be a valid ISO 8601 date'),
    query('disputeType').optional().isIn(['standard', 'complex', 'urgent']).withMessage('Invalid dispute type'),
    query('granularity').optional().isIn(['hourly', 'daily', 'weekly', 'monthly']).withMessage('Invalid granularity')
  ],
  
  exportAnalytics: [
    query('format').isIn(['json', 'csv', 'pdf']).withMessage('Export format must be json, csv, or pdf'),
    query('startDate').optional().isISO8601().withMessage('Start date must be a valid ISO 8601 date'),
    query('endDate').optional().isISO8601().withMessage('End date must be a valid ISO 8601 date')
  ]
};

// Dispute Operation Validation Schemas
export const disputeOperationValidationSchemas = {
  initiateDispute: [
    param('disputeId').isUUID().withMessage('Dispute ID must be a valid UUID'),
    body('reason').isString().isLength({ min: 1, max: 500 }).withMessage('Reason must be between 1 and 500 characters'),
    body('description').isString().isLength({ min: 1, max: 2000 }).withMessage('Description must be between 1 and 2000 characters'),
    body('projectId').optional().isInt({ min: 1 }).withMessage('Project ID must be a positive integer')
  ],
  
  assignMediator: [
    param('disputeId').isUUID().withMessage('Dispute ID must be a valid UUID'),
    body('mediatorId').isInt({ min: 1 }).withMessage('Mediator ID must be a positive integer'),
    body('assignmentReason').optional().isString().isLength({ max: 500 }).withMessage('Assignment reason must be max 500 characters')
  ],
  
  collectEvidence: [
    param('disputeId').isUUID().withMessage('Dispute ID must be a valid UUID'),
    body('evidenceType').isIn(['document', 'image', 'video', 'audio', 'link']).withMessage('Invalid evidence type'),
    body('description').isString().isLength({ min: 1, max: 500 }).withMessage('Description must be between 1 and 500 characters'),
    body('fileUrl').optional().isURL().withMessage('File URL must be a valid URL')
  ],
  
  conductMediation: [
    param('disputeId').isUUID().withMessage('Dispute ID must be a valid UUID'),
    body('sessionNotes').optional().isString().isLength({ max: 2000 }).withMessage('Session notes must be max 2000 characters'),
    body('nextSteps').optional().isString().isLength({ max: 1000 }).withMessage('Next steps must be max 1000 characters')
  ],
  
  resolveDispute: [
    param('disputeId').isUUID().withMessage('Dispute ID must be a valid UUID'),
    body('resolutionType').isIn(['settlement', 'withdrawal', 'escalation']).withMessage('Invalid resolution type'),
    body('resolution').isString().isLength({ min: 1, max: 1000 }).withMessage('Resolution must be between 1 and 1000 characters'),
    body('fundDistribution').optional().isObject().withMessage('Fund distribution must be an object')
  ],
  
  conductArbitration: [
    param('disputeId').isUUID().withMessage('Dispute ID must be a valid UUID'),
    body('arbitratorId').isInt({ min: 1 }).withMessage('Arbitrator ID must be a positive integer'),
    body('arbitrationNotes').optional().isString().isLength({ max: 2000 }).withMessage('Arbitration notes must be max 2000 characters')
  ],
  
  implementResolution: [
    param('disputeId').isUUID().withMessage('Dispute ID must be a valid UUID'),
    body('implementationNotes').optional().isString().isLength({ max: 1000 }).withMessage('Implementation notes must be max 1000 characters'),
    body('fundReleaseDetails').optional().isObject().withMessage('Fund release details must be an object')
  ]
};
