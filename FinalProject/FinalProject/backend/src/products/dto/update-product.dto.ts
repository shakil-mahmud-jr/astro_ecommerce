import { PartialType } from '@nestjs/mapped-types';
import { CreateProductDto } from './create-product.dto';

// This class will inherit all properties from CreateProductDto but make them optional
export class UpdateProductDto extends PartialType(CreateProductDto) {
  // All properties from CreateProductDto are inherited and made optional
  // No need to redeclare properties as they are automatically inherited
} 