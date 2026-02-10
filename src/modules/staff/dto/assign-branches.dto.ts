import { IsArray, ArrayMinSize, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AssignBranchesDto {
  @ApiProperty({ description: 'Branch IDs to assign', example: ['507f1f77bcf86cd799439011'], type: [String] })
  @IsArray()
  @ArrayMinSize(1, { message: 'At least one branch must be selected' })
  @IsString({ each: true })
  selectedBranches: string[];
}
