import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { Auth } from "./schemas/auth.schema";
import { Model } from "mongoose";
import {UnauthorizedException } from '@nestjs/common';


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){
    constructor(
        @InjectModel(Auth.name)
        private authModel:Model<Auth>
    ){
        super({
            jwtFromRequest:ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey:process.env.JWT_SECRET
        })
    };
    async validate(payload){
        const { id } = payload ;
        const user = await this.authModel.findById(id);
        if(!user){
            throw new UnauthorizedException("Login Needed To Enter Here")
        }
        console.log(user);
        return user;
    }
}