import { InMemoryProfilesRepository } from '@/repositories/in-memory/in-memory-profiles-repository';
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository';
import { CreateUserAndProfileUseCase } from '@/use-cases/users/create-user-and-profile';

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
  const createUserAndProfileUseCase = new CreateUserAndProfileUseCase(
    usersRepository,
    profilesRepository,
  );
  return await createUserAndProfileUseCase.execute({
    email,
    password,
    username,
    role,
    profile,
  });
}
