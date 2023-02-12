import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PostingsModule } from '../postings/postings.module';
import { ReviewsModule } from '../reviews/reviews.module';
import { CompaniesController } from './companies.controller';
import { CompaniesService } from './companies.service';
import { Company, CompanySchema } from './schemas/company.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Company.name, schema: CompanySchema }]),
    ReviewsModule,
    PostingsModule,
  ],
  controllers: [CompaniesController],
  providers: [CompaniesService],
})
export class CompaniesModule {}
