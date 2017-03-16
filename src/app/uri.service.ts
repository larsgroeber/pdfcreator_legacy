import {Injectable} from "@angular/core";
@Injectable()
export class UriService {
    uri: string;

    getUri(): string {
        return this.uri;
    }
}