import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, FilterQuery } from 'mongoose';
import { MenuItem, MenuItemDocument } from './schemas/menu-item.schema';
import {
  MenuCategory,
  MenuCategoryDocument,
} from './schemas/menu-category.schema';
import { QueryMenuDto } from './dto/query-menu.dto';

@Injectable()
export class MenuService {
  constructor(
    @InjectModel(MenuItem.name)
    private menuItemModel: Model<MenuItemDocument>,
    @InjectModel(MenuCategory.name)
    private menuCategoryModel: Model<MenuCategoryDocument>,
  ) {}

  async getMenu(orgId: string, query: QueryMenuDto) {
    const itemFilter: FilterQuery<MenuItem> = { orgId, available: true };
    if (query.branch) itemFilter.branchId = query.branch;
    if (query.category) itemFilter.category = query.category;

    const [items, categories] = await Promise.all([
      this.menuItemModel.find(itemFilter).lean().exec(),
      this.menuCategoryModel.find({ orgId, active: true }).lean().exec(),
    ]);

    return { items, categories };
  }

  async getCategories(orgId: string) {
    return this.menuCategoryModel
      .find({ orgId, active: true })
      .lean()
      .exec();
  }

  async getItems(orgId: string, query: QueryMenuDto) {
    const filter: FilterQuery<MenuItem> = { orgId, available: true };
    if (query.branch) filter.branchId = query.branch;
    if (query.category) filter.category = query.category;

    return this.menuItemModel.find(filter).lean().exec();
  }
}
