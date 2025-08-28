import { BadRequestError } from '@/@errors/use-cases/bad-request-error';
import { ResourceNotFoundError } from '@/@errors/use-cases/resource-not-found';
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository';
import { makeUser } from '@/tests/factories/make-user';
import { beforeEach, describe, expect, it } from 'vitest';
import { ChangeMyUsernameUseCase } from './change-my-username';

let usersRepository: InMemoryUsersRepository;
let sut: ChangeMyUsernameUseCase;

describe('Change My Username Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    sut = new ChangeMyUsernameUseCase(usersRepository);
  });

  it('should change own username', async () => {
    const { user } = await makeUser({
      email: 'user@example.com',
      password: '123456',
      username: 'olduser',
      usersRepository,
    });
    const result = await sut.execute({ userId: user.id, username: 'newuser' });
    expect(result.user.username).toBe('newuser');

    const allUsers = await usersRepository.listAll();
    expect(allUsers).toHaveLength(1);
  });

  it('should throw ResourceNotFoundError if user does not exist', async () => {
    await expect(
      sut.execute({ userId: 'notfound', username: 'fail' }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it('should throw ResourceNotFoundError if user is deleted', async () => {
    const { user } = await makeUser({
      email: 'deleted@example.com',
      password: '123456',
      username: 'deleteduser',
      deletedAt: new Date(),
      usersRepository,
    });
    await expect(
      sut.execute({ userId: user.id, username: 'fail' }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it('should not allow changing to an already existing username', async () => {
    await makeUser({
      email: 'user1@example.com',
      password: '123456',
      username: 'userone',
      usersRepository,
    });
    const { user: user2 } = await makeUser({
      email: 'user2@example.com',
      password: '123456',
      username: 'usertwo',
      usersRepository,
    });
    await expect(
      sut.execute({ userId: user2.id, username: 'userone' }),
    ).rejects.toBeInstanceOf(BadRequestError);
  });

  it('should keep correct user count after username change', async () => {
    await makeUser({
      email: 'user1@example.com',
      password: '123456',
      username: 'userone',
      usersRepository,
    });
    const { user } = await makeUser({
      email: 'user2@example.com',
      password: '123456',
      username: 'usertwo',
      usersRepository,
    });
    await sut.execute({ userId: user.id, username: 'changeduser' });
    const allUsers = await usersRepository.listAll();
    expect(allUsers).toHaveLength(2);
  });
});
