import { Controller, Delete, Get, Param, Post, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { User } from 'src/user/decorators/user.decorator';
import { AuthGuard } from 'src/user/guards/auth.guard';
import { ProfileService } from './profile.service';
import { ProfileResponse } from './types/profileResponse.interface';


@Controller('api/profiles')
export class ProfileController {
    constructor(private readonly profileService: ProfileService) { }
    @Get('/:username')
    async findByUsername(@Param('username') username: string, @User('id') currentUserId: number): Promise<ProfileResponse> {
        console.log(currentUserId)
        const user = await this.profileService.findByUsername(username, currentUserId)
        return this.profileService.buildProfileResponse(user)
    }

    @Post('/:username/follow')
    @UsePipes(new ValidationPipe()) // important to use this validation pipe or else the dto class wont take into affect
    @UseGuards(AuthGuard)
    async followUser(@Param('username') username: string, @User('id') currentUserId: number): Promise<ProfileResponse> {
        const user = await this.profileService.followProfile(username, currentUserId)
        return this.profileService.buildProfileResponse(user)
    }

    @Delete('/:username/follow')
    @UsePipes(new ValidationPipe()) // important to use this validation pipe or else the dto class wont take into affect
    @UseGuards(AuthGuard)
    async unfollowUser(@Param('username') username: string, @User('id') currentUserId: number): Promise<ProfileResponse> {
        const user = await this.profileService.unfollowProfile(username, currentUserId)
        return this.profileService.buildProfileResponse(user)
    }
}