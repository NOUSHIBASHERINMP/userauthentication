import { IsString, IsNotEmpty } from 'class-validator';

export class LoginDto {
  @IsNotEmpty()  
  @IsString()
 readonly email: string;

  @IsNotEmpty() 
  @IsString()
  
readonly password: string;

}