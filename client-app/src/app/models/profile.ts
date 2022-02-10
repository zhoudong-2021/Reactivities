import { User } from "./user";

export interface Profile {
    username: string;
    displayName: string;
    bio?: string;
    image?: string;
}

export class UserProfile implements Profile {
    constructor(user: User) {
        this.username = user.username;
        this.displayName = user.displayName;
        this.image = user.image;
    }
    username: string;
    displayName: string;
    bio?: string | undefined;
    image?: string | undefined;
}