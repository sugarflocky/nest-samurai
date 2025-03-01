import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { UserCreateDto, userMapper, UserViewModel } from './user.types';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async createUser(createDto: UserCreateDto): Promise<UserViewModel | null> {
    const user = await this.userRepository.createUser(createDto);
    if (!user) return null;
    return userMapper(user);
  }

  async deleteUser(id: string): Promise<true | null> {
    const result = await this.userRepository.deleteUser(id);
    if (!result) return null;
    return true;
  }
}
