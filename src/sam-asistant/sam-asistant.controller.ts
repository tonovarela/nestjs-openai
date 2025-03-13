import { Body, Controller, Get, HttpException, HttpStatus,  Param, Post, Sse, } from '@nestjs/common';
import { SamAsistantService } from './sam-asistant.service';
import { QuestionDto } from './dto/question.dto';
import {  interval, map, Observable } from 'rxjs';


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


  @Sse('sse')
  sse()  {
    
    //return { data: { hello: 'world' } };
    return interval(1000).pipe(
      map((_) => ({ data: { hello: 'world' } }) as MessageEvent),
    );
  }

  // @Get('stream-text')
  // async streamText(@Body() questionDto: QuestionDto, @Res() response: Response) {
  //   response.setHeader('Content-Type', 'text/event-stream');
  //   response.setHeader('Cache-Control', 'no-cache');
  //   response.setHeader('Connection', 'keep-alive');
  //   try {
  //     const stream = this.samAsistantService.userQuestionStream(questionDto);
  //     for await (const chunk of stream) {
  //       response.write(`data: ${JSON.stringify({ data: chunk })}\n\n`);
  //     }
  //     response.end();
  //   } catch (error) {
  //     response.write(`data: ${JSON.stringify({ error: error.message })}\n\n`);
  //     response.end();
  //   }
  // }


  // @Post('streasm')
  // async createRunStream(
  //     @Body() questionDto: QuestionDto,
  //     @Res() response: Response
  // ) {

  //   const stream = new Readable();
  //   //stream.on('end', () => response.end());
  //   stream.push('Hello World');
  //   //stream.pipe(response);

  //     // response.headers.append('Content-Type', 'text/event-stream');
  //     // response.headers.append('Cache-Control', 'no-cache');
  //     // response.headers.append('Connection', 'keep-alive');

  //     // try {
  //     //     const stream = this.samAsistantService.userQuestion(questionDto);

  //     //     for await (const chunk of stream) {
  //     //         console.log(chunk);
  //     //     }

  //     // } catch (error) {
  //     //     console.log(error);
  //     // }
  //     // return [];
  // }



}
