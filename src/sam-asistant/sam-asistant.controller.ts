import { Body, Controller, Get, HttpException, HttpStatus, Param, Post, Res,Header } from '@nestjs/common';
import { SamAsistantService } from './sam-asistant.service';
import { QuestionDto } from './dto/question.dto';

import { Response } from 'express';


@Controller('sam-asistant')
export class SamAsistantController {

  constructor(private readonly samAsistantService: SamAsistantService) { }

  @Post('create-thread') async createThread() {
    return this.samAsistantService.createThread();
  }
  @Post('user-question') async question(@Body() questionDto: QuestionDto) {
    return this.samAsistantService.userQuestion(questionDto);
  }

  @Get('get-messages/:threadId') async getMessages(@Param("threadId") threadId: string) {
    const { error, messages } = await this.samAsistantService.getMessages(threadId);
    if (error !== null) {
      throw new HttpException(error, HttpStatus.NOT_FOUND);
    }
    return { messages };
  }

  @Get('list-asistants') async listAsistants() {
    return this.samAsistantService.listAsistants();
  }


  @Post('user-question-stream')
  @Header('Content-Type', 'text/event-stream')
  @Header('Cache-Control', 'no-cache')
  @Header('Connection', 'keep-alive')
  async userQuestionStream(
    @Body() questionDto: QuestionDto,
    @Res({ passthrough: true }) response: Response
  ) {    
    try {
      const stream = await this.samAsistantService.userQuestionStream(questionDto);
      let accumulatedResponse = '';
  
      for await (const chunk of stream) {      
        accumulatedResponse += chunk;
        response.write(`data: ${JSON.stringify({ 
          data: chunk,
          fullResponse: accumulatedResponse 
        })}\n\n`);      
      }
      response.end();
    } catch (error) {
      response.write(`data: ${JSON.stringify({
        error: error.message,
        timestamp: new Date().toISOString()
      })}\n\n`);
      response.end();
    }
  }





}
