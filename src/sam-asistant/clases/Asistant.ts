import OpenAI from "openai";


export class Asistant {


    constructor(private openai: OpenAI, private threadId?:string,private assistantId = "asst_GpJRHA8niItESnhrOqBUYIPS") { 
        if (!this.threadId) {
            this.createThread().then((thread) => {
                this.threadId = thread.id;
            });
        }
    }
    get ThreadId() {
        return this.threadId;
    }

   

    public async getMessages() {
        if (this.ThreadId.length === 0) {
            throw new Error("Thread is required");
        }
        const messageList = await this.openai.beta.threads.messages.list(this.threadId);
        const messages = messageList.data.map((message) => ({
            role: message.role,
            content: message.content.map(content => (content as any).text.value)
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
        const messages = await this.getMessages();
        return messages.reverse

    }


    private async createThread() {
        const thread = await this.openai.beta.threads.create();
        return thread;
    }

    private createMessage (content:string) {
        const message = this.openai.beta.threads.messages.create(this.threadId, {
            content: content,
            role: "user"
        });
        return message;
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
            return runStatus;
        }
        await new Promise(resolve => setTimeout(resolve, 1000));
        return await this.checkStatusRun(runId);

    }

}