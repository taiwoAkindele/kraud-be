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
import { StaffService } from './staff.service';
import { CreateStaffDto } from './dto/create-staff.dto';
import { UpdateStaffDto } from './dto/update-staff.dto';
import { UpdateStaffStatusDto } from './dto/update-staff-status.dto';
import { AssignBranchesDto } from './dto/assign-branches.dto';
import { QueryStaffDto } from './dto/query-staff.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { ParseObjectIdPipe } from '../../common/pipes/parse-objectid.pipe';

@ApiTags('Staff')
@ApiBearerAuth()
@Controller('staff')
@UseGuards(JwtAuthGuard)
export class StaffController {
  constructor(private readonly staffService: StaffService) {}

  // Static routes FIRST
  @Get('stats')
  @ApiOperation({ summary: 'Get staff statistics' })
  @ApiResponse({ status: 200, description: 'Staff statistics' })
  getStats(@CurrentUser('orgId') orgId: string) {
    return this.staffService.getStats(orgId);
  }

  @Get('roles')
  @ApiOperation({ summary: 'Get available staff roles' })
  @ApiResponse({ status: 200, description: 'List of staff roles' })
  getRoles() {
    return this.staffService.getRoles();
  }

  // List
  @Get()
  @ApiOperation({ summary: 'List all staff members' })
  @ApiResponse({ status: 200, description: 'Paginated list of staff members' })
  findAll(
    @CurrentUser('orgId') orgId: string,
    @Query() query: QueryStaffDto,
  ) {
    return this.staffService.findAll(orgId, query);
  }

  // Parameterized routes AFTER
  @Get(':staffId')
  @ApiOperation({ summary: 'Get a staff member by ID' })
  @ApiParam({ name: 'staffId', description: 'Staff ID' })
  @ApiResponse({ status: 200, description: 'Staff member details' })
  @ApiResponse({ status: 404, description: 'Staff member not found' })
  findById(
    @CurrentUser('orgId') orgId: string,
    @Param('staffId', ParseObjectIdPipe) staffId: string,
  ) {
    return this.staffService.findById(orgId, staffId);
  }

  @Get(':staffId/performance')
  @ApiOperation({ summary: 'Get staff member performance metrics' })
  @ApiParam({ name: 'staffId', description: 'Staff ID' })
  @ApiResponse({ status: 200, description: 'Staff performance data' })
  @ApiResponse({ status: 404, description: 'Staff member not found' })
  getPerformance(
    @CurrentUser('orgId') orgId: string,
    @Param('staffId', ParseObjectIdPipe) staffId: string,
  ) {
    return this.staffService.getPerformance(orgId, staffId);
  }

  @Get(':staffId/feedback')
  @ApiOperation({ summary: 'Get staff member feedback' })
  @ApiParam({ name: 'staffId', description: 'Staff ID' })
  @ApiResponse({ status: 200, description: 'Staff feedback list' })
  @ApiResponse({ status: 404, description: 'Staff member not found' })
  getFeedback(
    @CurrentUser('orgId') orgId: string,
    @Param('staffId', ParseObjectIdPipe) staffId: string,
  ) {
    return this.staffService.getFeedback(orgId, staffId);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new staff member' })
  @ApiResponse({ status: 201, description: 'Staff member created' })
  @ApiResponse({ status: 400, description: 'Validation error' })
  create(
    @CurrentUser('orgId') orgId: string,
    @Body() dto: CreateStaffDto,
  ) {
    return this.staffService.create(orgId, dto);
  }

  @Put(':staffId')
  @ApiOperation({ summary: 'Update a staff member' })
  @ApiParam({ name: 'staffId', description: 'Staff ID' })
  @ApiResponse({ status: 200, description: 'Staff member updated' })
  @ApiResponse({ status: 404, description: 'Staff member not found' })
  update(
    @CurrentUser('orgId') orgId: string,
    @Param('staffId', ParseObjectIdPipe) staffId: string,
    @Body() dto: UpdateStaffDto,
  ) {
    return this.staffService.update(orgId, staffId, dto);
  }

  @Delete(':staffId')
  @ApiOperation({ summary: 'Delete a staff member' })
  @ApiParam({ name: 'staffId', description: 'Staff ID' })
  @ApiResponse({ status: 200, description: 'Staff member deleted' })
  @ApiResponse({ status: 404, description: 'Staff member not found' })
  delete(
    @CurrentUser('orgId') orgId: string,
    @Param('staffId', ParseObjectIdPipe) staffId: string,
  ) {
    return this.staffService.delete(orgId, staffId);
  }

  @Patch(':staffId/status')
  @ApiOperation({ summary: 'Update staff member status' })
  @ApiParam({ name: 'staffId', description: 'Staff ID' })
  @ApiResponse({ status: 200, description: 'Staff status updated' })
  @ApiResponse({ status: 404, description: 'Staff member not found' })
  updateStatus(
    @CurrentUser('orgId') orgId: string,
    @Param('staffId', ParseObjectIdPipe) staffId: string,
    @Body() dto: UpdateStaffStatusDto,
  ) {
    return this.staffService.updateStatus(orgId, staffId, dto);
  }

  @Put(':staffId/branch-assignment')
  @ApiOperation({ summary: 'Assign branches to a staff member' })
  @ApiParam({ name: 'staffId', description: 'Staff ID' })
  @ApiResponse({ status: 200, description: 'Branches assigned' })
  @ApiResponse({ status: 404, description: 'Staff member not found' })
  assignBranches(
    @CurrentUser('orgId') orgId: string,
    @Param('staffId', ParseObjectIdPipe) staffId: string,
    @Body() dto: AssignBranchesDto,
  ) {
    return this.staffService.assignBranches(orgId, staffId, dto);
  }
}
