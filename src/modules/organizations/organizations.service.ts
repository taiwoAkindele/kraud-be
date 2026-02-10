import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  Organization,
  OrganizationDocument,
} from './schemas/organization.schema';

@Injectable()
export class OrganizationsService {
  constructor(
    @InjectModel(Organization.name)
    private organizationModel: Model<OrganizationDocument>,
  ) {}

  async create(
    name: string,
    createdBy?: Types.ObjectId,
  ): Promise<OrganizationDocument> {
    const slug = this.generateSlug(name);
    return this.organizationModel.create({ name, slug, createdBy });
  }

  async findById(id: string): Promise<OrganizationDocument | null> {
    return this.organizationModel.findById(id).lean().exec();
  }

  async findBySlug(slug: string): Promise<OrganizationDocument | null> {
    return this.organizationModel.findOne({ slug }).lean().exec();
  }

  private generateSlug(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  }
}
