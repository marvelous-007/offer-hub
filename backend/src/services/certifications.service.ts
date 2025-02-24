import { v4 as uuidv4 } from "uuid";
import {
  CreateCertificationDto,
  UpdateCertificationDto,
} from "../dtos/certifications.dto";
import { CertificationEntity } from "../entities/certifications.entity";

const certifications: CertificationEntity[] = [];

const getAll = (): CertificationEntity[] => certifications;

const create = (data: CreateCertificationDto): CertificationEntity => {
  const newCertification = new CertificationEntity({
    certification_id: uuidv4(),
    ...data,
    verification_status: 'pending',
    created_at: new Date(),
  });
  certifications.push(newCertification);
  return newCertification;
};

const getById = (id: string): CertificationEntity | undefined =>
  certifications.find((c) => c.certification_id === id);

const update = (
  id: string,
  data: UpdateCertificationDto
): CertificationEntity | null => {
  const index = certifications.findIndex((c) => c.certification_id === id);
  if (index === -1) return null;
  certifications[index] = { ...certifications[index], ...data };
  return certifications[index];
};

const deleteCertification = (id: string): boolean => {
  const index = certifications.findIndex((c) => c.certification_id === id);
  if (index === -1) return false;
  certifications.splice(index, 1);
  return true;
};

export default {
  getAll,
  create,
  getById,
  update,
  delete: deleteCertification,
};