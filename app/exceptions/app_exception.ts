import { Exception } from '@adonisjs/core/exceptions'
import type { HttpContext } from '@adonisjs/core/http'

export default class AppException extends Exception {
    constructor(
        message: string,
        status: number = 400,
        code: string = 'E_APP_EXCEPTION',
        public errors: any = null
    ) {
        super(message, {
            status,
            code,
        })
    }

    handle(error: this, { response }: HttpContext) {
        return response.status(error.status).send({
            statusCode: error.status,
            success: false,
            message: error.message,
            errors: error.errors,
        })
    }
}