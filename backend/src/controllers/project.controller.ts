import { Request, Response } from 'express';
import * as projectService from '@/services/project.service';

export const createProjectHandler = async (req: Request, res: Response) => {
  try {
    const project = await projectService.createProject(req.body);
    return res.status(201).json({
      success: true,
      message: 'Project_created_successfully',
      data: project,
    });
  } catch (error: any) {
    return res.status(400).json({ success: false, message: error.message });
  }
};