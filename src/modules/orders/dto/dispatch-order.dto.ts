import { IsArray, ValidateNested, IsString, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class DispatchItemDto {
  @ApiProperty({ description: 'Item ID to dispatch', example: '507f1f77bcf86cd799439011' })
  @IsString()
  @IsNotEmpty()
  itemId: string;

  @ApiProperty({ description: 'Target station', example: 'kitchen' })
  @IsString()
  @IsNotEmpty()
  station: string;
}

export class DispatchOrderDto {
  @ApiProperty({ description: 'Items to dispatch', type: [DispatchItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DispatchItemDto)
  items: DispatchItemDto[];
}
