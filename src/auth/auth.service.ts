

import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import mongoose, { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Auth } from './schemas/auth.schema';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import {  adduserDto } from './dto/add-user.dto';
import { LoginDto } from './dto/login.dto';

import{ Query } from 'express-serve-static-core';


@Injectable()
export class AuthService {
  constructor(@InjectModel(Auth.name) private  authModel: Model<Auth>,
  private jwtService:JwtService 
  ) {}

  async findall(query:Query): Promise<Auth[]> {

    const keyword = query.keyword?{
      username:{
        $regex: query.keyword,
      },
    }:{};
    const details = await this.authModel.find({...keyword}).exec();
    return details;
  }

  async create(adduserDto: adduserDto): Promise<Auth> {
    try {
        
      const createdAuth = new this.authModel(adduserDto);
      console.log(createdAuth);
     const created = await createdAuth.save();
    return created;
    } catch (error) {
      throw new BadRequestException('Require Right one');
    }
    
  }
  async findById(id: string): Promise<Auth> {
    const isValidId = mongoose.isValidObjectId(id)
    if(!isValidId){
      throw new BadRequestException('Please Enter Correct ');
    }

    const tookById = await this.authModel.findById(id);

    if(!tookById){
      throw new NotFoundException('User Not Found');
    }
    return tookById;
  }

  async updateById(id: string,adduserDto:adduserDto): Promise<Auth> {
   
   const updated =await  this.authModel.findByIdAndUpdate(id,adduserDto,{
    new:true,
    runValidators:true
   });
   return updated.save();

  };

  async deleteById(id: string) {
    const isValidId = mongoose.isValidObjectId(id)
    if(!isValidId){
      throw new BadRequestException('Please Enter Correct');
    }
    
      await this.authModel.findByIdAndDelete(id);
    
 
   };


  async signUpUser(adduserDto:adduserDto):Promise<{ token : string}> {
    const {username,password,phone,email} = adduserDto
    const hashedPassword = await bcrypt.hash(password , 10)
    const user = new this.authModel({
      username,
      password:hashedPassword,
      phone,
      email,
    });
    const existingUser = await this.authModel.findOne({email});
    if(existingUser){
      throw new BadRequestException('The  Email Is already Taken');
    }else{
      await user.save();
    const token  =  this.jwtService.sign({
      id: user._id,
      
    });
    return {token}
    }
    
  };
   async login(loginDto:LoginDto):Promise<{token : string}>{
    const {email , password } = loginDto

     
    const user = await this.authModel.findOne({ email });
    if(!user){
      throw new UnauthorizedException('Invalid email Or Password');
    }
    const isPasswordMatched = await bcrypt.compare(password,user.password)
    if(!isPasswordMatched){
      throw new UnauthorizedException('Invalid email Or Password');
    }
    const token = await this.jwtService.signAsync({id:user._id});
    return {token};
    };

    // async logout():Promise<any>{
    //     const
    // }

   

    
 

}
