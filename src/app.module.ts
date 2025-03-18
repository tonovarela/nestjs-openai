import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';


//import { GptModule } from './gpt/gpt.module';
import { SamAsistantModule } from './sam-asistant/sam-asistant.module';


@Module({
  imports: [
    ConfigModule.forRoot(),
    //GptModule,
    SamAsistantModule,
  ]
})
export class AppModule {}
