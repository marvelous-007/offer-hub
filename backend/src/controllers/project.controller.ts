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

export const getAllProjectsHandler = async (req: Request, res: Response) => {
  try {
    const filters = req.query;
    const projects = await projectService.getAllProjects(filters);
    return res.json({ success: true, data: projects });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getProjectByIdHandler = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const project = await projectService.getProjectById(id);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project_not_found' });
    }
    return res.json({ success: true, data: project });
  } catch (error: any) {
    return res.status(400).json({ success: false, message: error.message });
  }
};