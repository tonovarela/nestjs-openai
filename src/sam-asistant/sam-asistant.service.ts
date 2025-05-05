import { Injectable, OnModuleInit } from '@nestjs/common';
import OpenAI from 'openai';
import { QuestionDto } from './dto/question.dto';
import { Assistant } from './clases/Assistant';
import { concatMap, delay, from,  Observable, of } from 'rxjs';
import { PrismaClient } from '@prisma/client';



@Injectable()
export class SamAsistantService extends PrismaClient implements OnModuleInit {
  
  onModuleInit() {      
     this.$connect();
  }
  
  private readonly openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  
  private async getThreadIdUser(Id_Usuario: string, IdAsistant: string) {    
    const userDB= await this.openAIUsers.findFirst({where: { Id_Usuario: +Id_Usuario ,assistant_id: IdAsistant }});     
     let threadId =userDB?.thread_id || "";     
     const asistantInstance = new Assistant(this.openai,threadId,IdAsistant);    
      const isValidThread = await asistantInstance.isValidThread();
      if (!isValidThread) {
        await asistantInstance.initThread();        
        threadId = asistantInstance.ThreadId;        
        await this.openAIUsers.create({
          data: {
            Id_Usuario: +Id_Usuario,
            assistant_id: IdAsistant,          
            thread_id: threadId
          },
        })      
      } 
      return threadId;

  }
  getMessagesData(): Observable<any> {
    return from(["H", "o", "l", "a", " ", " "])
      .pipe(concatMap(num => of(num).pipe(delay(2000))));
  }

  // async createThread() {
  //   const asistantInstance = new Assistant(this.openai, "");
  //   await asistantInstance.initThread();
  //   return asistantInstance.ThreadId;
  // }

  // async getMessages(threadId: string, limit?: number) {
  //   const asistantInstance = new Assistant(this.openai, threadId);
  //   const isValidThread = await asistantInstance.isValidThread();
  //   if (!isValidThread) {
  //     return { error: "Thread no valido", messages: [] };
  //   }
  //   return asistantInstance.getMessages(limit);

  // }

  async getMessagesPerUser(Id_Usuario: string, Id_Asistant,limit?: number) {

    const threadId = await this.getThreadIdUser(Id_Usuario,Id_Asistant);    
    const asistantInstance = new Assistant(this.openai, threadId);
    const isValidThread = await asistantInstance.isValidThread();
    if (!isValidThread) {
      return { error: "Thread no valido", messages: [] };
    }
    return asistantInstance.getMessages(limit);

  }

  async userQuestion(questionDTO: QuestionDto) {
    const { Id_Usuario,IdAsistant, question } = questionDTO;            
    const threadId = await this.getThreadIdUser(Id_Usuario,IdAsistant);    
    const asistantInstance = new Assistant(this.openai,threadId,IdAsistant);        
    return asistantInstance.makeQuestion(question);
  }



  // async listAsistants() {
  //   const asistants = await this.openai.beta.assistants.list();
  //   return asistants.data;
  // }



  async *userQuestionStream(questionDTO: QuestionDto) {
    const {  question } = questionDTO;
    const  threadId = await this.getThreadIdUser(questionDTO.Id_Usuario,questionDTO.IdAsistant);
    const asistantInstance = new Assistant(this.openai, threadId);
    const stream = asistantInstance.createRunStream(question);
            for await (const chunk of stream) {
                yield chunk;
            }          
  }


}
