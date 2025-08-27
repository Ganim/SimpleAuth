import type { UserRole } from '@/@types/user-role';
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository';
import { CreateUserUseCase } from '@/use-cases/core/users/create-user';

interface makeUserProps {
  email: string;
  password: string;
  username?: string;
  role?: UserRole;
  name?: string;
  surname?: string;
  birthday?: Date;
  location?: string;
  avatarUrl?: string;
  usersRepository: InMemoryUsersRepository;
}

export async function makeUser({
  email,
  password,
  username = '',
  role = 'USER',
  name = '',
  surname = '',
  birthday,
  location = '',
  avatarUrl = '',
  usersRepository,
}: makeUserProps) {
  const createUserUseCase = new CreateUserUseCase(usersRepository);

  const newMockUser = {
    email,
    password,
    username,
    role,
    profile: {
      name,
      surname,
      birthday,
      location,
      avatarUrl,
    },
  };

  return await createUserUseCase.execute(newMockUser);
}
