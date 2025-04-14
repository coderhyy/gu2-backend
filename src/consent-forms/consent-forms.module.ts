import { Module } from '@nestjs/common';
import { ConsentFormsService } from './consent-forms.service';
import { ConsentFormsController } from './consent-forms.controller';

@Module({
  controllers: [ConsentFormsController],
  providers: [ConsentFormsService],
})
export class ConsentFormsModule {}
