import mongoose, { PaginateModel, Document } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';


export interface IData extends Document {
  isbn: string; 
  title: string;
  subtitle: string; 
  author: string; 
  published: Date; 
  publisher: string; 
  pages: number; 
  description: string;
  website: string; 
  updatedAt: Date;
  createdBy:mongoose.Schema.Types.ObjectId,
}

const DataSchema = new mongoose.Schema<IData>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  isbn: { type: String, required: true },
  subtitle: { type: String, required: true },
  author: { type: String, required: true },
  published: { type: Date, required: true },
  publisher: { type: String, required: true },
  pages: { type: Number, required: true },
  website: { type: String, required: true },
  updatedAt: { type: Date, default: Date.now },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
});

// Apply the pagination plugin
DataSchema.plugin(mongoosePaginate);

// Export the model with pagination support
const DataModel = mongoose.model<IData, PaginateModel<IData>>('Data', DataSchema);

export default DataModel;
