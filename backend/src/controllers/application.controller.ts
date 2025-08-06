import { Request, Response } from 'express';
import {
  createApplication,
  getApplicationsByProject,
  updateApplicationStatus
} from '../services/application.service';

export const createApplicationHandler = async (req: Request, res: Response) => {
  try {
    const { project_id, freelancer_id, message } = req.body;
    const application = await createApplication({
      project_id,
      freelancer_id,
      message
    });
    res.status(201).json(application);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const getApplicationsByProjectHandler = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const applications = await getApplicationsByProject(id);
    res.json(applications);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const updateApplicationStatusHandler = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const application = await updateApplicationStatus(id, status);
    res.json(application);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};
