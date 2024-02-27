import { AuthDto } from "../dtos/auth.dto";
import { AuthorizationDto } from "../dtos/authorization.dto";
import { ResetDto } from "../dtos/reset.dto";

export abstract class AuthRepository {
    abstract authenticate(signIn: AuthDto): Promise<AuthorizationDto>;
    abstract forgot(reset: ResetDto): Promise<AuthorizationDto>;
    abstract reset(reset: ResetDto, token: string): Promise<string>;
}