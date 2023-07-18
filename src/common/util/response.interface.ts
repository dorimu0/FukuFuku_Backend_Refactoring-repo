export interface ResponseFormat
{
	message: string
	statusCode: number
  data?: object | string
}

export interface CustomResponse {
  statusCode: number,
  message: string,
}