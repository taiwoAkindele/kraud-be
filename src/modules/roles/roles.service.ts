import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Role, RoleDocument } from './schemas/role.schema';

@Injectable()
export class RolesService {
  constructor(
    @InjectModel(Role.name)
    private roleModel: Model<RoleDocument>,
  ) {}

  async findAll(orgId: string) {
    return this.roleModel.find({ orgId }).lean().exec();
  }

  async findById(roleId: string) {
    const role = await this.roleModel.findById(roleId).lean().exec();
    if (!role) throw new NotFoundException('Role not found');
    return role;
  }

  async create(orgId: string, data: Partial<Role>) {
    return this.roleModel.create({ ...data, orgId });
  }

  async update(orgId: string, roleId: string, data: Partial<Role>) {
    const role = await this.roleModel
      .findOneAndUpdate({ _id: roleId, orgId }, data, { new: true })
      .lean()
      .exec();
    if (!role) throw new NotFoundException('Role not found');
    return role;
  }

  async delete(orgId: string, roleId: string) {
    const result = await this.roleModel
      .findOneAndDelete({ _id: roleId, orgId })
      .exec();
    if (!result) throw new NotFoundException('Role not found');
    return { message: 'Role deleted successfully' };
  }
}
