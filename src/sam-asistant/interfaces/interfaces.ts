export interface MessageResponse {
    role: string;
    created_at: string;
    text: string;
}

export interface GetMessagesResponse {
    error: string | null;
    messages: MessageResponse[];
}
