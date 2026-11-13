import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, Max, Min } from 'class-validator';
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE, MAXIMUM_PAGE_SIZE } from '../constants/api.constant.js';

/** The page of a list a client asks for. */
export class PageQueryDto {
  @ApiPropertyOptional({
    description: 'Page number, starting at 1.',
    default: DEFAULT_PAGE,
    minimum: DEFAULT_PAGE,
  })
  @Type(() => Number)
  @IsInt()
  @Min(DEFAULT_PAGE)
  @IsOptional()
  page: number = DEFAULT_PAGE;

  @ApiPropertyOptional({
    description: 'Items per page.',
    default: DEFAULT_PAGE_SIZE,
    minimum: 1,
    maximum: MAXIMUM_PAGE_SIZE,
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(MAXIMUM_PAGE_SIZE)
  @IsOptional()
  pageSize: number = DEFAULT_PAGE_SIZE;
}
