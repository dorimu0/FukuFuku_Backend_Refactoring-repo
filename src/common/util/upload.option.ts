import * as multerS3 from 'multer-s3';
import { generate } from 'shortid';
import { S3Client } from "@aws-sdk/client-s3";

export const uploadOption = {
  // 파일 체크
  fileFilter(req, file, callback) {
    const typeArray = file.mimetype.split('/');
    const type = typeArray[1];

    if (type === 'jpg' || type === 'png' || type === 'jpeg') {
      req.fileValidationError = 'format does fit';
      callback(null, true);
    }
    else {
      req.fileValidationError = "format doesn't fit";
      callback(null, false);
    }
  },
  // 저장소
  storage: multerS3({
    s3: new S3Client({
      credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY,
        secretAccessKey: process.env.S3_SECRET_KEY,
      },
      region: process.env.S3_REGION,
    }),

    bucket: process.env.S3_BUCKET_NAME,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: function (req, file, callback) {
      const type = file.mimetype.split('/');
      const fileId = generate();
      const fileName = `${new Date().getUTCFullYear()}/${new Date().getUTCMonth() + 1}/${fileId}${type}`;
      callback(null, fileName);
    },
    acl: 'public-read-write',
  }),
  // 제한 크기
  limits: {}
}