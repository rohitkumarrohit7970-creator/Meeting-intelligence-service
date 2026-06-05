import * as authService from '../services/authService.js';
import { z } from 'zod';
const registerSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
    name: z.string().optional(),
});
const loginSchema = z.object({
    email: z.string().email(),
    password: z.string(),
});
export const register = async (req, res, next) => {
    try {
        const validatedData = registerSchema.parse(req.body);
        const result = await authService.register(validatedData.email, validatedData.password, validatedData.name);
        res.status(201).json(result);
    }
    catch (error) {
        next(error);
    }
};
export const login = async (req, res, next) => {
    try {
        const validatedData = loginSchema.parse(req.body);
        const result = await authService.login(validatedData.email, validatedData.password);
        res.status(200).json(result);
    }
    catch (error) {
        next(error);
    }
};
