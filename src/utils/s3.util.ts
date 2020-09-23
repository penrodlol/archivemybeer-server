import S3 from 'aws-sdk/clients/s3';
import { Errors } from '../enums/errors.enum';
import { v4 as uuidv4 } from 'uuid';
import { Upload } from '../entity/upload.entity';

export interface IUploadResponse {
    key: string;
    url: string;
}

export class S3Util {
    private readonly AWSS3 = new S3({
        accessKeyId: process.env.AWS_S3_KEY,
        secretAccessKey: process.env.AWS_S3_SECRET,
        region: process.env.AWS_S3_REGION,
    });

    constructor() {
        (async () => {
            await this.AWSS3
                .headBucket({Bucket: process.env.AWS_S3_BUCKET as string })
                .on('success', () => console.log('✅ AWS S3 Connection Success!'))
                .on('error', error => console.log(`❌ AWS S3 Connection Failure: ${error}`))
                .promise();
        })();
    }

    getUrl(key: string) {
        return this.AWSS3
            .getSignedUrl(
                'getObject',
                {
                    Bucket: process.env.AWS_S3_BUCKET as string,
                    Key: key,
                    // Expires: TBD
                }
            );
    }

    async upload(file: Upload): Promise<IUploadResponse | null> {
        return new Promise((resolve, reject) => {
            this.AWSS3
                .upload({
                    Bucket: process.env.AWS_S3_BUCKET as string,
                    Key: uuidv4(),
                    Body: file.createReadStream(),
                    ContentType: file.mimetype
                })
                .promise()
                .then(upload => resolve({ key: upload.Key, url: this.getUrl(upload.Key) }))
                .catch(() => reject(new Error(Errors.ImageUploadFailure)));
        })
    }
}
