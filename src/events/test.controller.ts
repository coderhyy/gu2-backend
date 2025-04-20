import { Controller, Get, Post, UseGuards, Req, Logger } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Request } from 'express';

@Controller('test-events')
export class TestEventsController {
  private readonly logger = new Logger(TestEventsController.name);

  @Get()
  findAll() {
    return { message: '测试成功' };
  }
  
  @Post('manual-check')
  @UseGuards(JwtAuthGuard)
  adminOnlyManual(@Req() req: any) {
    this.logger.log(`User in request: ${JSON.stringify(req.user)}`);
    
    // 手动检查角色
    if (req.user && req.user.member_type === 'admin') {
      return { 
        message: '创建成功，您是管理员',
        user: req.user
      };
    } else {
      return { 
        message: '创建成功，但您不是管理员', 
        role: req.user ? req.user.member_type : 'unknown',
        user: req.user
      };
    }
  }
  
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  adminOnly() {
    return { message: '创建成功，角色验证通过' };
  }
} 