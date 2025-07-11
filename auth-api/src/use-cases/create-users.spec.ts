import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository';
import { compare } from 'bcryptjs';
import { describe, expect, it } from 'vitest';
import { CreteUserUseCase } from './create-user';
import { UserAlreadyExistsError } from './errors/user-already-exists-error';

describe('Create Users Use Case', () => {
  it('should be able to create an user', async () => {
    const usersRepository = new InMemoryUsersRepository();
    const createUserUseCase = new CreteUserUseCase(usersRepository);

    const { user } = await createUserUseCase.execute({
      email: 'johndoe@example.com',
      password: '123456',
    });

    expect(user.id).toEqual(expect.any(String));
  });

  it('should has user password upon registration', async () => {
    const usersRepository = new InMemoryUsersRepository();
    const createUserUseCase = new CreteUserUseCase(usersRepository);

    const { user } = await createUserUseCase.execute({
      email: 'johndoe@example.com',
      password: '123456',
    });

    const isPasswordHashed = await compare('123456', user.password_hash);

    expect(isPasswordHashed).toBe(true);
  });

  it('should not be able to create an user with same email', async () => {
    const usersRepository = new InMemoryUsersRepository();
    const createUserUseCase = new CreteUserUseCase(usersRepository);

    const email = 'johndoe@example.com';

    await createUserUseCase.execute({
      email,
      password: '123456',
    });

    await expect(
      createUserUseCase.execute({
        email,
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(UserAlreadyExistsError);
  });
});
