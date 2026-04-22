import vine from '@vinejs/vine'

export const registerValidator = vine.create({
    full_name: vine.string().trim().minLength(3).maxLength(150),
    email: vine.string().trim().email(),
    password: vine.string().minLength(6).maxLength(100),
})