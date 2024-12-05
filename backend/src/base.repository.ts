import {
  Model,
  FilterQuery,
  QueryOptions,
  Document,
  PopulateOptions,
} from 'mongoose';

export class BaseRepository<T extends Document> {
  constructor(private readonly model: Model<T>) {}

  async create(doc: Partial<T>): Promise<T> {
    const createdEntity = new this.model(doc);
    return await createdEntity.save();
  }

  async findById(id: string, option?: QueryOptions): Promise<T | null> {
    return this.model.findById(id, option).exec();
  }

  async findByCondition(
    filter: FilterQuery<T>,
    field?: any,
    option?: QueryOptions,
    populate?: string | PopulateOptions | Array<string | PopulateOptions>,
  ): Promise<T | null> {
    if (populate) {
      // Nếu populate là string, ép kiểu để phù hợp với PopulateOptions
      if (typeof populate === 'string') {
        populate = { path: populate };
      }
      // Ep kiểu để truyền vào populate
      return this.model
        .findOne(filter, field, option)
        .populate(populate as PopulateOptions)
        .exec();
    }
    return this.model.findOne(filter, field, option).exec();
  }

  async getByCondition(
    filter: FilterQuery<T>,
    field?: any | null,
    option?: any | null,
    populate?: any | null,
  ): Promise<T[]> {
    return this.model
      .find(filter, field, option)
      .populate(populate)
      .exec() as Promise<T[]>;
  }

  async findAll(): Promise<T[]> {
    return this.model.find().exec();
  }

  async aggregate(pipeline: any[]): Promise<any[]> {
    return this.model.aggregate(pipeline).exec();
  }

  async populate(result: T[], option: any): Promise<any> {
    return this.model.populate(result, option);
  }

  async deleteOne(id: string): Promise<any> {
    return this.model.deleteOne({ _id: id } as FilterQuery<T>).exec();
  }

  async deleteMany(ids: string[]): Promise<any> {
    return this.model
      .deleteMany({ _id: { $in: ids } } as FilterQuery<T>)
      .exec();
  }

  async deleteByCondition(filter: FilterQuery<T>): Promise<any> {
    return this.model.deleteMany(filter).exec();
  }

  async findByConditionAndUpdate(
    filter: FilterQuery<T>,
    update: Partial<T>,
  ): Promise<T | null> {
    return this.model.findOneAndUpdate(filter, update).exec();
  }

  //   async updateMany(
  //     filter: FilterQuery<T>,
  //     update: Partial<T>,
  //     option?: QueryOptions,
  //     callback?: (err: any, res: any) => void,
  //   ): Promise<any> {
  //     return this.model.updateMany(filter, update, option, callback).exec();
  //   }

  async findByIdAndUpdate(id: string, update: Partial<T>): Promise<T | null> {
    return this.model.findByIdAndUpdate(id, update).exec();
  }
  async findByConditionAll(
    filter: FilterQuery<T>,
    field?: any,
    option?: QueryOptions,
    populate?: string | PopulateOptions | Array<string | PopulateOptions>,
  ): Promise<T[]> {
    // Trả về mảng thay vì đối tượng duy nhất
    if (populate) {
      if (typeof populate === 'string') {
        populate = { path: populate };
      }
      return this.model
        .find(filter, field, option)
        .populate(populate as PopulateOptions)
        .exec();
    }
    return this.model.find(filter, field, option).exec(); // Đảm bảo đây là find chứ không phải findOne
  }

  async findByConditionCmt(
    filter: FilterQuery<T>,
    field?: any,
    option?: QueryOptions,
    populate?: string | PopulateOptions | Array<string | PopulateOptions>,
  ): Promise<T | T[]> {
    // Thay đổi kiểu trả về để có thể trả về đối tượng hoặc mảng
    if (populate) {
      if (typeof populate === 'string') {
        populate = { path: populate };
      }
      return this.model
        .find(filter, field, option)
        .populate(populate as PopulateOptions)
        .exec();
    }
    return this.model.find(filter, field, option).exec(); // Trả về mảng hoặc đối tượng tùy vào điều kiện
  }
}
