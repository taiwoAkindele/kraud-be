import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { DispatchOrderDto } from './dto/dispatch-order.dto';
import { ProcessPaymentDto } from './dto/process-payment.dto';
import { QueryOrdersDto } from './dto/query-orders.dto';
import { QueryOrderHistoryDto } from './dto/query-order-history.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { ParseObjectIdPipe } from '../../common/pipes/parse-objectid.pipe';

@ApiTags('Orders')
@ApiBearerAuth()
@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  // Static routes FIRST
  @Get('history')
  @ApiOperation({ summary: 'Get order history' })
  @ApiResponse({ status: 200, description: 'Paginated order history' })
  getHistory(
    @CurrentUser('orgId') orgId: string,
    @Query() query: QueryOrderHistoryDto,
  ) {
    return this.ordersService.getHistory(orgId, query);
  }

  // List
  @Get()
  @ApiOperation({ summary: 'List all orders' })
  @ApiResponse({ status: 200, description: 'Paginated list of orders' })
  findAll(
    @CurrentUser('orgId') orgId: string,
    @Query() query: QueryOrdersDto,
  ) {
    return this.ordersService.findAll(orgId, query);
  }

  // Parameterized routes
  @Get('history/:orderId')
  @ApiOperation({ summary: 'Get order history detail' })
  @ApiParam({ name: 'orderId', description: 'Order ID' })
  @ApiResponse({ status: 200, description: 'Order history detail' })
  @ApiResponse({ status: 404, description: 'Order not found' })
  getHistoryDetail(
    @CurrentUser('orgId') orgId: string,
    @Param('orderId', ParseObjectIdPipe) orderId: string,
  ) {
    return this.ordersService.getHistoryDetail(orgId, orderId);
  }

  @Get(':orderId')
  @ApiOperation({ summary: 'Get an order by ID' })
  @ApiParam({ name: 'orderId', description: 'Order ID' })
  @ApiResponse({ status: 200, description: 'Order details' })
  @ApiResponse({ status: 404, description: 'Order not found' })
  findById(
    @CurrentUser('orgId') orgId: string,
    @Param('orderId', ParseObjectIdPipe) orderId: string,
  ) {
    return this.ordersService.findById(orgId, orderId);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new order' })
  @ApiResponse({ status: 201, description: 'Order created' })
  @ApiResponse({ status: 400, description: 'Validation error' })
  create(
    @CurrentUser('orgId') orgId: string,
    @CurrentUser() user: any,
    @Body() dto: CreateOrderDto,
  ) {
    return this.ordersService.create(orgId, dto, user);
  }

  @Put(':orderId')
  @ApiOperation({ summary: 'Update an order' })
  @ApiParam({ name: 'orderId', description: 'Order ID' })
  @ApiResponse({ status: 200, description: 'Order updated' })
  @ApiResponse({ status: 404, description: 'Order not found' })
  update(
    @CurrentUser('orgId') orgId: string,
    @Param('orderId', ParseObjectIdPipe) orderId: string,
    @Body() dto: UpdateOrderDto,
  ) {
    return this.ordersService.update(orgId, orderId, dto);
  }

  @Patch(':orderId/status')
  @ApiOperation({ summary: 'Update order status' })
  @ApiParam({ name: 'orderId', description: 'Order ID' })
  @ApiResponse({ status: 200, description: 'Order status updated' })
  @ApiResponse({ status: 404, description: 'Order not found' })
  updateStatus(
    @CurrentUser('orgId') orgId: string,
    @Param('orderId', ParseObjectIdPipe) orderId: string,
    @Body() dto: UpdateOrderStatusDto,
  ) {
    return this.ordersService.updateStatus(orgId, orderId, dto);
  }

  @Delete(':orderId')
  @ApiOperation({ summary: 'Delete an order' })
  @ApiParam({ name: 'orderId', description: 'Order ID' })
  @ApiResponse({ status: 200, description: 'Order deleted' })
  @ApiResponse({ status: 404, description: 'Order not found' })
  delete(
    @CurrentUser('orgId') orgId: string,
    @Param('orderId', ParseObjectIdPipe) orderId: string,
  ) {
    return this.ordersService.delete(orgId, orderId);
  }

  @Post(':orderId/dispatch')
  @ApiOperation({ summary: 'Dispatch order items to stations' })
  @ApiParam({ name: 'orderId', description: 'Order ID' })
  @ApiResponse({ status: 201, description: 'Order dispatched to stations' })
  @ApiResponse({ status: 404, description: 'Order not found' })
  dispatch(
    @CurrentUser('orgId') orgId: string,
    @Param('orderId', ParseObjectIdPipe) orderId: string,
    @Body() dto: DispatchOrderDto,
  ) {
    return this.ordersService.dispatch(orgId, orderId, dto);
  }

  @Post(':orderId/payment')
  @ApiOperation({ summary: 'Process payment for an order' })
  @ApiParam({ name: 'orderId', description: 'Order ID' })
  @ApiResponse({ status: 201, description: 'Payment processed' })
  @ApiResponse({ status: 404, description: 'Order not found' })
  processPayment(
    @CurrentUser('orgId') orgId: string,
    @Param('orderId', ParseObjectIdPipe) orderId: string,
    @Body() dto: ProcessPaymentDto,
  ) {
    return this.ordersService.processPayment(orgId, orderId, dto);
  }
}
