import {Injectable, Logger} from '@nestjs/common';
import {S3} from 'aws-sdk';
import {ConfigService} from '@nestjs/config';
import {v4 as uuid} from 'uuid';
import {InjectRepository} from "@nestjs/typeorm";
import PublicFile from "./publicFile.entity";
import {Repository} from "typeorm";
import {InjectQueue} from "@nestjs/bull";
import {Queue} from "bull";

@Injectable()
export class FilesService {
    private readonly logger = new Logger(FilesService.name)
    constructor(
        @InjectRepository(PublicFile)
        private publicFilesRepository: Repository<PublicFile>,
        private readonly configService: ConfigService,
        @InjectQueue('files')
        private readonly filesQueue: Queue
    ) {
    }

    async uploadPublicFile(taskId: string, dataBuffer: Buffer, filename: string) {
        try {
            const s3 = new S3();
            const uploadResult = await s3.upload({
                Bucket: this.configService.get('AWS_PUBLIC_BUCKET_NAME'),
                Body: dataBuffer,
                Key: `${uuid()}-${filename}`
            })
                .promise();
            const file = await this.publicFilesRepository.save({
                url: uploadResult.Location,
                key: uploadResult.Key
            })
            await this.filesQueue.add('fileAdd', {
                taskId: taskId,
                photoUrl: file.url,
            })

            return file;
        } catch (e) {
            this.logger.error(e.message)
        }
    }

    async deletePublicFile(fileUrl: string) {
        try {
            const file = await this.publicFilesRepository.findOneBy({url: fileUrl});
            const s3 = new S3();
            await s3.deleteObject({
                Bucket: this.configService.get('AWS_PUBLIC_BUCKET_NAME'),
                Key: file.key,
            }).promise();

            await this.publicFilesRepository.delete(file.id);

            await this.filesQueue.add('fileDelete', {
                fileUrl: fileUrl
            })
        } catch (e) {
            this.logger.error(e.message)
        }
    }
}
