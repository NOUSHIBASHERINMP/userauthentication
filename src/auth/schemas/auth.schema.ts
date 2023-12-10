import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';



@Schema({
    timestamps:true
})

export class Auth extends Document {
    
@Prop()
username:string;

@Prop()
password:string;

@Prop()
phone:string;

@Prop({
    unique:[true,'The Email Entered Is Already In Use ']

})
email:string;


}
export const AuthSchema = SchemaFactory.createForClass(Auth);

