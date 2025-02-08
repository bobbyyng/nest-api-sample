import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsInt,
  IsOptional,
  IsString,
  Min,
  IsEnum,
  IsObject,
} from 'class-validator';
import { SortOrderEnum } from '../enums/pagination.enum';
import { ResponseTypeEnum } from '../enums/response-type.enum';

export class PaginationDto {
  @ApiPropertyOptional({ example: 1, description: 'Page number' })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Transform(({ value }) => parseInt(value, 10))
  page?: number;

  @ApiPropertyOptional({ example: 10, description: 'Number of items per page' })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Transform(({ value }) => parseInt(value, 10))
  pageSize?: number;

  @ApiPropertyOptional({ example: 'id', description: 'Sort by field' })
  @IsOptional()
  @IsString()
  orderBy?: string = 'id';

  @ApiPropertyOptional({ example: 'asc', description: 'Sort order' })
  @IsOptional()
  @IsEnum(SortOrderEnum)
  order?: SortOrderEnum;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  search?: string;
}
