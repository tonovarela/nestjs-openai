import { Injectable } from '@nestjs/common';


import OpenAI from 'openai';

import { QuestionDto } from './dto/question.dto';

import { Asistant } from './clases/Asistant';


@Injectable()
export class SamAsistantService {
  private openai = new OpenAI({apiKey: process.env.OPENAI_API_KEY});

    async createThread(){
        const asistantInstance = new Asistant(this.openai,"")
        return asistantInstance.ThreadId;
    }


    async userQuestion(questionDTO:QuestionDto){
      const {threadId,question} = questionDTO;      
        const asistantInstance = new Asistant(this.openai,threadId);        
        await asistantInstance.userQuestion(question);
        const messages =asistantInstance.getMessages();
        
        return messages;
    }


}
