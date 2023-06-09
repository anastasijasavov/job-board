import { OmitType } from '@nestjs/mapped-types';
import { ReviewDto } from './review.dto';

export class ReviewUpdateDto extends OmitType(ReviewDto, [
  'id',
  'userId',
  'companyId',
  'datePosted',
] as const) {}
