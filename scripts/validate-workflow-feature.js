#!/usr/bin/env node

/**
 * Workflow Feature Validation Script
 * 
 * This script validates that all the workflow feature components
 * and files have been created correctly according to the PRD specifications.
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Validating Dispute Resolution Workflow Feature Implementation...\n');

// Define expected files and their purposes
const expectedFiles = {
  // Frontend Components (PascalCase naming)
  'src/components/disputes/DisputeWorkflow.tsx': 'Main workflow management interface',
  'src/components/disputes/WorkflowStages.tsx': 'Workflow stage definition and management',
  'src/components/disputes/ProgressTracking.tsx': 'Comprehensive progress tracking component',
  'src/components/disputes/NotificationCenter.tsx': 'Centralized notification management',
  'src/components/disputes/DeadlineManager.tsx': 'Deadline tracking and escalation',
  'src/components/disputes/WorkflowAnalytics.tsx': 'Workflow performance analytics and reporting',
  'src/components/disputes/MobileWorkflow.tsx': 'Mobile-optimized workflow interface',
  'src/components/disputes/AuditTrailViewer.tsx': 'Audit trail visualization',
  
  // Supporting Files
  'src/types/workflow.types.ts': 'TypeScript interfaces for workflow management',
  'src/hooks/use-dispute-workflow.ts': 'Custom hook for workflow logic and state management',
  'src/services/workflow.service.ts': 'Frontend service for workflow operations',
  
  // Backend Implementation
  'backend/src/routes/workflow.routes.ts': 'API routes for workflow operations',
  'backend/src/controllers/workflow.controller.ts': 'Request handlers for workflow endpoints',
  'backend/src/services/workflow.service.ts': 'Backend business logic layer',
  'backend/supabase/migrations/20250117000000_11_create_workflow_tables.sql': 'Database schema migration',
  
  // Demo and Documentation
  'src/app/(demo)/workflow-demo/page.tsx': 'Interactive demo page',
  'scripts/validate-workflow-feature.js': 'Feature validation script'
};

// Expected API endpoints
const expectedApiEndpoints = [
  'GET /api/workflow/disputes/:disputeId/workflow',
  'POST /api/workflow/workflows',
  'PUT /api/workflow/disputes/:disputeId/workflow',
  'GET /api/workflow/disputes/:disputeId/stages',
  'POST /api/workflow/disputes/:disputeId/stages',
  'PUT /api/workflow/disputes/:disputeId/stages/:stageId',
  'GET /api/workflow/disputes/:disputeId/progress',
  'PUT /api/workflow/disputes/:disputeId/progress',
  'POST /api/workflow/disputes/:disputeId/milestones',
  'GET /api/workflow/disputes/:disputeId/notifications',
  'POST /api/workflow/disputes/:disputeId/notifications',
  'PUT /api/workflow/notifications/:notificationId/read',
  'GET /api/workflow/disputes/:disputeId/deadlines',
  'POST /api/workflow/disputes/:disputeId/deadlines/extend',
  'POST /api/workflow/disputes/:disputeId/escalate',
  'GET /api/workflow/disputes/:disputeId/audit',
  'POST /api/workflow/disputes/:disputeId/audit',
  'GET /api/workflow/analytics/workflow',
  'GET /api/workflow/analytics/export',
  'GET /api/workflow/configurations/:disputeType',
  'PUT /api/workflow/configurations/:disputeType',
  'POST /api/workflow/disputes/:disputeId/initiate',
  'POST /api/workflow/disputes/:disputeId/assign-mediator',
  'POST /api/workflow/disputes/:disputeId/collect-evidence',
  'POST /api/workflow/disputes/:disputeId/conduct-mediation',
  'POST /api/workflow/disputes/:disputeId/resolve',
  'POST /api/workflow/disputes/:disputeId/arbitration',
  'POST /api/workflow/disputes/:disputeId/implement-resolution',
  'GET /api/workflow/health',
  'POST /api/workflow/disputes/:disputeId/retry',
  'POST /api/workflow/cleanup'
];

// Expected database tables
const expectedDatabaseTables = [
  'workflow_stages',
  'workflow_progress', 
  'workflow_notifications',
  'workflow_audit_trail',
  'workflow_deadlines',
  'workflow_deadline_extensions',
  'workflow_configurations',
  'workflow_analytics',
  'workflow_escalations'
];

// Expected workflow stages
const expectedWorkflowStages = [
  'dispute_initiation',
  'mediator_assignment',
  'evidence_collection',
  'mediation_process',
  'resolution_or_escalation',
  'arbitration',
  'resolution_implementation'
];

// Validation results
let validationResults = {
  files: { passed: 0, failed: 0, missing: [] },
  apiEndpoints: { passed: 0, failed: 0, missing: [] },
  databaseTables: { passed: 0, failed: 0, missing: [] },
  workflowStages: { passed: 0, failed: 0, missing: [] }
};

// Helper function to check if file exists
function checkFileExists(filePath) {
  return fs.existsSync(path.join(process.cwd(), filePath));
}

// Helper function to read file content
function readFileContent(filePath) {
  try {
    return fs.readFileSync(path.join(process.cwd(), filePath), 'utf8');
  } catch (error) {
    return null;
  }
}

// Validate file naming convention (PascalCase for components)
function validateNamingConvention(content, fileName) {
  if (fileName.includes('components/disputes/') && fileName.endsWith('.tsx')) {
    // Check if component name follows PascalCase
    const componentName = path.basename(fileName, '.tsx');
    const isPascalCase = /^[A-Z][a-zA-Z0-9]*$/.test(componentName);
    
    if (!isPascalCase) {
      return { valid: false, error: `Component "${componentName}" should use PascalCase naming` };
    }
    
    // Check if component is properly exported
    const hasExport = content.includes(`export function ${componentName}`) || 
                     content.includes(`export const ${componentName}`);
    
    if (!hasExport) {
      return { valid: false, error: `Component "${componentName}" should be properly exported` };
    }
  }
  
  return { valid: true };
}

// Validate TypeScript interfaces
function validateTypeScriptInterfaces(content) {
  const requiredInterfaces = [
    'WorkflowState',
    'WorkflowStage', 
    'WorkflowProgress',
    'WorkflowNotification',
    'WorkflowAuditTrail',
    'WorkflowAnalytics',
    'WorkflowConfiguration',
    'WorkflowStageName',
    'WorkflowStageStatus',
    'NotificationType',
    'DeliveryMethod',
    'DisputeOutcome'
  ];
  
  const missingInterfaces = [];
  
  requiredInterfaces.forEach(interfaceName => {
    if (!content.includes(`interface ${interfaceName}`) && 
        !content.includes(`type ${interfaceName}`) &&
        !content.includes(`enum ${interfaceName}`)) {
      missingInterfaces.push(interfaceName);
    }
  });
  
  return missingInterfaces;
}

// Validate API endpoints in routes file
function validateApiEndpoints(content) {
  const foundEndpoints = [];
  const missingEndpoints = [];
  
  expectedApiEndpoints.forEach(endpoint => {
    const [method, path] = endpoint.split(' ');
    const pathWithoutParams = path.replace(/:[^/]+/g, '[^/]+');
    const regex = new RegExp(`${method}\\s+['\`]${pathWithoutParams.replace(/\//g, '\\/')}['\`]`);
    
    if (content.match(regex)) {
      foundEndpoints.push(endpoint);
    } else {
      missingEndpoints.push(endpoint);
    }
  });
  
  return { found: foundEndpoints, missing: missingEndpoints };
}

// Validate database tables in migration file
function validateDatabaseTables(content) {
  const foundTables = [];
  const missingTables = [];
  
  expectedDatabaseTables.forEach(tableName => {
    const regex = new RegExp(`CREATE TABLE\\s+${tableName}\\b`, 'i');
    if (content.match(regex)) {
      foundTables.push(tableName);
    } else {
      missingTables.push(tableName);
    }
  });
  
  return { found: foundTables, missing: missingTables };
}

// Validate workflow stages
function validateWorkflowStages(content) {
  const foundStages = [];
  const missingStages = [];
  
  expectedWorkflowStages.forEach(stage => {
    if (content.includes(stage)) {
      foundStages.push(stage);
    } else {
      missingStages.push(stage);
    }
  });
  
  return { found: foundStages, missing: missingStages };
}

// Main validation function
function validateFeature() {
  console.log('📁 Validating Files...');
  
  Object.entries(expectedFiles).forEach(([filePath, description]) => {
    if (checkFileExists(filePath)) {
      const content = readFileContent(filePath);
      if (content) {
        // Validate naming convention
        const namingValidation = validateNamingConvention(content, filePath);
        if (namingValidation.valid) {
          validationResults.files.passed++;
          console.log(`  ✅ ${filePath} - ${description}`);
          
          // Additional validations for specific files
          if (filePath === 'src/types/workflow.types.ts') {
            const missingInterfaces = validateTypeScriptInterfaces(content);
            if (missingInterfaces.length > 0) {
              console.log(`    ⚠️  Missing interfaces: ${missingInterfaces.join(', ')}`);
            }
          }
          
          if (filePath === 'backend/src/routes/workflow.routes.ts') {
            const endpointValidation = validateApiEndpoints(content);
            validationResults.apiEndpoints.passed += endpointValidation.found.length;
            validationResults.apiEndpoints.failed += endpointValidation.missing.length;
            validationResults.apiEndpoints.missing.push(...endpointValidation.missing);
          }
          
          if (filePath === 'backend/supabase/migrations/20250117000000_11_create_workflow_tables.sql') {
            const tableValidation = validateDatabaseTables(content);
            validationResults.databaseTables.passed += tableValidation.found.length;
            validationResults.databaseTables.failed += tableValidation.missing.length;
            validationResults.databaseTables.missing.push(...tableValidation.missing);
            
            const stageValidation = validateWorkflowStages(content);
            validationResults.workflowStages.passed += stageValidation.found.length;
            validationResults.workflowStages.failed += stageValidation.missing.length;
            validationResults.workflowStages.missing.push(...stageValidation.missing);
          }
        } else {
          validationResults.files.failed++;
          console.log(`  ❌ ${filePath} - ${namingValidation.error}`);
        }
      } else {
        validationResults.files.failed++;
        console.log(`  ❌ ${filePath} - File exists but could not be read`);
      }
    } else {
      validationResults.files.missing.push(filePath);
      console.log(`  ❌ ${filePath} - File not found`);
    }
  });
  
  console.log('\n🔌 Validating API Endpoints...');
  console.log(`  ✅ Found: ${validationResults.apiEndpoints.passed} endpoints`);
  if (validationResults.apiEndpoints.failed > 0) {
    console.log(`  ❌ Missing: ${validationResults.apiEndpoints.failed} endpoints`);
    validationResults.apiEndpoints.missing.forEach(endpoint => {
      console.log(`    - ${endpoint}`);
    });
  }
  
  console.log('\n🗄️  Validating Database Tables...');
  console.log(`  ✅ Found: ${validationResults.databaseTables.passed} tables`);
  if (validationResults.databaseTables.failed > 0) {
    console.log(`  ❌ Missing: ${validationResults.databaseTables.failed} tables`);
    validationResults.databaseTables.missing.forEach(table => {
      console.log(`    - ${table}`);
    });
  }
  
  console.log('\n🔄 Validating Workflow Stages...');
  console.log(`  ✅ Found: ${validationResults.workflowStages.passed} stages`);
  if (validationResults.workflowStages.failed > 0) {
    console.log(`  ❌ Missing: ${validationResults.workflowStages.failed} stages`);
    validationResults.workflowStages.missing.forEach(stage => {
      console.log(`    - ${stage}`);
    });
  }
  
  // Summary
  console.log('\n📊 Validation Summary:');
  const totalFiles = Object.keys(expectedFiles).length;
  const filesPassed = validationResults.files.passed;
  const filesFailed = validationResults.files.failed + validationResults.files.missing.length;
  
  console.log(`  📁 Files: ${filesPassed}/${totalFiles} passed (${Math.round(filesPassed/totalFiles*100)}%)`);
  console.log(`  🔌 API Endpoints: ${validationResults.apiEndpoints.passed}/${expectedApiEndpoints.length} found`);
  console.log(`  🗄️  Database Tables: ${validationResults.databaseTables.passed}/${expectedDatabaseTables.length} found`);
  console.log(`  🔄 Workflow Stages: ${validationResults.workflowStages.passed}/${expectedWorkflowStages.length} found`);
  
  const overallScore = (filesPassed + validationResults.apiEndpoints.passed + 
                       validationResults.databaseTables.passed + 
                       validationResults.workflowStages.passed) / 
                      (totalFiles + expectedApiEndpoints.length + 
                       expectedDatabaseTables.length + 
                       expectedWorkflowStages.length) * 100;
  
  console.log(`\n🎯 Overall Implementation Score: ${Math.round(overallScore)}%`);
  
  if (overallScore >= 90) {
    console.log('🎉 Excellent! The workflow feature has been implemented successfully!');
    console.log('\n📋 Next Steps:');
    console.log('  1. Run database migrations: npm run db:migrate');
    console.log('  2. Start the development server: npm run dev');
    console.log('  3. Visit /workflow-demo to see the interactive demo');
    console.log('  4. Test the API endpoints with your dispute data');
    console.log('  5. Customize workflow stages for your specific needs');
  } else if (overallScore >= 70) {
    console.log('⚠️  Good progress! Some components may need attention.');
    console.log('   Check the missing items above and complete the implementation.');
  } else {
    console.log('❌ Implementation incomplete. Please review the missing components.');
  }
  
  console.log('\n✨ Feature Validation Complete!');
}

// Run validation
validateFeature();
