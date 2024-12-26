import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { createMap, forMember, mapFrom, type Mapper } from '@automapper/core';
import { Injectable } from '@nestjs/common';
import { Product } from './entities/product.entity';
import { ProductDto } from './dto/product.dto';

@Injectable()
export class ProductsProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile() {
    return (mapper) => {
      createMap(
        mapper,
        Product,
        ProductDto,
        forMember(
          (d) => d.category_id,
          mapFrom((e) =>
            e.productCategories
              ?.filter(({ category }) => category)
              .map((item) => item.category?.id),
          ),
        ),
      );
    };
  }
}
