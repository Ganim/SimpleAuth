import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository';
import { beforeEach, describe, expect, it } from 'vitest';
import { BadRequestError } from '../@errors/bad-request-error';
import { ChangeMyEmailUseCase } from './change-my-email';

let usersRepository: InMemoryUsersRepository;
let sut: ChangeMyEmailUseCase;

describe('ChangeMyEmailUseCase', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    sut = new ChangeMyEmailUseCase(usersRepository);
  });

  it('deve alterar o email do próprio usuário', async () => {
    const user = await usersRepository.create({
      email: 'old@example.com',
      password_hash: '123456',
    });
    const result = await sut.execute({
      userId: user.id,
      email: 'new@example.com',
    });
    expect(result.user.email).toBe('new@example.com');
  });

  it('deve lançar erro se usuário não existir', async () => {
    await expect(() =>
      sut.execute({ userId: 'notfound', email: 'fail@example.com' }),
    ).rejects.toBeInstanceOf(BadRequestError);
  });

  it('não deve permitir alterar para um email já existente', async () => {
    await usersRepository.create({
      email: 'user1@example.com',
      password_hash: '123456',
    });
    const user2 = await usersRepository.create({
      email: 'user2@example.com',
      password_hash: '123456',
    });
    await expect(() =>
      sut.execute({ userId: user2.id, email: 'user1@example.com' }),
    ).rejects.toBeInstanceOf(BadRequestError);
  });
});
