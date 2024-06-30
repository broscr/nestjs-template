import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { USER_TYPE } from '../utility/Constants';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop()
  profileImg: string;

  @Prop({ enum: USER_TYPE, type: [String], default: USER_TYPE.USER })
  role: USER_TYPE[];

  @Prop({ type: Date, default: new Date() })
  createdAt: Date;

  @Prop({ type: Date, default: new Date() })
  updatedAt: Date;

  @Prop({ default: false })
  isPremium: boolean;

  @Prop()
  premiumKey: string;

  @Prop()
  premiumStartDate: Date;

  @Prop()
  premiumEndDate: Date;

  @Prop({ default: false })
  isBlocked: boolean;

  @Prop({ default: new Date(), type: Date })
  lastOnline: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);

/**
 * Kullanıcı silindiğinde tetiklenir.
 * @todo Kullanıcıya ait her şeyi burada sileceğiz
 */
UserSchema.post('findOneAndDelete', async function (doc) {
  const userId = doc._id;

  console.log(`User with ID ${userId} is being deleted.`);
});
