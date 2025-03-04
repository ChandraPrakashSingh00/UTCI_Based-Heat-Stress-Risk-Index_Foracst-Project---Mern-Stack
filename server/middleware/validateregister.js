const { z } = require('zod');

const registerSchema = z.object({
  username: z.string()
    .min(3, "Username must be at least 3 characters.")
    .max(30, "Username cannot exceed 30 characters."),
  
  email: z.string()
    .email("Invalid email format.")
    .transform(email => email.toLowerCase()), // Convert to lowercase
  
  password: z.string()
    .min(8, "Password must be at least 8 characters.")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter.")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter.")
    .regex(/[0-9]/, "Password must contain at least one number.")
    .regex(/[\W_]/, "Password must contain at least one special character.")
});

const validateRegister = (req, res, next) => {
  const result = registerSchema.safeParse(req.body);
  
  if (!result.success) {
    return res.status(400).json({ message: result.error.errors[0].message });
  }

  req.body = result.data; // Use the validated and transformed data
  next();
};

module.exports = validateRegister;
