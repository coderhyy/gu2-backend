import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConsentFormsService } from './consent-forms.service';
import { ConsentFormsController } from './consent-forms.controller';
import { ConsentForm } from './entities/consent-form.entity';
import { Player } from '../players/entities/player.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ConsentForm, Player])
  ],
  controllers: [ConsentFormsController],
  providers: [ConsentFormsService],
  exports: [ConsentFormsService]
})
export class ConsentFormsModule {}
