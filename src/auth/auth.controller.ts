import { Body, Controller,Get, Param, Post,Put,Delete,Query, UseGuards, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Auth } from './schemas/auth.schema';
import { adduserDto } from './dto/add-user.dto';
import { LoginDto } from './dto/login.dto';
import{ Query as ExpressQuery} from 'express-serve-static-core';
import { JwtGuard } from './jwt.guard';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService){}
    @Get()
    async getAllAuthenticaters(@Query() query: ExpressQuery): Promise<Auth[]>{
        return this.authService.findall(query);

    }
    @Post()
    async createAccount(
      @Body()
      adduserDto:adduserDto
    ):Promise<Auth>{
        console.log('hello');
        return this.authService.create(adduserDto);
    }

    @Get(':id')
    async getUser(
        @Param('id')
        id:string
    ): Promise<Auth>{
        return this.authService.findById(id);

    };

    @Put(':id')
    async updateUser(
        @Param('id')
        id:string,
        @Body()
        adduserDto:adduserDto
    ): Promise<Auth>{
        return this.authService.updateById(id,adduserDto);

    };

    @Delete(':id')
    async deleteUserDetails(
        @Param('id')
        id:string
    ){
         this.authService.deleteById(id);
         return `You Have SuccessFully Deleted`

    };

    @Post('signup')
    async signup(
      @Body()
      adduserDto:adduserDto
    ):Promise<{ token : string}>{
     return this.authService.signUpUser(adduserDto);
     
    }

    @Post('login')
    @UseGuards(JwtGuard)
    async login(
      @Body()
      loginDto:LoginDto
    ):Promise<{ token : string}>{
     return this.authService.login(loginDto);
     
    };
     @Post('logout')
    @UseGuards(JwtGuard)
    async logout(@Req() req) {
      return { message: 'Logout successful' };
    }
  }

    


