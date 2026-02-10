import {
  Controller,
  Get,
  Patch,
  Param,
  Query,
  Body,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { KitchenService } from './kitchen.service';
import { UpdateKitchenStatusDto } from './dto/update-kitchen-status.dto';
import { QueryKitchenOrdersDto } from './dto/query-kitchen-orders.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { ParseObjectIdPipe } from '../../common/pipes/parse-objectid.pipe';

@ApiTags('Kitchen')
@ApiBearerAuth()
@Controller('kitchen')
@UseGuards(JwtAuthGuard)
export class KitchenController {
  constructor(private readonly kitchenService: KitchenService) {}

  @Get('stations')
  @ApiOperation({ summary: 'Get all kitchen stations' })
  @ApiResponse({ status: 200, description: 'List of kitchen stations' })
  getStations(@CurrentUser('orgId') orgId: string) {
    return this.kitchenService.getStations(orgId);
  }

  @Get('orders')
  @ApiOperation({ summary: 'Get kitchen orders' })
  @ApiResponse({ status: 200, description: 'List of kitchen orders' })
  getOrders(
    @CurrentUser('orgId') orgId: string,
    @Query() query: QueryKitchenOrdersDto,
  ) {
    return this.kitchenService.getOrders(orgId, query);
  }

  @Get('orders/:orderId')
  @ApiOperation({ summary: 'Get a kitchen order by ID' })
  @ApiParam({ name: 'orderId', description: 'Order ID' })
  @ApiResponse({ status: 200, description: 'Kitchen order details' })
  @ApiResponse({ status: 404, description: 'Order not found' })
  getOrderById(
    @CurrentUser('orgId') orgId: string,
    @Param('orderId', ParseObjectIdPipe) orderId: string,
  ) {
    return this.kitchenService.getOrderById(orgId, orderId);
  }

  @Patch('orders/:orderId/status')
  @ApiOperation({ summary: 'Update kitchen order status' })
  @ApiParam({ name: 'orderId', description: 'Order ID' })
  @ApiResponse({ status: 200, description: 'Kitchen order status updated' })
  @ApiResponse({ status: 404, description: 'Order not found' })
  updateOrderStatus(
    @CurrentUser('orgId') orgId: string,
    @Param('orderId', ParseObjectIdPipe) orderId: string,
    @Body() dto: UpdateKitchenStatusDto,
  ) {
    return this.kitchenService.updateOrderStatus(orgId, orderId, dto);
  }
}
