import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { RolesService } from './roles.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { ParseObjectIdPipe } from '../../common/pipes/parse-objectid.pipe';

@ApiTags('Roles')
@ApiBearerAuth()
@Controller('roles')
@UseGuards(JwtAuthGuard)
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Get()
  @ApiOperation({ summary: 'List all roles' })
  @ApiResponse({ status: 200, description: 'List of roles' })
  findAll(@CurrentUser('orgId') orgId: string) {
    return this.rolesService.findAll(orgId);
  }

  @Get(':roleId')
  @ApiOperation({ summary: 'Get a role by ID' })
  @ApiParam({ name: 'roleId', description: 'Role ID' })
  @ApiResponse({ status: 200, description: 'Role details' })
  @ApiResponse({ status: 404, description: 'Role not found' })
  findById(@Param('roleId', ParseObjectIdPipe) roleId: string) {
    return this.rolesService.findById(roleId);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new role' })
  @ApiResponse({ status: 201, description: 'Role created' })
  @ApiResponse({ status: 400, description: 'Validation error' })
  create(
    @CurrentUser('orgId') orgId: string,
    @Body() data: any,
  ) {
    return this.rolesService.create(orgId, data);
  }

  @Put(':roleId')
  @ApiOperation({ summary: 'Update a role' })
  @ApiParam({ name: 'roleId', description: 'Role ID' })
  @ApiResponse({ status: 200, description: 'Role updated' })
  @ApiResponse({ status: 404, description: 'Role not found' })
  update(
    @CurrentUser('orgId') orgId: string,
    @Param('roleId', ParseObjectIdPipe) roleId: string,
    @Body() data: any,
  ) {
    return this.rolesService.update(orgId, roleId, data);
  }

  @Delete(':roleId')
  @ApiOperation({ summary: 'Delete a role' })
  @ApiParam({ name: 'roleId', description: 'Role ID' })
  @ApiResponse({ status: 200, description: 'Role deleted' })
  @ApiResponse({ status: 404, description: 'Role not found' })
  delete(
    @CurrentUser('orgId') orgId: string,
    @Param('roleId', ParseObjectIdPipe) roleId: string,
  ) {
    return this.rolesService.delete(orgId, roleId);
  }
}
