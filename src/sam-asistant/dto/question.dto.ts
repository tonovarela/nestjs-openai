import {  IsString } from "class-validator";


export class QuestionDto {


  @IsString()
  IdAsistant:string;

  @IsString()
  userId:string;

  @IsString()
  readonly question: string;    
 

}