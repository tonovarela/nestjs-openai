import { Injectable } from '@nestjs/common';


import OpenAI from 'openai';

import { QuestionDto } from './dto/question.dto';

import { Asistant } from './clases/Asistant';


@Injectable()
export class SamAsistantService {
  private openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  async createThread() {
    const asistantInstance = new Asistant(this.openai, "")
    return asistantInstance.ThreadId;
  }

  async getMessages(threadId: string) {
    const asistantInstance = new Asistant(this.openai, threadId);
    const messages = asistantInstance.getMessages();
    return messages;
  }


  async userQuestion(questionDTO: QuestionDto) {
    const { threadId, question } = questionDTO;
    const asistantInstance = new Asistant(this.openai, threadId);
    return asistantInstance.userQuestion(question);
  }


  // async *userQuestionStream(questionDTO: QuestionDto) {
  //   const { threadId, question } = questionDTO;
  //   const asistantInstance = new Asistant(this.openai, threadId);
  //   const stream = asistantInstance.createRunStream(question);
  //           for await (const chunk of stream) {
  //               yield chunk;
  //           }
    
      
  // }


}
