import { Injectable } from '@nestjs/common';

@Injectable()
export class CommentsService {
  getById(id: string) {
    return 'get by id';
  }

  update(commentDTO: object, id: string) {
    return 'update';
  }

  delete(id: string) {
    return 'delete';
  }

  create(commentDTO: object, userId: string) {
    return 'create';
  }
}
