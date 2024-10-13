import { Response } from 'express';
import { PaginateOptions } from 'mongoose';
import Data from '../models/Data';
import User from '../models/User';
import { logger } from '../utils/logger';
import { getPaginationOptions } from '../utils/paginationHelper';
import { AuthRequest } from '../middlewares/auth'; // Type for authenticated request


export class DataController {

  /**
   * Create new Data
   */
  async createData(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user || req.user.role !== 'admin') {
        res.status(403).json({ message: 'Access denied: You do not have permission to perform this action.' });
        return;
      }
      const { title } = req.body;
      const existingData = await Data.findOne({ title });

      if (existingData) {
        res.status(400).json({ message: 'Data already exists' });
        return;
      }
      const newData = new Data({
        ...req.body,
        createdBy: req.user.id,
      });

      const savedData = await newData.save();
      res.status(201).json({ message: "Data Created Succesfully", data: savedData });
    } catch (error) {
      logger.error('Error in createData:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }

  /**
   * Fetch paginated Data
   */
  async getData(req: AuthRequest, res: Response): Promise<void> {
    try {
      const paginationOptions: PaginateOptions = getPaginationOptions(req.query);

      const totalCount = await Data.countDocuments();
      const totalPages = Math.ceil(totalCount / (paginationOptions.limit || 10));

      if (paginationOptions.page == null || paginationOptions.page > totalPages) {
        res.status(400).json({
          message: `Requested page exceeds available pages. Only ${totalPages} pages available.`,
          totalPages,
        });
        return;
      }

      const data = await Data.paginate({}, paginationOptions);

      res.status(200).json({
        data: data.docs,
        meta: {
          currentPage: paginationOptions.page,
          totalPages,
          totalCount,
          limit: paginationOptions.limit || 10,
        },
      });
    } catch (error) {
      logger.error('Error fetching data:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

 /**
   * Fetch All users Data
   */
  async getAllUsers(req: AuthRequest, res: Response): Promise<void> {

    try {
      const getUserDetails = await User.find()
      if(getUserDetails){
        res.status(201).json({
          message: "All user data fetched successfully ",
          data:getUserDetails
        })
    
      }
      else{
        res.status(400).json({ message: 'Gettin to trouble to fetch all users data' });
      return;
      }
      
    } catch (error) {
      logger.error('Error fetching data:', error);
      res.status(500).json({ message: 'Internal server error' });
    }

  }
  /**
   * Update existing Data
   */
  async updateData(req: AuthRequest, res: Response): Promise<void> {
    try {
      console.log("user-updatedd", req.user)
      if (!req.user || req.user.role !== 'admin') {
        res.status(403).json({ message: 'Access denied: You do not have permission to perform this action.' });
        return;
      }

      if (!req.body) {
        res.status(400).json({ message: 'Bad Request: No data provided for update.' });
        return;
      }

      const updatedData = await Data.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!updatedData) {
        res.status(404).json({ message: 'Data not found' });
        return;
      }

      res.status(200).json({ message: "Data Updated Successfully", data: updatedData });
    } catch (error) {
      logger.error('Error in updateData:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }

  /**
   * Delete Data
   */
  async deleteData(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user || req.user.role !== 'admin') {
        res.status(403).json({ message: 'Access denied: You do not have permission to perform this action.' });
        return;
      }
      const dataId =  req.query.id;
      if (!dataId) {
        res.status(400).json({ message: 'Bad request: No data ID provided.' });
        return;
      }
      const deletedData = await Data.findByIdAndDelete(dataId);
      if (!deletedData) {
        res.status(404).json({ message: 'Data not found' });
        return;
      }

      res.status(201).json({ message: "Data deleted successfully" });
    } catch (error) {
      logger.error('Error in deleteData:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
}
