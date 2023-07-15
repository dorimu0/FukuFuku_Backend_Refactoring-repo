import { ResponseFormat as response, CustomResponse } from "./response.interface";

export function responseFormat(customResponse: CustomResponse, data: string | object = null): response {
  if (data !== null) {
    return { ...customResponse, data }
  }
  return { ...customResponse }
};

export const OK: CustomResponse = {
  statusCode: 200,
  message: 'OK',
}

export const Created: CustomResponse = {
  statusCode: 201,
  message: 'Created',
}

export const NoContent: CustomResponse = {
  statusCode: 204,
  message: 'No Content',
}

export const BadRequest: CustomResponse = {
  statusCode: 400,
  message: 'Bad Request',
}

export const NotFound: CustomResponse = {
  statusCode: 404,
  message: 'Requested resource not found',
}

export const Unauthorized: CustomResponse = {
  statusCode: 401,
  message: 'Unauthorized',
}

export const Conflict: CustomResponse = {
  statusCode: 409,
  message: 'Requested resource already exists'
}

export const UnprocessableEntity: CustomResponse = {
  statusCode: 422,
  message: 'Requested resource does not match the parameter',
}

export const InternalServerError: CustomResponse = {
  statusCode: 500,
  message: "Internal Server Error"
}