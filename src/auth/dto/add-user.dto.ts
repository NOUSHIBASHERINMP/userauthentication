

import { IsString, IsNotEmpty, IsEmail, MinLength } from 'class-validator';

export class adduserDto {
  @IsNotEmpty()  
  @IsString()
 readonly username: string;

  @IsNotEmpty() 
  @IsString()
  @MinLength(6)
readonly password: string;

  @IsNotEmpty() 
  @IsString()
 readonly phone: string;

  @IsNotEmpty() 
  @IsEmail({},{message:"Please Enter Correct Email"})
   readonly email: string;
}


