import { ForbiddenException, Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
    use(req: any, res: any, next: () => void) {
        try {
            const token = req.headers['x-auth-token'];
            if (!token) {
                throw new UnauthorizedException("Incomplere Request");
            }

            if (token !== "my-name-is") {  
                throw new ForbiddenException("Operation not allowed");
            }

            // token login can be written here 
            // validation from jwt token can be done from here
            next();
        } catch (err) {
            return Promise.reject(err);
        }
    }
}
