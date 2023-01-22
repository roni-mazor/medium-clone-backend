import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'
import { UserEntity } from 'src/user/user.entity';
import { Profile } from './types/profile.type';
import { ProfileResponse } from './types/profileResponse.interface';
import { FollowEntity } from './follow.entity';


@Injectable()
export class ProfileService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,
        @InjectRepository(FollowEntity)
        private readonly followRepository: Repository<FollowEntity>
    ) { }

    async findByUsername(username: string, currentUserId: number): Promise<Profile> {
        const user = await this.userRepository.findOne({ where: { username }, })
        if (!user) throw new HttpException('Profile does not exist', HttpStatus.NOT_FOUND)
        return { ...user, following: false }
    }

    async followProfile(usernameToFollow: string, currentUserId: number) {
        const user = await this.findByUsername(usernameToFollow, currentUserId)

        if (currentUserId === user.id) throw new HttpException('Follower and Follwing cant be equal', HttpStatus.BAD_REQUEST)

        const followRelation = await this.followRepository.findOne({ where: { followerId: currentUserId, followingId: user.id } })
        if (!followRelation) {
            const newFollow = new FollowEntity()
            newFollow.followerId = currentUserId
            newFollow.followingId = user.id
            await this.followRepository.save(newFollow)

        }
        return { ...user, following: true }

    }

    async unfollowProfile(usernameToFollow: string, currentUserId: number) {
        const user = await this.findByUsername(usernameToFollow, currentUserId)

        if (currentUserId === user.id) throw new HttpException('Follower and Follwing cant be equal', HttpStatus.BAD_REQUEST)

        const follow = await this.followRepository.findOne({ where: { followerId: currentUserId, followingId: user.id } })
        if (follow) {
            await this.followRepository.delete({ id: follow.id })
        }
        return { ...user, following: false }

    }

    buildProfileResponse(profile: Profile): ProfileResponse {
        delete profile.email
        return { profile }
    }
}
