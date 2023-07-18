import { DeleteObjectCommand, DeleteObjectsCommand, S3Client} from '@aws-sdk/client-s3';
const client = new S3Client({
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY,
    secretAccessKey: process.env.S3_SECRET_KEY,
  },
  region: process.env.S3_REGION,
})

export async function deleteObject(args: string[]) {
  let command;
  // 객체 여러개 삭제할 때
  const keys = [];
  if (args.length > 1) {
    args.forEach(key => {
      keys.push({ Key: key })
    });

    command = new DeleteObjectsCommand({
      Bucket: process.env.S3_BUCKET_NAME,
      Delete: {
        Objects: keys,
      },
    });
  }

  // 객체 하나만 삭제
  else {
    command = new DeleteObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME,
      Key: args[0],
    });
  };

  try {
    await client.send(command);

    console.log(
      'Successfully deleted objects from S3 bucket. Deleted objects'
    );

    return true;
    
  } catch (err) {
    console.error(err);
  };
};