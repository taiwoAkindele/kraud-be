import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, FilterQuery } from 'mongoose';
import { Branch, BranchDocument } from './schemas/branch.schema';
import { CreateBranchDto } from './dto/create-branch.dto';
import { UpdateBranchDto } from './dto/update-branch.dto';
import { QueryBranchesDto } from './dto/query-branches.dto';
import { BranchStatus } from '../../common/constants';

@Injectable()
export class BranchesService {
  constructor(
    @InjectModel(Branch.name)
    private branchModel: Model<BranchDocument>,
  ) {}

  async findAll(orgId: string, query: QueryBranchesDto) {
    const filter: FilterQuery<Branch> = { orgId };
    if (query.status) filter.status = query.status;
    return this.branchModel.find(filter).lean().exec();
  }

  async findById(orgId: string, branchId: string) {
    const branch = await this.branchModel
      .findOne({ _id: branchId, orgId })
      .lean()
      .exec();
    if (!branch) throw new NotFoundException('Branch not found');
    return branch;
  }

  async create(orgId: string, dto: CreateBranchDto) {
    return this.branchModel.create({
      orgId,
      name: dto.branchName,
      type: dto.branchType,
      manager: dto.branchManager,
      location: dto.location,
      openTime: dto.openTime,
      closeTime: dto.closeTime,
    });
  }

  async update(orgId: string, branchId: string, dto: UpdateBranchDto) {
    const raw = dto as any;
    const updateData: any = {};
    if (raw.branchName) updateData.name = raw.branchName;
    if (raw.branchType) updateData.type = raw.branchType;
    if (raw.branchManager) updateData.manager = raw.branchManager;
    if (raw.location) updateData.location = raw.location;
    if (raw.openTime) updateData.openTime = raw.openTime;
    if (raw.closeTime) updateData.closeTime = raw.closeTime;

    const branch = await this.branchModel
      .findOneAndUpdate({ _id: branchId, orgId }, updateData, { new: true })
      .lean()
      .exec();
    if (!branch) throw new NotFoundException('Branch not found');
    return branch;
  }

  async delete(orgId: string, branchId: string) {
    const result = await this.branchModel
      .findOneAndDelete({ _id: branchId, orgId })
      .exec();
    if (!result) throw new NotFoundException('Branch not found');
    return { message: 'Branch deleted successfully' };
  }

  async getStats(orgId: string) {
    const [stats] = await this.branchModel.aggregate([
      { $match: { orgId } },
      {
        $group: {
          _id: null,
          totalBranches: { $sum: 1 },
          activeBranches: {
            $sum: { $cond: [{ $eq: ['$status', BranchStatus.ACTIVE] }, 1, 0] },
          },
        },
      },
    ]);

    return {
      totalBranches: stats?.totalBranches || 0,
      activeBranches: stats?.activeBranches || 0,
      totalRevenue: 0, // Will be calculated from orders
    };
  }
}
