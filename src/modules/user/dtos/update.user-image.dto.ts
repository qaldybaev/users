import { ApiProperty } from "@nestjs/swagger"

export class UpdateUserImageDto {
    @ApiProperty({ type: String, format: "binary" })
    image: Express.Multer.File
}