import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Location, LocationSchema } from '../../common/schemas';

export type CompanyDocument = HydratedDocument<Company>;

@Schema({
  virtuals: {
    rating: function (): number {
      return this.ratingsCount === 0 ? 0 : this.ratingsSum / this.ratingsCount;
    },
  },
  toObject: {
    transform: (doc, ret, options) => {
      delete ret.ratingsSum;
      return { ...ret, rating: doc.rating };
    },
  },
})
export class Company {
  _id: mongoose.Types.ObjectId;

  @Prop({ required: true, index: true, unique: true })
  name: string;

  @Prop({ required: true, lowercase: true, unique: true })
  email: string;

  @Prop()
  website: string;

  @Prop()
  description: string;

  @Prop({ type: [LocationSchema], _id: false })
  offices: Location[];

  @Prop({ default: 0 })
  ratingsSum: number;

  @Prop({ default: 0 })
  ratingsCount: number;
}

export const CompanySchema = SchemaFactory.createForClass(Company);
