import {
  CompanyCreateDto,
  CompanySearchQueryDto,
  CompanyUpdateDto,
} from './dto';
import { forwardRef, Inject, Injectable, Scope } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import mongoose, { Connection, Error, Model } from 'mongoose';
import { transactionHandler } from '../common/mongoose-helpers';
import { Company, CompanyDocument } from './schemas';

@Injectable()
export class CompaniesService {
  constructor(
    @InjectModel(Company.name) private companyModel: Model<CompanyDocument>,
    @InjectConnection() private readonly connection: Connection,
  ) {}

  findById(id: string): Promise<Company> {
    return this.companyModel.findById(id).orFail().exec();
  }

  findByEmail(email: string): Promise<Company> {
    return this.companyModel.findOne({ email }).lean().exec();
  }

  search(queryDto: CompanySearchQueryDto): Promise<Company[]> {
    const match: Record<string, any> = {};

    if (queryDto.name) {
      match['name'] = { $regex: '^' + queryDto.name, $options: 'i' };
    }
    if (queryDto.rating) {
      match['rating'] = { $gte: queryDto.rating };
    }

    console.log(match);

    return this.companyModel
      .aggregate()
      .addFields({
        rating: {
          $cond: [
            { $eq: ['$ratingsCount', 0] },
            0,
            { $divide: ['$ratingsSum', '$ratingsCount'] },
          ],
        },
      })
      .match(match)
      .sort({ rating: -1 })
      .limit(10)
      .exec();
  }

  update(id: string, dto: CompanyUpdateDto): Promise<Company> {
    return this.companyModel
      .findByIdAndUpdate(id, dto, { new: true })
      .orFail()
      .exec();
  }

  delete(id: string) {
    return transactionHandler(this.connection, async (session) => {
      return this.companyModel
        .findByIdAndDelete(id)
        .orFail()
        .session(session)
        .exec();
    });
  }
}
