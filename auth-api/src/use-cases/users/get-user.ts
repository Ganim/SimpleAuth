import type { ProfilesRepository } from '@/repositories/profiles-repository';
import type { UsersRepository } from '@/repositories/users-repository';
import { BadRequestError } from '@/use-cases/@errors/bad-request-error';
import type { User, UserProfile } from 'generated/prisma/client';

interface GetUserUseCaseRequest {
  id: string;
}

interface GetUserUseCaseResponse {
  user: User;
  profile: UserProfile | null;
}

export class GetUserUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private profilesRepository: ProfilesRepository,
  ) {}

  async execute({
    id,
  }: GetUserUseCaseRequest): Promise<GetUserUseCaseResponse> {
    const user = await this.usersRepository.findById(id);
    if (!user || user.deletedAt) throw new BadRequestError('User not found');
    const profile = await this.profilesRepository.findByUserId(id);
    return { user, profile };
  }
}
