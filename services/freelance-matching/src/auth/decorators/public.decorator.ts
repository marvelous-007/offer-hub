import { SetMetadata } from '@nestjs/common';

/**
 * Public route decorator
 * @description Marks a route or resolver as public (no authentication required)
 */
export const Public = () => SetMetadata('isPublic', true);
