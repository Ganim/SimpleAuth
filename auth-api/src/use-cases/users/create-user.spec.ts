import { InMemoryProfilesRepository } from '@/repositories/in-memory/in-memory-profiles-repository';
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository';
import { BadRequestError } from '@/use-cases/@errors/bad-request-error';
import { compare } from 'bcryptjs';
import { beforeEach, describe, expect, it } from 'vitest';
import { CreateUserUseCase } from './create-user';

let usersRepository: InMemoryUsersRepository;
let profilesRepository: InMemoryProfilesRepository;
let sut: CreateUserUseCase;

describe('Create User Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    profilesRepository = new InMemoryProfilesRepository();
    sut = new CreateUserUseCase(usersRepository, profilesRepository);
  });

  it('should be able to create an user and profile', async () => {
    const { user, profile } = await sut.execute({
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
    expect(profile).toBeDefined();
    expect(profile.name).toBe('John');
    expect(profile.surname).toBe('Doe');
    expect(profile.birthday).toEqual(new Date('1990-01-01'));
    expect(profile.location).toBe('Brazil');
    expect(profile.userId).toBe(user.id);
  });

  it('should generate a unique username if not provided', async () => {
    const { user } = await sut.execute({
      email: 'uniqueuser@example.com',
      password: '123456',
    });
    expect(user.username).toMatch(/^user[0-9a-f]{8}$/);
    // Garante que não existe outro usuário com esse username
    const found = await usersRepository.findByUsername(user.username ?? '');
    expect(found).toBeDefined();
    expect(found?.id).toBe(user.id);
  });

  it('should hash user password upon registration', async () => {
    const { user } = await sut.execute({
      email: 'johndoe@example.com',
      password: '123456',
      profile: {
        name: 'John',
      },
    });

    const isPasswordHashed = await compare('123456', user.password_hash);
    expect(isPasswordHashed).toBe(true);
  });

  it('should not be able to create an user with same email', async () => {
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
});
