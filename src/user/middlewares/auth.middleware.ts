import { NestMiddleware, Injectable } from '@nestjs/common'

import { NextFunction, Response } from 'express'
import { ExpressRequest } from 'src/types/expressRequest.interface'
import { JwtPayload, verify } from 'jsonwebtoken'
import { JWT_SECRET } from 'src/config'
import { UserService } from '../user.service'
import { DecodedUser } from '../types/decodedUser.interface'

@Injectable()
export class AuthMiddleware implements NestMiddleware {
    constructor(private readonly userService: UserService) { }

    async use(req: ExpressRequest, _: Response, next: NextFunction) {
        if (!req.headers.authorization) {
            req.user = null
            return next()
        }
        const token = req.headers.authorization.split(' ')[1]

        try {
            const decode = verify(token, JWT_SECRET) as DecodedUser
            const user = await this.userService.findById(decode.id)
            req.user = user
            return next()
        } catch (err) {
            req.user = null
            return next()
        }

    }
}