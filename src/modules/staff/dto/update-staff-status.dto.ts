import { IsNotEmpty, IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { StaffStatus } from '../../../common/constants';

export class UpdateStaffStatusDto {
  @ApiProperty({ description: 'Staff status', enum: StaffStatus, example: 'Active' })
  @IsNotEmpty()
  @IsIn(Object.values(StaffStatus))
  status: string;
}
