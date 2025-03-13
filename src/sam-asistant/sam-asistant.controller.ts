import { Body, Controller, Get, Param, Post, Res, StreamableFile } from '@nestjs/common';
import { SamAsistantService } from './sam-asistant.service';
import { QuestionDto } from './dto/question.dto';


@Controller('sam-asistant')
export class SamAsistantController {
  constructor(private readonly samAsistantService: SamAsistantService) { }



  @Post('create-thread') async createThread() {
    return this.samAsistantService.createThread();    
  }


  @Post('user-question') async userQuestion(@Body() questionDto: QuestionDto) {
    return this.samAsistantService.userQuestion(questionDto);    
  }

  @Get('get-messages/:threadId') async getMessages(@Param("threadId") threadId: string) {    
    return this.samAsistantService.getMessages(threadId);
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
