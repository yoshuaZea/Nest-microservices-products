import { HttpStatus, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { PrismaClient } from '@prisma/client';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginationDto } from 'src/common';

@Injectable()
export class ProductsService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger('ProductService');

  onModuleInit() {
    this.$connect();
    this.logger.log('Database conntected');
  }
  create(createProductDto: CreateProductDto) {
    return this.product.create({
      data: createProductDto,
    });
  }

  async findAll(paginationDto: PaginationDto) {
    const { limit, page } = paginationDto;

    // * Meta data
    const totalPages = await this.product.count({
      where: { available: true },
    });
    const lastPage = Math.ceil(totalPages / limit);

    return {
      data: await this.product.findMany({
        where: { available: true },
        take: limit,
        skip: (page - 1) * limit,
      }),
      meta: {
        lastPage,
        page,
        total: totalPages,
      },
    };
  }

  async findOne(id: number) {
    const product = await this.product.findFirst({
      where: {
        id,
        available: true,
      },
    });

    if (!product) {
      throw new RpcException({
        message: `Product with id #${id} was not found`,
        status: HttpStatus.NOT_FOUND,
      });
    }

    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    await this.findOne(id);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id: _id, ...data } = updateProductDto;

    return this.product.update({
      where: { id },
      data,
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    // * HARD DELETE
    // return this.product.delete({
    //   where: { id },
    // });

    return this.product.update({
      where: { id },
      data: {
        available: false,
      },
    });
  }

  async validateProducts(ids: number[]) {
    // * Remove duplicated ids
    ids = Array.from(new Set(ids));

    const products = await this.product.findMany({
      where: {
        id: {
          in: ids,
        },
      },
    });

    if (products.length != ids.length) {
      throw new RpcException({
        status: HttpStatus.BAD_REQUEST,
        message: 'Some products were not found',
      });
    }

    return products;
  }
}
