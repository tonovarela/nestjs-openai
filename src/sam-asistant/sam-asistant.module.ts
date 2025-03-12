import { Module } from '@nestjs/common';
import { SamAsistantService } from './sam-asistant.service';
import { SamAsistantController } from './sam-asistant.controller';

@Module({
  controllers: [SamAsistantController],
  providers: [SamAsistantService],
})
export class SamAsistantModule {}
