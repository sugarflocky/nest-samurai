import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { validate as isUuid } from 'uuid';

@Injectable()
export class UuidValidationPipe implements PipeTransform {
  private readonly uuidFields = ['id', 'blogId', 'postId', 'commentId'];

  transform(value: any, metadata: ArgumentMetadata) {
    if (
      metadata.type === 'param' &&
      metadata.data &&
      this.uuidFields.includes(metadata.data)
    ) {
      if (!isUuid(value)) {
        throw new BadRequestException(
          `Invalid UUID format for ${metadata.data}: ${value}`,
        );
      }
    }
    return value;
  }
}
