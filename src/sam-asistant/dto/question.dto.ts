import {  IsString } from "class-validator";


export class QuestionDto {


  @IsString()
  IdAsistant:string;

  @IsString()
  Id_Usuario:string;

  @IsString()
  readonly question: string;    
 

}