import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthGuard } from "src/user/guards/auth.guard";
import { UserEntity } from "../user/user.entity";
import { FollowEntity } from "./follow.entity";
import { ProfileController } from "./profile.controller";
import { ProfileService } from "./profile.service";

@Module({
    imports: [TypeOrmModule.forFeature([UserEntity, FollowEntity])],
    controllers: [ProfileController],
    providers: [ProfileService, AuthGuard],
})
export class ProfileModule { }