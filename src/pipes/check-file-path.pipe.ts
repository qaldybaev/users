import { ArgumentMetadata, BadRequestException, PipeTransform } from "@nestjs/common";

export class CheckFilePathPipe implements PipeTransform {
  constructor(private readonly fileExtensions: string[]) {}

  transform(value: Express.Multer.File, metadata: ArgumentMetadata) {
    const extname = value?.originalname?.split('.').pop()?.toLowerCase();
    
    if (!extname || !this.fileExtensions.includes(extname)) {
      throw new BadRequestException(`Faqat ${this.fileExtensions.join(', ')} formatdagi fayllarga ruxsat beriladi`);
    }

    return value; 
  }
}
