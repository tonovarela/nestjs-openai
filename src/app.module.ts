import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';


//import { GptModule } from './gpt/gpt.module';
import { SamAsistantModule } from './sam-asistant/sam-asistant.module';


@Module({
  imports: [
    ConfigModule.forRoot(),
<<<<<<< HEAD
    
=======
>>>>>>> 3c458dbd9a48a02e85201f7715159c34c7d6065c
    //GptModule,
    SamAsistantModule,
  ]
})
export class AppModule {}
