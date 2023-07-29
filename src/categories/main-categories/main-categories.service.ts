import { Injectable } from '@nestjs/common';

@Injectable()
export class MainCategoriesService {
  getAll() {
    return 'GET ALL';
  }

  getById(id: string) {
    return 'GET WITH ID ' + id;
  }

  update(id: string) {
    return 'UPDATE WITH ID ' + id;
  }

  add() {
    return 'ADD A NEW ONE';
  }

  delete(id: string) {
    return 'DELETE WITH ID ' + id;
  }
}
