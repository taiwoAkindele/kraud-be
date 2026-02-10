import { ApiProperty } from '@nestjs/swagger';

export class ApiResponseDto<T> {
  @ApiProperty({ description: 'Whether the request was successful', example: true })
  success: boolean;

  @ApiProperty({ description: 'Response data' })
  data: T;

  @ApiProperty({ description: 'Response message', example: 'Operation successful' })
  message: string;

  @ApiProperty({ description: 'Response timestamp', example: '2026-01-01T00:00:00.000Z' })
  timestamp: string;
}
