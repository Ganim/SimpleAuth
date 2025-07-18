import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository';
import { beforeEach, describe, expect, it } from 'vitest';
import { BadRequestError } from '../@errors/bad-request-error';
import { EditUserUseCase } from './edit-user';

let usersRepository: InMemoryUsersRepository;
let sut: EditUserUseCase;

describe('EditUserUseCase', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    sut = new EditUserUseCase(usersRepository);
  });

  it('should update user email and role', async () => {
    const created = await usersRepository.create({
      email: 'edituser@example.com',
      password_hash: 'hash',
    });
    const { user } = await sut.execute({
      id: created.id,
      email: 'new@example.com',
      role: 'ADMIN',
    });
    expect(user.email).toBe('new@example.com');
    expect(user.role).toBe('ADMIN');
  });

  it('should throw BadRequestError if user not found', async () => {
    await expect(() =>
      sut.execute({ id: 'notfound', email: 'fail@example.com' }),
    ).rejects.toBeInstanceOf(BadRequestError);
  });
});
