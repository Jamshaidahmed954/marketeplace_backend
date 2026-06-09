import joi from "joi";

const loginValidation = (data) => {
    const schema = joi.object({
        email: joi.string().email().required(),
        password: joi.string().min(6).required(),
    });
    return schema.validate(data);
}

export {
    loginValidation
};