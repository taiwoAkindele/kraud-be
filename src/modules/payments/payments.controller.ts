import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentStatusDto } from './dto/update-payment-status.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { ParseObjectIdPipe } from '../../common/pipes/parse-objectid.pipe';

@ApiTags('Payments')
@ApiBearerAuth()
@Controller('payments')
@UseGuards(JwtAuthGuard)
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a payment' })
  @ApiResponse({ status: 201, description: 'Payment created' })
  @ApiResponse({ status: 400, description: 'Validation error' })
  create(
    @CurrentUser('orgId') orgId: string,
    @Body() dto: CreatePaymentDto,
  ) {
    return this.paymentsService.create(orgId, dto);
  }

  @Get(':paymentId')
  @ApiOperation({ summary: 'Get a payment by ID' })
  @ApiParam({ name: 'paymentId', description: 'Payment ID' })
  @ApiResponse({ status: 200, description: 'Payment details' })
  @ApiResponse({ status: 404, description: 'Payment not found' })
  findById(
    @CurrentUser('orgId') orgId: string,
    @Param('paymentId', ParseObjectIdPipe) paymentId: string,
  ) {
    return this.paymentsService.findById(orgId, paymentId);
  }

  @Patch(':paymentId')
  @ApiOperation({ summary: 'Update payment status' })
  @ApiParam({ name: 'paymentId', description: 'Payment ID' })
  @ApiResponse({ status: 200, description: 'Payment status updated' })
  @ApiResponse({ status: 404, description: 'Payment not found' })
  updateStatus(
    @CurrentUser('orgId') orgId: string,
    @Param('paymentId', ParseObjectIdPipe) paymentId: string,
    @Body() dto: UpdatePaymentStatusDto,
  ) {
    return this.paymentsService.updateStatus(orgId, paymentId, dto);
  }
}
