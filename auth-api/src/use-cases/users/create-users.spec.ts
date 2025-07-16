import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository';
import { compare } from 'bcryptjs';
import { beforeEach, describe, expect, it } from 'vitest';
import { BadRequestError } from '../@errors/bad-request-error';
import { CreateUserUseCase } from './create-user';

let usersRepository: InMemoryUsersRepository;
let sut: CreateUserUseCase;

describe('Create Users Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    sut = new CreateUserUseCase(usersRepository);
  });

  it('should be able to create an user', async () => {
    const { user } = await sut.execute({
      email: 'johndoe@example.com',
      password: '123456',
    });

    expect(user.id).toEqual(expect.any(String));
  });

  it('should has user password upon registration', async () => {
    const { user } = await sut.execute({
      email: 'johndoe@example.com',
      password: '123456',
    });

    const isPasswordHashed = await compare('123456', user.password_hash);

    expect(isPasswordHashed).toBe(true);
  });

  it('should not be able to create an user with same email', async () => {
    const email = 'johndoe@example.com';

    await sut.execute({
      email,
      password: '123456',
    });

    await expect(
      sut.execute({
        email,
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(BadRequestError);
  });
});
