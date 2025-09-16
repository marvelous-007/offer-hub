import { Router } from 'express';
import { WorkflowController } from '../controllers/workflow.controller';
import { authenticateToken } from '../middlewares/auth.middleware';
import { validateRequest } from '../middlewares/validation.middleware';
import { 
  workflowValidationSchemas,
  workflowStageValidationSchemas,
  workflowProgressValidationSchemas,
  workflowNotificationValidationSchemas,
  workflowDeadlineValidationSchemas,
  workflowAnalyticsValidationSchemas,
  disputeOperationValidationSchemas
} from '../middlewares/workflow.validation';

const router = Router();
const workflowController = new WorkflowController();

// Apply authentication middleware to all routes
// router.use(authenticateToken); // Temporarily disabled for testing

// Workflow State Management Routes
router.get(
  '/disputes/:disputeId/workflow',
  validateRequest(workflowValidationSchemas.getWorkflowState),
  workflowController.getWorkflowState.bind(workflowController)
);

router.post(
  '/workflows',
  validateRequest(workflowValidationSchemas.initializeWorkflow),
  workflowController.initializeWorkflow.bind(workflowController)
);

router.put(
  '/disputes/:disputeId/workflow',
  validateRequest(workflowValidationSchemas.updateWorkflowState),
  workflowController.updateWorkflowState.bind(workflowController)
);

// Workflow Stages Routes
router.get(
  '/disputes/:disputeId/stages',
  validateRequest(workflowStageValidationSchemas.getStages),
  workflowController.getWorkflowStages.bind(workflowController)
);

router.post(
  '/disputes/:disputeId/stages',
  validateRequest(workflowStageValidationSchemas.transitionStage),
  workflowController.transitionStage.bind(workflowController)
);

router.put(
  '/disputes/:disputeId/stages/:stageId',
  validateRequest(workflowStageValidationSchemas.updateStageStatus),
  workflowController.updateStageStatus.bind(workflowController)
);

// Workflow Progress Routes
router.get(
  '/disputes/:disputeId/progress',
  validateRequest(workflowProgressValidationSchemas.getProgress),
  workflowController.getWorkflowProgress.bind(workflowController)
);

router.put(
  '/disputes/:disputeId/progress',
  validateRequest(workflowProgressValidationSchemas.updateProgress),
  workflowController.updateProgress.bind(workflowController)
);

router.post(
  '/disputes/:disputeId/milestones',
  validateRequest(workflowProgressValidationSchemas.addMilestone),
  workflowController.addMilestone.bind(workflowController)
);

// Workflow Notifications Routes
router.get(
  '/disputes/:disputeId/notifications',
  validateRequest(workflowNotificationValidationSchemas.getNotifications),
  workflowController.getNotifications.bind(workflowController)
);

router.post(
  '/disputes/:disputeId/notifications',
  validateRequest(workflowNotificationValidationSchemas.sendNotification),
  workflowController.sendNotification.bind(workflowController)
);

router.put(
  '/notifications/:notificationId/read',
  validateRequest(workflowNotificationValidationSchemas.markAsRead),
  workflowController.markNotificationAsRead.bind(workflowController)
);

router.put(
  '/disputes/:disputeId/notification-preferences',
  validateRequest(workflowNotificationValidationSchemas.updatePreferences),
  workflowController.updateNotificationPreferences.bind(workflowController)
);

// Workflow Deadlines Routes
router.get(
  '/disputes/:disputeId/deadlines',
  validateRequest(workflowDeadlineValidationSchemas.getDeadlines),
  workflowController.getDeadlines.bind(workflowController)
);

router.post(
  '/disputes/:disputeId/deadlines/extend',
  validateRequest(workflowDeadlineValidationSchemas.extendDeadline),
  workflowController.extendDeadline.bind(workflowController)
);

router.post(
  '/disputes/:disputeId/escalate',
  validateRequest(workflowDeadlineValidationSchemas.triggerEscalation),
  workflowController.triggerEscalation.bind(workflowController)
);

// Workflow Audit Trail Routes
router.get(
  '/disputes/:disputeId/audit',
  validateRequest(workflowValidationSchemas.getAuditTrail),
  workflowController.getAuditTrail.bind(workflowController)
);

router.post(
  '/disputes/:disputeId/audit',
  validateRequest(workflowValidationSchemas.logAuditEvent),
  workflowController.logAuditEvent.bind(workflowController)
);

// Workflow Analytics Routes
router.get(
  '/analytics/workflow',
  validateRequest(workflowAnalyticsValidationSchemas.getAnalytics),
  workflowController.getWorkflowAnalytics.bind(workflowController)
);

router.get(
  '/analytics/export',
  validateRequest(workflowAnalyticsValidationSchemas.exportAnalytics),
  workflowController.exportAnalytics.bind(workflowController)
);

// Workflow Configuration Routes
router.get(
  '/configurations/:disputeType',
  validateRequest(workflowValidationSchemas.getConfiguration),
  workflowController.getWorkflowConfiguration.bind(workflowController)
);

router.put(
  '/configurations/:disputeType',
  validateRequest(workflowValidationSchemas.updateConfiguration),
  workflowController.updateWorkflowConfiguration.bind(workflowController)
);

// Dispute-specific Operations Routes
router.post(
  '/disputes/:disputeId/initiate',
  validateRequest(workflowValidationSchemas.initiateDispute),
  workflowController.initiateDispute.bind(workflowController)
);

router.post(
  '/disputes/:disputeId/assign-mediator',
  validateRequest(workflowValidationSchemas.assignMediator),
  workflowController.assignMediator.bind(workflowController)
);

router.post(
  '/disputes/:disputeId/collect-evidence',
  validateRequest(workflowValidationSchemas.collectEvidence),
  workflowController.collectEvidence.bind(workflowController)
);

router.post(
  '/disputes/:disputeId/conduct-mediation',
  validateRequest(workflowValidationSchemas.conductMediation),
  workflowController.conductMediation.bind(workflowController)
);

router.post(
  '/disputes/:disputeId/resolve',
  validateRequest(workflowValidationSchemas.resolveDispute),
  workflowController.resolveDispute.bind(workflowController)
);

router.post(
  '/disputes/:disputeId/arbitration',
  validateRequest(workflowValidationSchemas.conductArbitration),
  workflowController.conductArbitration.bind(workflowController)
);

router.post(
  '/disputes/:disputeId/implement-resolution',
  validateRequest(workflowValidationSchemas.implementResolution),
  workflowController.implementResolution.bind(workflowController)
);

// Utility Routes
router.get(
  '/health',
  workflowController.healthCheck.bind(workflowController)
);

router.post(
  '/disputes/:disputeId/retry',
  validateRequest(workflowValidationSchemas.retryFailedOperations),
  workflowController.retryFailedOperations.bind(workflowController)
);

router.post(
  '/cleanup',
  workflowController.cleanupExpiredWorkflows.bind(workflowController)
);

export { router as workflowRoutes };
