import { Exception } from '@adonisjs/core/exceptions'
import type { HttpContext } from '@adonisjs/core/http'

export default class ValidationErrorException extends Exception {
  static status = 400
  static code = 'E_VALIDATION_ERROR'

  constructor(
    public errors: Record<string, string[]>,
    message = 'Validation failed'
  ) {
    super(message, {
      status: ValidationErrorException.status,
      code: ValidationErrorException.code,
    })
  }

  handle(error: this, { response }: HttpContext) {
    return response.status(400).send({
      statusCode: 400,
      success: false,
      message: error.message,
      errors: error.errors,
    })
  }
}