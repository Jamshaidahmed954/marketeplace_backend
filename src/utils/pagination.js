/**
 * Pagination Utility
 *
 * Provides two helpers:
 *  1. getPaginationParams  – parses page/limit from the request query and builds
 *                            the `skip` / `take` values needed by Prisma.
 *  2. buildPaginationMeta  – builds the meta object that is returned inside the
 *                            response payload so clients can render page controls.
 *
 * Usage in a controller / service:
 *
 *   import { getPaginationParams, buildPaginationMeta } from '../../utils/pagination.js';
 *
 *   const { page, limit, skip } = getPaginationParams(req.query);
 *
 *   const [total, items] = await Promise.all([
 *       prismaClient.product.count(),
 *       prismaClient.product.findMany({ skip, take: limit }),
 *   ]);
 *
 *   const meta = buildPaginationMeta({ page, limit, total });
 *   sendSuccess(res, { data: items, meta });
 */

const DEFAULT_PAGE  = 1;
const DEFAULT_LIMIT = 10;
const MAX_LIMIT     = 100;

/**
 * Parse pagination query params from an Express request.
 * @param {{ page?: string|number, limit?: string|number }} query
 * @returns {{ page: number, limit: number, skip: number }}
 */
const getPaginationParams = (query = {}) => {
    let page  = parseInt(query.page,  10);
    let limit = parseInt(query.limit, 10);

    if (isNaN(page)  || page  < 1) page  = DEFAULT_PAGE;
    if (isNaN(limit) || limit < 1) limit = DEFAULT_LIMIT;
    if (limit > MAX_LIMIT)         limit = MAX_LIMIT;

    const skip = (page - 1) * limit;

    return { page, limit, skip };
};

/**
 * Build the pagination meta object to embed in the API response.
 * @param {{ page: number, limit: number, total: number }} params
 * @returns {{ page: number, limit: number, total: number, totalPages: number, hasNextPage: boolean, hasPrevPage: boolean }}
 */
const buildPaginationMeta = ({ page, limit, total }) => {
    const totalPages  = Math.ceil(total / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    return {
        page,
        limit,
        total,
        totalPages,
        hasNextPage,
        hasPrevPage,
    };
};

export { getPaginationParams, buildPaginationMeta };
