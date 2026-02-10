import {
  Controller,
  Get,
  Patch,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { BarService } from './bar.service';
import { UpdateBarStatusDto } from './dto/update-bar-status.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { ParseObjectIdPipe } from '../../common/pipes/parse-objectid.pipe';

@ApiTags('Bar')
@ApiBearerAuth()
@Controller('bar')
@UseGuards(JwtAuthGuard)
export class BarController {
  constructor(private readonly barService: BarService) {}

  @Get('orders')
  @ApiOperation({ summary: 'Get all bar orders' })
  @ApiResponse({ status: 200, description: 'List of bar orders' })
  getOrders(@CurrentUser('orgId') orgId: string) {
    return this.barService.getOrders(orgId);
  }

  @Patch('orders/:orderId/status')
  @ApiOperation({ summary: 'Update bar order status' })
  @ApiParam({ name: 'orderId', description: 'Order ID' })
  @ApiResponse({ status: 200, description: 'Bar order status updated' })
  @ApiResponse({ status: 404, description: 'Order not found' })
  updateOrderStatus(
    @CurrentUser('orgId') orgId: string,
    @Param('orderId', ParseObjectIdPipe) orderId: string,
    @Body() dto: UpdateBarStatusDto,
  ) {
    return this.barService.updateOrderStatus(orgId, orderId, dto);
  }
}
