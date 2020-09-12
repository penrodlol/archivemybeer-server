import S3 from 'aws-sdk/clients/s3';

export class S3Util {
    private readonly BUCKET = 'archivemybeer-images';
    private readonly AWSS3 = new S3({
        accessKeyId: 'AKIAJORKLID5TYVM7M7A',
        secretAccessKey: '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',
        region: 'us-east-2',
    });

    constructor() {
        (async () => {
            const connection = () => this.AWSS3
                .headBucket({Bucket: this.BUCKET })
                .on('success', () => console.log('✅ AWS S3 Connection Success!'))
                .on('error', error => console.log(`❌ AWS S3 Connection Failure: ${error}`))
                .promise();
            await connection();
        })();
    }

    readBeerImage(key: string) {
        return this.AWSS3
            .getSignedUrl(
                'getObject',
                {
                    Bucket: this.BUCKET,
                    Key: key,
                    // Expires: TBD
                }
            );
    }
}
