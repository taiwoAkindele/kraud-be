import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { MenuService } from './menu.service';
import { QueryMenuDto } from './dto/query-menu.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Menu')
@ApiBearerAuth()
@Controller('menu')
@UseGuards(JwtAuthGuard)
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Get()
  @ApiOperation({ summary: 'Get full menu' })
  @ApiResponse({ status: 200, description: 'Full menu with categories and items' })
  getMenu(
    @CurrentUser('orgId') orgId: string,
    @Query() query: QueryMenuDto,
  ) {
    return this.menuService.getMenu(orgId, query);
  }

  @Get('categories')
  @ApiOperation({ summary: 'Get menu categories' })
  @ApiResponse({ status: 200, description: 'List of menu categories' })
  getCategories(@CurrentUser('orgId') orgId: string) {
    return this.menuService.getCategories(orgId);
  }

  @Get('items')
  @ApiOperation({ summary: 'Get menu items' })
  @ApiResponse({ status: 200, description: 'List of menu items' })
  getItems(
    @CurrentUser('orgId') orgId: string,
    @Query() query: QueryMenuDto,
  ) {
    return this.menuService.getItems(orgId, query);
  }
}
