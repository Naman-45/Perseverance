import { z } from 'zod';

export const userInput = z.object({
    username: z.string(),
    password: z.string()
})