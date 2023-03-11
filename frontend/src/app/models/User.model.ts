export class User {
    constructor(
        private _username: string,
        private _auth: string,
    ) {  }

    get username(): string {
        return this._username;
    }
    get auth(): string {
        return this._auth;
    }
}