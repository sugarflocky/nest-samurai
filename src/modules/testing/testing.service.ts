import { Injectable } from '@nestjs/common';
import { TestingRepository } from './testing.repository';

@Injectable()
export class TestingService {
  constructor(private testingRepository: TestingRepository) {}
  async deleteAllData() {
    await this.testingRepository.deleteAllData();
  }
}
