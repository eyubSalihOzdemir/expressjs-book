import { Expose } from "class-transformer";
import {
  IsString,
  IsNotEmpty,
  validate,
  ValidationError,
} from "class-validator";

// DTO for creating a new book (without ID)
export class CreateBookDTO {
  @IsString()
  @IsNotEmpty()
  @Expose()
  title!: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  author!: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  publishedYear!: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  genre!: string;
}

// DTO for a complete book (with ID)
export class BookDTO extends CreateBookDTO {
  @IsString()
  @IsNotEmpty()
  @Expose()
  id!: string;
}
