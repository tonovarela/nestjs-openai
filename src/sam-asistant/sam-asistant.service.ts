import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import { QuestionDto } from './dto/question.dto';

import { Assistant } from './clases/Assistant';




@Injectable()
export class SamAsistantService {
  private readonly openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });



  async createThread() {
    const asistantInstance = new Assistant(this.openai, "")
    return asistantInstance.ThreadId;
  }

  async getMessages(threadId: string, limit?: number) {    
    const asistantInstance = new Assistant(this.openai, threadId);
    const isValidThread =await asistantInstance.isValidThread();
    if (!isValidThread) {
      return { error: "Thread no valido", messages: [] };
    }
    return  asistantInstance.getMessages(limit);
    
  }

  async userQuestion(questionDTO: QuestionDto) {
    const { threadId, question } = questionDTO;
    const asistantInstance = new Assistant(this.openai, threadId);
    return asistantInstance.makeQuestion(question);
  }



  async listAsistants() {
    const asistants = await this.openai.beta.assistants.list();
    return asistants.data;
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
