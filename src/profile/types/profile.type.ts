import { UserType } from "src/user/types/user.type"

export type Profile = UserType & { following: boolean }