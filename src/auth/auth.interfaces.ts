import { roleEnum } from "src/common/enum"

export interface AccessTokenPayload {
  id: string
  email: string
  roles: roleEnum[]
}

export interface RefreshTokenPayload {
  email: string 
  roles: roleEnum[]
}
