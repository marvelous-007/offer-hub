-- Migration: Create workflow tables for dispute resolution tracking
-- This migration creates the workflow_stages and workflow_progress tables
-- to track the progress of dispute resolution workflows

-- Create workflow_stages table to define available workflow stages
CREATE TABLE workflow_stages (
    -- Unique identifier for each workflow stage
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Human-readable name of the workflow stage
    stage_name VARCHAR(100) NOT NULL UNIQUE,
    
    -- Description of what happens in this stage
    description TEXT,
    
    -- Order of this stage in the workflow sequence
    stage_order INTEGER NOT NULL,
    
    -- Whether this stage is currently active/available
    is_active BOOLEAN NOT NULL DEFAULT true,
    
    -- When this stage definition was created
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- When this stage definition was last updated
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create workflow_progress table to track progress through dispute resolution workflows
CREATE TABLE workflow_progress (
    -- Unique identifier for each progress entry
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Reference to the dispute this progress belongs to
    dispute_id UUID NOT NULL,
    
    -- Reference to the specific workflow stage
    stage_id UUID NOT NULL REFERENCES workflow_stages(id) ON DELETE CASCADE,
    
    -- Progress percentage (0-100) within the current stage
    progress_percentage INTEGER NOT NULL DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
    
    -- Milestone description for this progress update
    milestone VARCHAR(100),
    
    -- Additional notes about the progress made
    notes TEXT,
    
    -- When this progress entry was last updated
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- User who made this progress update
    updated_by UUID NOT NULL REFERENCES users(id),
    
    -- When this progress entry was created
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX idx_workflow_progress_dispute_id ON workflow_progress(dispute_id);
CREATE INDEX idx_workflow_progress_stage_id ON workflow_progress(stage_id);
CREATE INDEX idx_workflow_progress_updated_by ON workflow_progress(updated_by);
CREATE INDEX idx_workflow_stages_stage_order ON workflow_stages(stage_order);
-- Add comments to tables for documentation
COMMENT ON TABLE workflow_stages IS 'Defines the available stages in dispute resolution workflows';
COMMENT ON TABLE workflow_progress IS 'Tracks the progress of disputes through workflow stages';

-- Add comments to workflow_stages columns
COMMENT ON COLUMN workflow_stages.id IS 'Unique identifier for each workflow stage';
COMMENT ON COLUMN workflow_stages.stage_name IS 'Human-readable name of the workflow stage (e.g., "Initial Review", "Evidence Collection")';
COMMENT ON COLUMN workflow_stages.description IS 'Detailed description of what happens in this stage';
COMMENT ON COLUMN workflow_stages.stage_order IS 'Sequential order of this stage in the workflow (1, 2, 3, etc.)';
COMMENT ON COLUMN workflow_stages.is_active IS 'Whether this stage is currently available for use in workflows';
COMMENT ON COLUMN workflow_stages.created_at IS 'Timestamp when this stage definition was created';
COMMENT ON COLUMN workflow_stages.updated_at IS 'Timestamp when this stage definition was last modified';

-- Add comments to workflow_progress columns
COMMENT ON COLUMN workflow_progress.id IS 'Unique identifier for each progress entry';
COMMENT ON COLUMN workflow_progress.dispute_id IS 'Reference to the dispute this progress entry belongs to';
COMMENT ON COLUMN workflow_progress.stage_id IS 'Reference to the specific workflow stage this progress relates to';
COMMENT ON COLUMN workflow_progress.progress_percentage IS 'Progress percentage (0-100) within the current stage';
COMMENT ON COLUMN workflow_progress.milestone IS 'Optional milestone description for this progress update';
COMMENT ON COLUMN workflow_progress.notes IS 'Additional notes or comments about the progress made';
COMMENT ON COLUMN workflow_progress.updated_at IS 'Timestamp when this progress entry was last updated';
COMMENT ON COLUMN workflow_progress.updated_by IS 'User who made this progress update';
COMMENT ON COLUMN workflow_progress.created_at IS 'Timestamp when this progress entry was created';

