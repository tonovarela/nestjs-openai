import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';

//import { GptModule } from './gpt/gpt.module';
import { SamAsistantModule } from './sam-asistant/sam-asistant.module';


@Module({
  imports: [
    ConfigModule.forRoot(),
    EventEmitterModule.forRoot(),
    //GptModule,
    SamAsistantModule,
  ]
})
export class AppModule {}
