import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { Mongoose } from 'mongoose';
import { AuthSchema } from './schemas/auth.schema';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JwtStrategy } from './jwt.strategy';
import { JwtGuard } from './jwt.guard';


@Module({
  imports:[
    AuthModule,
    PassportModule.register({
      defaultStrategy:'jwt'
    }),
    JwtModule.registerAsync({
      inject:[ConfigService],
      useFactory:(config:ConfigService) => {
        return {
          secret:config.get<string>('JWT_SECRET'),
          signOptions:{
            expiresIn:config.get<string | number>('JWT_EXPIRES'),
          },
        };
      },
    }),
    MongooseModule.forFeature([{name:'Auth' , schema:AuthSchema}])],
  controllers: [AuthController],
  providers:[AuthService,JwtStrategy,JwtGuard],
  exports:[JwtStrategy,PassportModule],
})
export class AuthModule {}
