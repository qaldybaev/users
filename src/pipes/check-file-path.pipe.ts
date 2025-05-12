import { ArgumentMetadata, BadRequestException, PipeTransform } from "@nestjs/common";

export class CheckFilePathPipe implements PipeTransform {
    constructor(private readonly fileMimeTypes: string[]) { }

    transform(value: Express.Multer.File, metadata: ArgumentMetadata) {
        if (!value) {
            return value
        }
        const extname = value?.originalname?.split('.').pop()?.toLowerCase();

        if (!extname || !this.fileMimeTypes.includes(extname)) {
            throw new BadRequestException(
                `Faqat ${this.fileMimeTypes.join(", ")} formatdagi fayllarga ruxsat bor`
            );
        }

        return value;
    }
}
