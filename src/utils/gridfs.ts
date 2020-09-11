import { GridFSBucket, MongoClient, ObjectID, GridFSBucketWriteStream, GridFSBucketReadStream } from "mongodb";
import { getConnection } from "typeorm";
import { FileUpload } from "graphql-upload";

export class GridFSUtil {
    private client: MongoClient;
    private gridfs: GridFSBucket;

    constructor() {
        this.client = (getConnection().driver as any).queryRunner.databaseConnection;
        this.gridfs = new GridFSBucket(this.client.db());
    }

    upload(fileUpload: FileUpload): Promise<boolean> {
        return new Promise((resolve, reject) => {
            fileUpload
                .createReadStream()
                .pipe(this.uploadStream(fileUpload.filename))
                .on('finish', (res: any) => {
                    console.log(res);
                    this.downloadStream(res._id)
                        .on('data', data => resolve(data))
                        .on('error', () => reject(null))
                })
                .on('error', () => reject(null));
        });
    }

    private downloadStream = (id: string): GridFSBucketReadStream =>
        this.gridfs.openDownloadStream(new ObjectID(id)).setEncoding('base64');

    private uploadStream = (filename: string): GridFSBucketWriteStream =>
        this.gridfs.openUploadStream(filename);
}
