import { ArgumentMetadata, ConflictException, Injectable, PipeTransform } from "@nestjs/common";

@Injectable()
export class CheckFileSizePipe implements PipeTransform {
    limit: number
    constructor(size: number) {
        this.limit = size * 1024 * 1024
    }
    transform(value: Express.Multer.File, metadata: ArgumentMetadata) {
        if (!value) {
            throw new ConflictException(`Rasm yuborilmadi!`)
        }
        if (value.size > this.limit) {
            throw new ConflictException(`Rasm hajmi ${this.limit / 1024 / 1024} mb kichik bolishi kerak!`)
        }
    }
}