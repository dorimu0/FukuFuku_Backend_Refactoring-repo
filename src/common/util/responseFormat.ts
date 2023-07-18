import { ResponseFormat as response, CustomResponse } from "./response.interface";

export function responseFormat(customResponse: CustomResponse, data: string | object = null): response {
  if (data !== null) {
    return { ...customResponse, data };
  }
  return customResponse;
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
  statusCode: 201,
  message: 'No Content',
}