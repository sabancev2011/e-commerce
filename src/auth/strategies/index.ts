import { AccessTokenStrategy } from './access-token.strategy'
import { GoogleStrategy } from './google.stratagy'
import { RefreshTokenStrategy } from './refresh-token.strategy'

export const STRATEGES = [AccessTokenStrategy, RefreshTokenStrategy, GoogleStrategy]