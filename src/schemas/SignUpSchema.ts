import {z} from 'zod';

export const UsernameSchema = z
  .string()
  .trim()
  .min(2, 'username should have at least 2 characters')
  .max(20, 'username should have at most 20 characters')
  .regex(/^(?!.*\s{2,})[a-zA-Z0-9_ ]*$/, 'username should not have consecutive spaces or special characters except underscores and single spaces')
  .transform((username) => username.toLowerCase().replace(/\s+/g, ''));


export const SignUpSchema = z.object({
    firstname:z.string().min(2, 'firstname should have at least 2 characters')
    .max(20, 'firstname should have at most 10 characters'),
    lastname:z.string().max(20, 'firstname should have at most 10 characters').optional(),
    username:UsernameSchema,
    email:z.string().email(),
    password:z.string().min(2, 'password should have at least 2 characters')
    .max(20, 'password should have at most 10 characters')
})