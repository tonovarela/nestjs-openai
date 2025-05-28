import OpenAI from "openai";
import { formatDate } from "src/helpers";
import { GetMessagesResponse, MessageResponse } from "../interfaces/interfaces";


export class Assistant {
    private readonly DEFAULT_LIMIT = 6;

    constructor(
        private readonly openai: OpenAI,
        private threadId: string,
        private  assistantId :string
    ) {
        this.initThread();
    }

    public async initThread(): Promise<void> {
        if (!this.threadId || this.threadId.length === 0) {
            const thread = await this.createThread();            
            this.threadId = thread.id;
        }
    }

    get ThreadId(): string {
        return this.threadId;
    }

    public async isValidThread(): Promise<boolean> {
        try {            
            await this.openai.beta.threads.retrieve(this.threadId);
            return true;
        } catch {
            return false;
        }
    }

    public async getMessages(limit: number = this.DEFAULT_LIMIT): Promise<GetMessagesResponse> {
        try {
            const isValidThread = await this.isValidThread();
            if (!isValidThread) {
                return { error: "Thread no valido", messages: [] };
            }            
            const messageList = await this.openai.beta.threads.messages.list(this.threadId, { limit });
            const messages = messageList.data.map(this.formatMessage);
            return { error: null, messages: messages.reverse() };
        } catch (error) {
            return { error: error.message, messages: [] };
        }
    }

    private formatMessage(message: any): MessageResponse {
        return {
            role: message.role,
            created_at: formatDate(message.created_at),
            text: message.content[0]?.text?.value || ''
        };
    }

    public async makeQuestion(question: string) {
        const isValidThread = await this.isValidThread();
            if (!isValidThread) {
                return { error: "Thread no valido", messages: [] };
            }
        await this.createMessage(question);
        const runId = await this.createRun();
        await this.checkStatusRun(runId);
        return this.getMessages(2);
    }


    private async createRun() {
        const response= this.openai.beta.threads.runs.create(this.threadId, {
            assistant_id: this.assistantId
        });
        return (await response).id;
    }


    private async createThread() {
        return await this.openai.beta.threads.create();
    }

    
    private async createMessage(content: string) {
        return await this.openai.beta.threads.messages.create(this.threadId, {
            content,
            role: "user"
        });
    }

    public async *createRunStream(question: string) {
        //this.validateThread();
        await this.createMessage(question);

        const stream = await this.openai.beta.threads.runs.create(this.threadId, {
            assistant_id: this.assistantId,
            stream: true
        });
        for await (const chunk of stream) {
            const delta = chunk.data["delta"];
            if (delta?.content?.[0]?.text?.value) {
                yield delta.content[0].text.value;
            }
        }
    }
    private async checkStatusRun(runId: string, maxRetries = 10) {
        let retries = 0;        
        while (retries < maxRetries) {
            const runStatus = await this.openai.beta.threads.runs.retrieve(this.threadId, runId);
            
            if (runStatus.status === 'completed' || runStatus.status === 'failed') {
                if (runStatus.usage) {
                    const { prompt_tokens, completion_tokens, total_tokens } = runStatus.usage;
                    //console.log({ prompt_tokens, completion_tokens, total_tokens });
                }
                return runStatus;
            }

            await new Promise(resolve => setTimeout(resolve, 1000));
            retries++;
        }

        throw new Error('Max retries reached waiting for run completion');
    }
}