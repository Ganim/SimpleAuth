import type { ProfilesRepository } from '@/repositories/profiles-repository';
import { BadRequestError } from '../@errors/bad-request-error';

interface DeleteProfileUseCaseRequest {
  userId: string;
}

export class DeleteProfileUseCase {
  constructor(private profilesRepository: ProfilesRepository) {}

  async execute({ userId }: DeleteProfileUseCaseRequest): Promise<void> {
    const profile = await this.profilesRepository.findByUserId(userId);
    if (!profile) throw new BadRequestError('Profile not found');
    await this.profilesRepository.delete(userId);
  }
}
