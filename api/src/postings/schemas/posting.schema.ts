import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Company } from '../../companies/schemas';
import { User } from '../../users/schemas';
import { referenceValidator } from '../../common/validators';
import { Location, LocationSchema } from '../../common/schemas';

export type PostingDocument = HydratedDocument<Posting>;

@Schema({
  toObject: {
    transform: (doc, ret, opts) => {
      delete ret.applicants;
      return ret;
    },
  },
})
export class Posting {
  _id: mongoose.Types.ObjectId;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    index: true,
    required: true,
    validate: referenceValidator,
  })
  company: Company | mongoose.Types.ObjectId;

  @Prop({ type: LocationSchema, _id: false })
  location: Location;

  @Prop({ required: true })
  position: string;

  @Prop()
  description: string;

  @Prop({ default: Date.now, immutable: true })
  datePosted: Date;

  @Prop()
  dateUpdated: Date;

  @Prop({ required: true })
  remoteAvailable: boolean;

  @Prop()
  salary: string;

  @Prop([String])
  requirements: string[];

  @Prop({
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        validate: referenceValidator,
      },
    ],
  })
  applicants: User[];
}

export const PostingSchema = SchemaFactory.createForClass(Posting);
