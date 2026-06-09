import joi from "joi";

const registerValidation = (data) => {
    const schema = joi.object({
        name: joi.string().min(3).max(255).required(),
        description: joi.string().min(3).max(255),
        email: joi.string().email().required(),
        password: joi.string().min(6).max(255).required(),
        storeName: joi.string().min(3).max(255),
        phone: joi.string().min(10).max(15).required(),
        role: joi.string().valid("BUYER", "SELLER", "ADMIN").default("BUYER"),
        profilePicture: joi.string().uri(),
    });
    return schema.validate(data);
}

export { registerValidation };