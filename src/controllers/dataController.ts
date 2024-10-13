import { Request, Response } from 'express';
import { PaginateOptions } from 'mongoose';
import Data from '../models/Data';
import { logger } from '../utils/logger';

export const createData = async (req: Request, res: Response): Promise<void> => {
  try {
    const newData = new Data(req.body);
    const savedData = await newData.save();
    res.status(201).json(savedData);
  } catch (error) {
    logger.error('Error in createData:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Implement updateData and deleteData functions similarly

// Utility to handle pagination options
const getPaginationOptions = (query: any): PaginateOptions => {
  const {
    page = 1, 
    limit = 10, 
    sort = 'createdAt',
    order = 'asc', 
  } = query;

  return {
    page: Number(page) || 1,
    limit: Number(limit) || 10,
    sort: { [sort]: order === 'desc' ? -1 : 1 },
  };
};

// Controller for fetching paginated data
export const getData = async (req: Request, res: Response): Promise<void> => {
  try {
    const paginationOptions = getPaginationOptions(req.query);

    // Total documents count
    const totalCount = await Data.countDocuments();

    // Total pages calculation (force `limit` to be a number)
    const totalPages = Math.ceil(totalCount / (paginationOptions.limit || 10));

    // Validate requested page
    if (paginationOptions.page == null || paginationOptions.page > totalPages) {
       res.status(400).json({
        message: `Requested page exceeds available pages. Only ${totalPages} pages available.`,
        totalPages,
      });
      return
    }

    // Fetch paginated data
    const data = await Data.paginate({}, paginationOptions);

    // Return the paginated data along with meta information
    res.status(200).json({
      data: data.docs,
      meta: {
        currentPage: paginationOptions.page,
        totalPages,
        totalCount,
        limit: paginationOptions.limit || 10, // Ensuring `limit` is valid in the response as well
      },
    });
  } catch (error) {
    console.error('Error fetching data:', error); // Log error for internal tracking
    res.status(500).json({ message: 'Internal server error' });
  }
};