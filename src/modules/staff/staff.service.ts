import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, FilterQuery } from 'mongoose';
import { Staff, StaffDocument } from './schemas/staff.schema';
import { CreateStaffDto } from './dto/create-staff.dto';
import { UpdateStaffDto } from './dto/update-staff.dto';
import { UpdateStaffStatusDto } from './dto/update-staff-status.dto';
import { AssignBranchesDto } from './dto/assign-branches.dto';
import { QueryStaffDto } from './dto/query-staff.dto';
import { StaffRole } from '../../common/constants';
import { PaginatedResponseDto } from '../../common/dto/paginated-response.dto';

@Injectable()
export class StaffService {
  constructor(
    @InjectModel(Staff.name)
    private staffModel: Model<StaffDocument>,
  ) {}

  async findAll(
    orgId: string,
    query: QueryStaffDto,
  ): Promise<PaginatedResponseDto<Staff>> {
    const { page, limit, sortBy, sortOrder, role, branch, status } = query;
    const filter: FilterQuery<Staff> = { orgId };

    if (role) filter.role = role;
    if (status) filter.status = status;
    if (branch) filter.branches = branch;

    const [data, total] = await Promise.all([
      this.staffModel
        .find(filter)
        .sort({ [sortBy]: sortOrder === 'asc' ? 1 : -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean()
        .exec(),
      this.staffModel.countDocuments(filter).exec(),
    ]);

    return PaginatedResponseDto.create(data, total, page, limit);
  }

  async findById(orgId: string, staffId: string) {
    const staff = await this.staffModel
      .findOne({ _id: staffId, orgId })
      .populate('branches', 'name')
      .lean()
      .exec();
    if (!staff) throw new NotFoundException('Staff member not found');
    return staff;
  }

  async create(orgId: string, dto: CreateStaffDto) {
    // Map role from form value to display value
    const roleMap: Record<string, string> = {
      kitchen: 'Kitchen',
      admin: 'Admin',
      courier: 'Waiter',
      manager: 'Admin',
    };

    return this.staffModel.create({
      orgId,
      name: dto.fullName,
      email: dto.email.toLowerCase(),
      phone: dto.phoneNumber,
      role: roleMap[dto.role] || dto.role,
      branches: dto.selectedBranches,
      joinedDate: new Date(),
    });
  }

  async update(orgId: string, staffId: string, dto: UpdateStaffDto) {
    const raw = dto as any;
    const updateData: any = {};
    if (raw.fullName) updateData.name = raw.fullName;
    if (raw.email) updateData.email = raw.email.toLowerCase();
    if (raw.phoneNumber) updateData.phone = raw.phoneNumber;
    if (raw.role) updateData.role = raw.role;
    if (raw.selectedBranches) updateData.branches = raw.selectedBranches;

    const staff = await this.staffModel
      .findOneAndUpdate({ _id: staffId, orgId }, updateData, { new: true })
      .lean()
      .exec();
    if (!staff) throw new NotFoundException('Staff member not found');
    return staff;
  }

  async delete(orgId: string, staffId: string) {
    const result = await this.staffModel
      .findOneAndDelete({ _id: staffId, orgId })
      .exec();
    if (!result) throw new NotFoundException('Staff member not found');
    return { message: 'Staff member deleted successfully' };
  }

  async updateStatus(
    orgId: string,
    staffId: string,
    dto: UpdateStaffStatusDto,
  ) {
    const staff = await this.staffModel
      .findOneAndUpdate(
        { _id: staffId, orgId },
        { status: dto.status },
        { new: true },
      )
      .lean()
      .exec();
    if (!staff) throw new NotFoundException('Staff member not found');
    return staff;
  }

  async assignBranches(
    orgId: string,
    staffId: string,
    dto: AssignBranchesDto,
  ) {
    const staff = await this.staffModel
      .findOneAndUpdate(
        { _id: staffId, orgId },
        { branches: dto.selectedBranches },
        { new: true },
      )
      .lean()
      .exec();
    if (!staff) throw new NotFoundException('Staff member not found');
    return staff;
  }

  async getStats(orgId: string) {
    const stats = await this.staffModel.aggregate([
      { $match: { orgId } },
      {
        $group: {
          _id: '$role',
          count: { $sum: 1 },
        },
      },
    ]);

    const result = { total: 0, kitchen: 0, admins: 0, waitstaff: 0 };
    for (const s of stats) {
      result.total += s.count;
      if (s._id === 'Kitchen') result.kitchen = s.count;
      if (s._id === 'Admin') result.admins = s.count;
      if (s._id === 'Waiter') result.waitstaff = s.count;
    }
    return result;
  }

  async getPerformance(orgId: string, staffId: string) {
    const staff = await this.staffModel
      .findOne({ _id: staffId, orgId })
      .select('performance')
      .lean()
      .exec();
    if (!staff) throw new NotFoundException('Staff member not found');
    return staff.performance;
  }

  async getFeedback(orgId: string, staffId: string) {
    const staff = await this.staffModel
      .findOne({ _id: staffId, orgId })
      .select('feedback')
      .lean()
      .exec();
    if (!staff) throw new NotFoundException('Staff member not found');
    return staff.feedback;
  }

  async getRoles() {
    return Object.values(StaffRole).map((value) => {
      const labels: Record<string, string> = {
        admin: 'Administrator',
        manager: 'Branch Manager',
        kitchen: 'Kitchen Staff',
        courier: 'Delivery Partner',
      };
      return { value, label: labels[value] || value };
    });
  }
}
