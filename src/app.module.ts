import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MembersModule } from './members/members.module';
import { PlayersModule } from './players/players.module';
import { CoachesModule } from './coaches/coaches.module';
import { ConfigModule } from '@nestjs/config';
import { TrainingsModule } from './trainings/trainings.module';
import { TrainingRecordsModule } from './training-records/training-records.module';
import { ConsentFormsModule } from './consent-forms/consent-forms.module';
import { MatchPerformanceModule } from './match-performance/match-performance.module';
import { UploadsModule } from './uploads/uploads.module';
import { TeamsModule } from './teams/teams.module';
import { GameRulesModule } from './game-rules/game-rules.module';
import { EventsModule } from './events/events.module';
import { SchedulesModule } from './schedules/schedules.module';
import { NotifyModule } from './notify/notify.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DATABASE_HOST,
      port: parseInt(process.env.DATABASE_PORT || '3306'),
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      entities: [],
      autoLoadEntities: true,
      synchronize: true,
    }),
    AuthModule,
    UsersModule,
    MembersModule,
    PlayersModule,
    CoachesModule,
    TeamsModule,
    GameRulesModule,
    EventsModule,
    SchedulesModule,
    TrainingsModule,
    TrainingRecordsModule,
    ConsentFormsModule,
    MatchPerformanceModule,
    UploadsModule,
    NotifyModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
