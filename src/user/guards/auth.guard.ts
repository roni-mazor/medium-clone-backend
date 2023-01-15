import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { ExpressRequest } from "src/types/expressRequest.interface";

@Injectable()
export class AuthGuard implements CanActivate {
    canActivate(ctx: ExecutionContext): boolean {
        const request = ctx.switchToHttp().getRequest<ExpressRequest>()

        if (request.user) return true
        throw new HttpException('Not Authorized', HttpStatus.UNAUTHORIZED)
    }
}