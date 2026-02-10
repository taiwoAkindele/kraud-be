import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { BranchesService } from './branches.service';
import { CreateBranchDto } from './dto/create-branch.dto';
import { UpdateBranchDto } from './dto/update-branch.dto';
import { QueryBranchesDto } from './dto/query-branches.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { ParseObjectIdPipe } from '../../common/pipes/parse-objectid.pipe';

@ApiTags('Branches')
@ApiBearerAuth()
@Controller('branches')
@UseGuards(JwtAuthGuard)
export class BranchesController {
  constructor(private readonly branchesService: BranchesService) {}

  // Static routes BEFORE parameterized routes
  @Get('stats')
  @ApiOperation({ summary: 'Get branch statistics' })
  @ApiResponse({ status: 200, description: 'Branch statistics' })
  getStats(@CurrentUser('orgId') orgId: string) {
    return this.branchesService.getStats(orgId);
  }

  @Get()
  @ApiOperation({ summary: 'List all branches' })
  @ApiResponse({ status: 200, description: 'Paginated list of branches' })
  findAll(
    @CurrentUser('orgId') orgId: string,
    @Query() query: QueryBranchesDto,
  ) {
    return this.branchesService.findAll(orgId, query);
  }

  @Get(':branchId')
  @ApiOperation({ summary: 'Get a branch by ID' })
  @ApiParam({ name: 'branchId', description: 'Branch ID' })
  @ApiResponse({ status: 200, description: 'Branch details' })
  @ApiResponse({ status: 404, description: 'Branch not found' })
  findById(
    @CurrentUser('orgId') orgId: string,
    @Param('branchId', ParseObjectIdPipe) branchId: string,
  ) {
    return this.branchesService.findById(orgId, branchId);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new branch' })
  @ApiResponse({ status: 201, description: 'Branch created' })
  @ApiResponse({ status: 400, description: 'Validation error' })
  create(
    @CurrentUser('orgId') orgId: string,
    @Body() dto: CreateBranchDto,
  ) {
    return this.branchesService.create(orgId, dto);
  }

  @Put(':branchId')
  @ApiOperation({ summary: 'Update a branch' })
  @ApiParam({ name: 'branchId', description: 'Branch ID' })
  @ApiResponse({ status: 200, description: 'Branch updated' })
  @ApiResponse({ status: 404, description: 'Branch not found' })
  update(
    @CurrentUser('orgId') orgId: string,
    @Param('branchId', ParseObjectIdPipe) branchId: string,
    @Body() dto: UpdateBranchDto,
  ) {
    return this.branchesService.update(orgId, branchId, dto);
  }

  @Delete(':branchId')
  @ApiOperation({ summary: 'Delete a branch' })
  @ApiParam({ name: 'branchId', description: 'Branch ID' })
  @ApiResponse({ status: 200, description: 'Branch deleted' })
  @ApiResponse({ status: 404, description: 'Branch not found' })
  delete(
    @CurrentUser('orgId') orgId: string,
    @Param('branchId', ParseObjectIdPipe) branchId: string,
  ) {
    return this.branchesService.delete(orgId, branchId);
  }
}
