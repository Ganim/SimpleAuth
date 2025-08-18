import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository';
import { compare } from 'bcryptjs';
import { beforeEach, describe, expect, it } from 'vitest';
import { BadRequestError } from '../@errors/bad-request-error';
import { ChangeMyPasswordUseCase } from './change-my-password';

let usersRepository: InMemoryUsersRepository;
let sut: ChangeMyPasswordUseCase;

describe('ChangeMyPasswordUseCase', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    sut = new ChangeMyPasswordUseCase(usersRepository);
  });

  it('should change own password', async () => {
    const user = await usersRepository.create({
      email: 'user@example.com',
      password_hash: 'oldpass',
    });
    const result = await sut.execute({ userId: user.id, password: 'newpass' });
    const isPasswordHashed = await compare(
      'newpass',
      result.user.password_hash,
    );
    expect(isPasswordHashed).toBe(true);
  });

  it('should throw BadRequestError if user does not exist', async () => {
    await expect(() =>
      sut.execute({ userId: 'notfound', password: 'fail' }),
    ).rejects.toBeInstanceOf(BadRequestError);
  });
});
