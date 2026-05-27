import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import type { CreateResourceDto } from './dto/create-resource.dto';
import type { FindResourceQueryDto } from './dto/find-resources-query.dto';
import type { UpdateResourceDto } from './dto/update-resource.dto';
import type { AssignResourceDto } from './dto/assign-resource.dto';
import { Resource } from './resources.model';
import { User } from 'src/users/users.model';

/**
 * In the create() method, async/await is not used because the focus is on returning the newly
 * created record with the generated ID. By not using async/await, the method waits for the
 * Promise returned by save() to resolve, allowing it to obtain the generated ID and return
 * the complete record.
 *
 * On the other hand, in the update() and remove() methods, the focus is on updating or removing
 * the record without needing to obtain any specific information from the database. In these
 * cases, the methods can return immediately after initiating the update or removal operation,
 * without the need to wait for the Promise to resolve.
 */
@Injectable()
export class ResourcesService {
  constructor(
    @InjectRepository(Resource)
    private readonly resourcesRepository: Repository<Resource>,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  /**
   * Finds all resources based on the provided query parameters.
   * @param query - The query parameters for finding resources (type, status).
   * @returns A Promise with a list of resources.
   */
  findAll(query: FindResourceQueryDto): Promise<Resource[]> {
    const { type, status } = query;
    const where: FindOptionsWhere<Resource> = {};

    if (type !== undefined) {
      where.type = type;
    }

    if (status !== undefined) {
      where.status = status;
    }

    return this.resourcesRepository.find({ where });
  }

  /**
   * Finds a resource by their ID.
   * @param id - The ID of the resource to find.
   * @returns A Promise with the found resource.
   * @throws NotFoundException if the resource is not found.
   */
  async findOne(id: number): Promise<Resource> {
    const resource = await this.resourcesRepository.findOneBy({ id });

    if (!resource) {
      throw new NotFoundException(`Resource with id ${id} not found`);
    }

    return resource;
  }

  /**
   * Creates a new resource on the database.
   * @param createResourceDto - The DTO for creating a new resource.
   * @returns A Promise with the created resource.
   */
  create(createResourceDto: CreateResourceDto): Promise<Resource> {
    const newResource = this.resourcesRepository.create({
      name: createResourceDto.name,
      type: createResourceDto.type,
      status: 'available',
      location: createResourceDto.location,
      createdAt: new Date().toISOString(),
    });

    return this.resourcesRepository.save(newResource);
  }

  async update(
    id: number,
    updateResourceDto: UpdateResourceDto,
  ): Promise<Resource> {
    const currentResource = await this.findOne(id);

    const {
      name = currentResource.name,
      type = currentResource.type,
      status = currentResource.status,
      location = currentResource.location,
    } = updateResourceDto;

    const updatedResource = this.resourcesRepository.create({
      ...currentResource,
      name,
      type,
      status,
      location,
    });

    return this.resourcesRepository.save(updatedResource);
  }

  async assign(
    id: number,
    assignResourceDto: AssignResourceDto,
  ): Promise<Resource> {
    const resource = await this.findOne(id);
    const user = await this.usersRepository.findOneBy({
      id: assignResourceDto.userId,
    });

    if (!user) {
      throw new NotFoundException(
        `User with id ${assignResourceDto.userId} not found`,
      );
    }

    if (resource.status === 'assigned') {
      throw new BadRequestException(
        `Resource with id ${id} is already assigned`,
      );
    }

    const assignedResource = this.resourcesRepository.create({
      ...resource,
      status: 'assigned',
      assignedToUserId: user.id,
    });

    return this.resourcesRepository.save(assignedResource);
  }

  async release(id: number): Promise<Resource> {
    const resource = await this.findOne(id);
    const releasedResource = this.resourcesRepository.create({
      ...resource,
      status: 'available',
      assignedToUserId: null,
    });

    return this.resourcesRepository.save(releasedResource);
  }

  async remove(id: number): Promise<Resource> {
    const currentResource = await this.findOne(id);

    return this.resourcesRepository.remove(currentResource);
  }
}
