import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards, HttpCode, HttpStatus, UploadedFile, UseInterceptors } from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { RolesGuard, Roles } from '../auth/guards/roles.guard'
import { GetProductsUseCase, CreateProductUseCase, UpdateProductUseCase, DeleteProductUseCase } from '../../core/application/use-cases/products/product.use-cases'
import { CreateProductDto } from './dto/create-product.dto'

@Controller('products')
@UseGuards(JwtAuthGuard)
export class ProductsController {
  constructor(
    private readonly getProductsUseCase: GetProductsUseCase,
    private readonly createProductUseCase: CreateProductUseCase,
    private readonly updateProductUseCase: UpdateProductUseCase,
    private readonly deleteProductUseCase: DeleteProductUseCase,
  ) {}

  @Get()
  findAll(@Query('search') search?: string) {
    return this.getProductsUseCase.execute(search)
  }

  @Post()
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @UseInterceptors(FileInterceptor('image'))
  create(
    @Body() dto: CreateProductDto,
    @UploadedFile() image?: Express.Multer.File,
  ) {
    const imageFile = image
      ? { buffer: image.buffer, mimeType: image.mimetype, originalname: image.originalname }
      : undefined
    return this.createProductUseCase.execute(dto, imageFile)
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @UseInterceptors(FileInterceptor('image'))
  update(
    @Param('id') id: string,
    @Body() dto: Partial<CreateProductDto>,
    @UploadedFile() image?: Express.Multer.File,
  ) {
    const imageFile = image
      ? { buffer: image.buffer, mimeType: image.mimetype, originalname: image.originalname }
      : undefined
    return this.updateProductUseCase.execute(id, dto, imageFile)
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.deleteProductUseCase.execute(id)
  }
}
