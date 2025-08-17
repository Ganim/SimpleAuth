import { InMemoryProfilesRepository } from '@/repositories/in-memory/in-memory-profiles-repository';
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository';
import { CreateUserUseCase } from '@/use-cases/users/create-user';

export async function makeUser({
  email,
  password,
  username = '',
  role = 'USER',
  profile = {},
  usersRepository,
  profilesRepository,
}: {
  email: string;
  password: string;
  username?: string;
  role?: 'USER' | 'MANAGER' | 'ADMIN';
  profile?: {
    name?: string;
    surname?: string;
    birthday?: Date;
    location?: string;
    avatarUrl?: string;
  };
  usersRepository: InMemoryUsersRepository;
  profilesRepository: InMemoryProfilesRepository;
}) {
  const createUserUseCase = new CreateUserUseCase(
    usersRepository,
    profilesRepository,
  );
  return await createUserUseCase.execute({
    email,
    password,
    username,
    role,
    profile,
  });
}
