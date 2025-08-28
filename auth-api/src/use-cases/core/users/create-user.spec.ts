import { BadRequestError } from '@/@errors/use-cases/bad-request-error';
import { Email } from '@/entities/core/value-objects/email';
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository';
import { compare } from 'bcryptjs';
import { beforeEach, describe, expect, it } from 'vitest';
import { CreateUserUseCase } from './create-user';

let usersRepository: InMemoryUsersRepository;
let sut: CreateUserUseCase;

describe('Create User Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    sut = new CreateUserUseCase(usersRepository);
  });

  it('should create a user with profile', async () => {
    const { user } = await sut.execute({
      email: 'johndoe@example.com',
      password: '123456',
      profile: {
        name: 'John',
        surname: 'Doe',
        birthday: new Date('1990-01-01'),
        location: 'Brazil',
      },
    });

    expect(user.id).toEqual(expect.any(String));
    expect(user.profile).toBeDefined();
    expect(user.profile?.name).toBe('John');
    expect(user.profile?.surname).toBe('Doe');
    expect(user.profile?.birthday).toEqual(new Date('1990-01-01'));
    expect(user.profile?.location).toBe('Brazil');
  });

  it('should generate a unique username if not provided', async () => {
    const { user } = await sut.execute({
      email: 'uniqueuser@example.com',
      password: '123456',
    });

    expect(user.username).toMatch(/^user[0-9a-f]{8}$/);

    const storagedUser = await usersRepository.findByUsername(user.username);
    expect(storagedUser).toBeDefined();
    expect(storagedUser?.id.toString()).toBe(user.id);
  });

  it('should hash the password upon registration', async () => {
    const { user } = await sut.execute({
      email: 'johndoe@example.com',
      password: '123456',
      profile: {
        name: 'John',
      },
    });

    const storagedUser = await usersRepository.findByEmail(
      new Email(user.email),
    );
    expect(storagedUser).toBeDefined();
    const isPasswordHashed = await compare(
      '123456',
      storagedUser!.passwordHash,
    );
    expect(isPasswordHashed).toBe(true);
  });

  it('should not allow creating a user with an existing email', async () => {
    const email = 'johndoe@example.com';

    await sut.execute({
      email,
      password: '123456',
      profile: { name: 'John' },
    });

    await expect(() =>
      sut.execute({
        email,
        password: '123456',
        profile: { name: 'John' },
      }),
    ).rejects.toBeInstanceOf(BadRequestError);
  });

  it('should not allow creating a user with an existing username', async () => {
    const username = 'johnny';

    await sut.execute({
      email: 'johnny@example.com',
      password: '123456',
      username,
      profile: { name: 'Johnny' },
    });

    await expect(() =>
      sut.execute({
        email: 'other@example.com',
        password: '123456',
        username,
        profile: { name: 'Johnny' },
      }),
    ).rejects.toBeInstanceOf(BadRequestError);
  });

  it('should create a user with deletedAt (soft deleted) [TEST ONLY]', async () => {
    const deletedDate = new Date('2020-01-01');
    const { user } = await sut.execute({
      email: 'deleteduser@example.com',
      password: '123456',
      profile: {
        name: 'Deleted',
        surname: 'User',
      },
      deletedAt: deletedDate,
    });

    expect(user.id).toEqual(expect.any(String));
    expect(user.deletedAt).toEqual(deletedDate);

    const storagedUser = await usersRepository.findByEmail(
      new Email(user.email),
    );
    expect(storagedUser).toBeDefined();
    expect(storagedUser?.deletedAt).toEqual(deletedDate);
    expect(storagedUser?.isDeleted).toBe(true);
  });

  it('should not allow invalid email format (Email VO)', () => {
    expect(() => new Email('invalid-email')).toThrow(BadRequestError);
    expect(() => new Email('user@invalid')).toThrow(BadRequestError);
    expect(() => new Email('user@.com')).toThrow(BadRequestError);
    expect(() => new Email('user@com')).toThrow(BadRequestError);
    expect(() => new Email('user.com')).toThrow(BadRequestError);
  });
});
