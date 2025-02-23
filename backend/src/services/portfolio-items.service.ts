import { v4 as uuidv4 } from "uuid";
import {
  CreatePortfolioItemDto,
  UpdatePortfolioItemDto,
} from "../dtos/portfolio-items.dto";
import { PortfolioItemEntity } from "../entities/portfolio-items.entity";

const portfolioItems: PortfolioItemEntity[] = [];

const getAll = (): PortfolioItemEntity[] => portfolioItems;

const create = (data: CreatePortfolioItemDto): PortfolioItemEntity => {
  const newPortfolioItem = new PortfolioItemEntity({
    portfolio_item_id: uuidv4(),
    ...data,
    created_at: new Date(),
  });
  portfolioItems.push(newPortfolioItem);
  return newPortfolioItem;
};

const getById = (id: string): PortfolioItemEntity | undefined =>
  portfolioItems.find((item) => item.portfolio_item_id === id);

const update = (
  id: string,
  data: UpdatePortfolioItemDto
): PortfolioItemEntity | null => {
  const index = portfolioItems.findIndex(
    (item) => item.portfolio_item_id === id
  );
  if (index === -1) return null;
  portfolioItems[index] = { ...portfolioItems[index], ...data };
  return portfolioItems[index];
};

const deletePortfolioItem = (id: string): boolean => {
  const index = portfolioItems.findIndex(
    (item) => item.portfolio_item_id === id
  );
  if (index === -1) return false;
  portfolioItems.splice(index, 1);
  return true;
};

export default { getAll, create, getById, update, delete: deletePortfolioItem };
