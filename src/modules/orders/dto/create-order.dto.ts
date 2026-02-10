import {
  IsString,
  IsOptional,
  IsArray,
  ValidateNested,
  IsNumber,
  Min,
  IsNotEmpty,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateOrderItemDto {
  @ApiProperty({ description: 'Item name', example: 'Margherita Pizza' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Quantity', example: 2, minimum: 1 })
  @IsNumber()
  @Min(1)
  quantity: number;

  @ApiProperty({ description: 'Price per item', example: 12.99, minimum: 0 })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiPropertyOptional({ description: 'Item description', example: 'Extra cheese' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ description: 'Station type (kitchen, bar, etc.)', example: 'kitchen' })
  @IsOptional()
  @IsString()
  stationType?: string;

  @ApiPropertyOptional({ description: 'Station name', example: 'Grill Station' })
  @IsOptional()
  @IsString()
  stationName?: string;
}

export class CreateOrderDto {
  @ApiProperty({ description: 'Order items', type: [CreateOrderItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  items: CreateOrderItemDto[];

  @ApiPropertyOptional({ description: 'Table number', example: 'T5' })
  @IsOptional()
  @IsString()
  tableNumber?: string;

  @ApiPropertyOptional({ description: 'Customer name', example: 'John Doe' })
  @IsOptional()
  @IsString()
  customer?: string;

  @ApiProperty({ description: 'Branch ID', example: '507f1f77bcf86cd799439011' })
  @IsString()
  @IsNotEmpty()
  branchId: string;
}
