import { FilesInterceptor, FileInterceptor } from "@nestjs/platform-express";
import { uploadOption } from "./upload.option";

// 단일 파일 인터셉터
export const fileInterceptor = FileInterceptor('file', uploadOption);

// 다중 파일 인터셉터
export const filesInterceptor = FilesInterceptor('file', 5, uploadOption);