import { BadRequestError } from '@/@errors/use-cases/bad-request-error';
import { Email } from '@/entities/core/value-objects/email';
import { Username } from '@/entities/core/value-objects/username';
import { InMemoryUsersRepository } from '@/repositories/core/in-memory/in-memory-users-repository';
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
      password: 'Pass@123',
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

  // REJECTS
  it('should not allow creating a user with an existing email', async () => {
    const email = 'johndoe@example.com';

    await sut.execute({
      email,
      password: 'Pass@123',
      profile: { name: 'John' },
    });

    await expect(() =>
      sut.execute({
        email,
        password: 'Pass@123',
        profile: { name: 'John' },
      }),
    ).rejects.toBeInstanceOf(BadRequestError);
  });

  it('should not allow creating a user with an existing username', async () => {
    const username = 'johnny';

    await sut.execute({
      email: 'johnny@example.com',
      password: 'Pass@123',
      username,
      profile: { name: 'Johnny' },
    });

    await expect(() =>
      sut.execute({
        email: 'other@example.com',
        password: 'Pass@123',
        username,
        profile: { name: 'Johnny' },
      }),
    ).rejects.toBeInstanceOf(BadRequestError);
  });

  // VALIDATIONS

  it('should generate a unique username if not provided', async () => {
    const { user } = await sut.execute({
      email: 'uniqueuser@example.com',
      password: 'Pass@123',
    });

    expect(user.username).toMatch(/^user[0-9a-f]{8}$/);

    const storagedUser = await usersRepository.findByUsername(
      Username.create(user.username),
    );
    expect(storagedUser).toBeDefined();
    expect(storagedUser?.id.toString()).toBe(user.id);
  });

  it('should hash the password upon registration', async () => {
    const { user } = await sut.execute({
      email: 'johndoe@example.com',
      password: 'Pass@123',
      profile: {
        name: 'John',
      },
    });

    const storagedUser = await usersRepository.findByEmail(
      Email.create(user.email),
    );
    expect(storagedUser).toBeDefined();
    const isPasswordHashed = await compare(
      'Pass@123',
      storagedUser!.password.toString(),
    );
    expect(isPasswordHashed).toBe(true);
  });

  it('should not allow invalid email format', () => {
    expect(() => Email.create('invalid-email')).toThrow(BadRequestError);
    expect(() => Email.create('user@invalid')).toThrow(BadRequestError);
    expect(() => Email.create('user@.com')).toThrow(BadRequestError);
    expect(() => Email.create('user@com')).toThrow(BadRequestError);
    expect(() => Email.create('user.com')).toThrow(BadRequestError);
  });
});
