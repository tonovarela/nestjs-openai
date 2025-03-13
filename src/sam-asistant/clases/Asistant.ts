import OpenAI from "openai";


export class Asistant {

    constructor(private openai: OpenAI, private threadId?:string,private assistantId = "asst_GpJRHA8niItESnhrOqBUYIPS") { 
        if (this.threadId.length === 0) {
            this.createThread().then((thread) => {
                this.threadId = thread.id;
            });
        }
    }

    get ThreadId() {
        return this.threadId;
    }

    private convertirFecha(fecha: number) {
        const date = new Date(fecha * 1000); // Convertir a milisegundos
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Enero es 0!
        const year = date.getFullYear();
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');

        return `${day}-${month}-${year} ${hours}:${minutes}`;
    }

   

    public async getMessages(limit?:number) {
        if (this.ThreadId.length === 0) {
            throw new Error("Thread is required");
        }
        const messageList = await this.openai.beta.threads.messages.list(this.threadId,{limit});        
        console.log(messageList);
        const messages = messageList.data.map((message) => ({
            role: message.role,
            created_at: this.convertirFecha(message.created_at),
            text: message.content.map(content => ((content as any).text.value)|| [''])[0]
        }));
        return messages.reverse();
    }


    public async userQuestion(question) {
        if (this.ThreadId.length === 0) {
            throw new Error("Thread is required");
        }        
        await this.createMessage(question);        
        const runId = await this.createRun();
        await this.checkStatusRun( runId);
        const messages = await this.getMessages(2);
        return messages     
    }


    private async createThread() {
        const thread = await this.openai.beta.threads.create();
        return thread;
    }

    private createMessage (content:string) {
          this.openai.beta.threads.messages.create(this.threadId, {
            content: content,
            role: "user"
        });                
    }

    public async *createRunStream(question: string) {
        if (this.ThreadId.length === 0) {
            throw new Error("Thread is required");
        }
            
        await this.createMessage(question);    
        
        const stream = await this.openai.beta.threads.runs.create(this.threadId, {
            assistant_id: this.assistantId,
            stream: true
        });        
        for await (const chunk of stream) {
            const delta = chunk.data["delta"];              
            if (delta !=undefined){             
                yield delta.content[0].text.value                
            }            
        }            
                        
    }

    private async createRun() {
        const run = await this.openai.beta.threads.runs.create(this.ThreadId, {
            assistant_id: this.assistantId,                
        });        
        return run.id;
    }


    private async checkStatusRun( runId: string) {
        const runStatus = await this.openai.beta.threads.runs.retrieve(this.threadId, runId);        
        if (runStatus.status === 'completed' || runStatus.status === 'failed') {
            const { prompt_tokens,completion_tokens,total_tokens} = runStatus.usage;
            console.log({ prompt_tokens,completion_tokens,total_tokens});
            return runStatus;
        }
        await new Promise(resolve => setTimeout(resolve, 1000));
        return await this.checkStatusRun(runId);

    }

}