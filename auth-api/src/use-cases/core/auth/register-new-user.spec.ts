import { BadRequestError } from '@/@errors/use-cases/bad-request-error';
import { Email } from '@/entities/core/value-objects/email';
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository';
import { compare } from 'bcryptjs';
import { beforeEach, describe, expect, it } from 'vitest';
import { RegisterNewUserUseCase } from './register-new-user';

let usersRepository: InMemoryUsersRepository;
let sut: RegisterNewUserUseCase;

describe('Register New User Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    sut = new RegisterNewUserUseCase(usersRepository);
  });

  it('should register a new user with profile data', async () => {
    const { user } = await sut.execute({
      email: 'johndoe@example.com',
      password: '123456',
      profile: {
        name: 'John',
        surname: 'Doe',
        birthday: new Date('1990-01-01'),
        location: 'Brazil',
        avatarUrl: 'avatar.png',
      },
    });

    expect(user.id).toEqual(expect.any(String));
    expect(user.profile?.name).toBe('John');
    expect(user.profile?.surname).toBe('Doe');
    expect(user.profile?.birthday).toEqual(new Date('1990-01-01'));
    expect(user.profile?.location).toBe('Brazil');
    expect(user.profile?.avatarUrl).toBe('avatar.png');

    const allUsers = await usersRepository.listAll();
    expect(allUsers).toHaveLength(1);
  });

  it('should generate a unique username if not provided', async () => {
    const { user } = await sut.execute({
      email: 'uniqueuser@example.com',
      password: '123456',
    });
    expect(user.username).toMatch(/^user[0-9a-f]{8}$/);

    const found = await usersRepository.findByUsername(user.username ?? '');
    expect(found).toBeDefined();
    expect(found?.id.toString()).toBe(user.id);

    const allUsers = await usersRepository.listAll();
    expect(allUsers).toHaveLength(1);
  });

  it('should hash the user password upon registration', async () => {
    const { user } = await sut.execute({
      email: 'hashme@example.com',
      password: 'mypassword',
    });

    const created = await usersRepository.findById(user.id);
    expect(created).toBeDefined();

    const isPasswordHashed = await compare('mypassword', created!.passwordHash);
    expect(isPasswordHashed).toBe(true);
  });

  it('should not allow registering a user with an existing email', async () => {
    const email = 'duplicate@example.com';
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

    const allUsers = await usersRepository.listAll();
    expect(allUsers).toHaveLength(1);
  });

  it('should not allow registering a user with an existing username', async () => {
    await sut.execute({
      email: 'user1@example.com',
      password: '123456',
      username: 'sameuser',
    });
    await expect(
      sut.execute({
        email: 'user2@example.com',
        password: '123456',
        username: 'sameuser',
      }),
    ).rejects.toBeInstanceOf(BadRequestError);

    const allUsers = await usersRepository.listAll();
    expect(allUsers).toHaveLength(1);
  });

  it('should keep correct user count after multiple registrations', async () => {
    await sut.execute({
      email: 'user1@example.com',
      password: '123456',
    });
    await sut.execute({
      email: 'user2@example.com',
      password: '123456',
    });

    const allUsers = await usersRepository.listAll();
    expect(allUsers).toHaveLength(2);
  });

  it('should not allow invalid email format (Email VO)', () => {
    expect(() => new Email('invalid-email')).toThrow(BadRequestError);
    expect(() => new Email('user@invalid')).toThrow(BadRequestError);
    expect(() => new Email('user@.com')).toThrow(BadRequestError);
    expect(() => new Email('user@com')).toThrow(BadRequestError);
    expect(() => new Email('user.com')).toThrow(BadRequestError);
  });
});
