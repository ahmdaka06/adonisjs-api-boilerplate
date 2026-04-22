import type { HttpContext } from '@adonisjs/core/http'
import { errors as vineErrors } from '@vinejs/vine'
import ValidationErrorException from './validation_error_exception.ts'

type ValidationErrorItem = {
  field: string
  message: string
  rule?: string
}

export default class ApiExceptionHandler {
    static handle(error: unknown, ctx: HttpContext) {
        if (error instanceof vineErrors.E_VALIDATION_ERROR) {
            const formattedErrors = error.messages.reduce(
                (acc: Record<string, string[]>, item: ValidationErrorItem) => {
                    if (!acc[item.field]) {
                        acc[item.field] = []
                    }

                    acc[item.field].push(item.message)
                        return acc
                    },
                    {}
                )

            throw new ValidationErrorException(formattedErrors);
        }

        return null
    }
}