import { HttpException, Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { FirebaseImplementation } from 'src/shared/providers/firebase/implementation';
import { CategoryType, ICategory, ISetCategory } from './category.types';
import { SetCategoryDto } from './dto/set-category.dto';

@Injectable()
export class CategoryService {
  constructor(private readonly firebaseService: FirebaseImplementation) {}

  //These method will be used to validate the creating of a new subcategory. Also to update.
  async ValidateCategory(categoryId: string, sheetId: string) {
    if (!categoryId) {
      throw new HttpException(
        'SERVICE: Subcategory must have a main category id',
        400,
      );
    }

    const mainCategory = await this.findOne(sheetId, categoryId);

    if (!mainCategory) {
      throw new HttpException(
        'SERVICE: Failed to find main category for subcategory',
        404,
      );
    }
  }

  async create(createCategoryDto: CreateCategoryDto): Promise<string> {
    if (createCategoryDto.type == 'subcategory') {
      await this.ValidateCategory(
        createCategoryDto?.mainCategoryId,
        createCategoryDto.sheetId,
      );
    }

    const resp = await this.firebaseService.Create({
      collection: `sheets/${createCategoryDto.sheetId}/category`,
      payload: createCategoryDto,
    });

    if (!resp) {
      throw new HttpException('SERVICE: Failed to create category', 400);
    }

    return resp;
  }

  async findAll(sheetId: string): Promise<ICategory[]> {
    const resp = await this.firebaseService.findAll<ICategory>({
      collection: `sheets/${sheetId}/category`,
    });

    if (resp.length === 0) {
      throw new HttpException(
        'SERVICE: No category found for this sheetId: ' + sheetId,
        404,
      );
    }

    return resp;
  }

  async findAllSubcategories(
    sheetId: string,
    categoryId: string,
  ): Promise<ICategory[]> {
    const resp = await this.firebaseService.findAll<ICategory>({
      collection: `sheets/${sheetId}/category`,
      query: [
        {
          field: 'mainCategoryId',
          condition: '==',
          value: categoryId,
        },
      ],
    });

    if (resp.length === 0) {
      throw new HttpException(
        'SERVICE: No category found for this Category Id: ' + categoryId,
        404,
      );
    }

    return resp;
  }

  async findOne(sheetId: string, id: string): Promise<ICategory> {
    const resp = await this.firebaseService.findOne<ICategory>({
      collection: `sheets/${sheetId}/category`,
      id,
    });

    if (!resp) {
      throw new HttpException('SERVICE: Failed to find category', 404);
    }
    return resp;
  }

  async update(
    sheetId: string,
    id: string,
    updateCategoryDto: UpdateCategoryDto,
  ) {
    await this.firebaseService.UpdateOne({
      collection: `sheets/${sheetId}/category`,
      id,
      payload: {
        name: updateCategoryDto.name,
        image_path: updateCategoryDto.image_path,
      },
    });
  }

  async setCategory(
    sheetId: string,
    id: string,
    setCategoryDto: SetCategoryDto,
  ) {
    const category = await this.findOne(sheetId, id);

    let categoryF: ISetCategory = {
      sheetId: category.sheetId,
      ownerId: category.ownerId,
      name: setCategoryDto?.name ?? category.name,
      image_path: setCategoryDto?.image_path ?? category.image_path,
      type: setCategoryDto.type as CategoryType,
    };

    if (setCategoryDto.type === 'subcategory') {
      await this.ValidateCategory(setCategoryDto?.mainCategoryId, sheetId);

      categoryF = {
        ...categoryF,
        mainCategoryId: setCategoryDto.mainCategoryId,
      };
    }

    await this.firebaseService.SetDoc({
      collection: `sheets/${sheetId}/category`,
      id,
      payload: {
        ...categoryF,
      },
    });
  }

  async remove(sheetId: string, id: string) {
    await this.firebaseService.DeleteOne({
      collection: `sheets/${sheetId}`,
      id,
    });
  }
}
