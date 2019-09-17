import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { AuthService } from "../auth/_services/auth.service";
import { environment } from '../../environments/environment';

@Injectable()
export class FavService {
  apiRoot: string = environment.apiUrl;
  constructor(private _httpClient: HttpClient, private _authService: AuthService) {

  }

  public toggleFav(cid: string) {
    const api_query = this.apiRoot + 'favorites/' + cid + '/toggle';
    return this._httpClient.patch(api_query, {}, this._authService.jwtHttpClient());
  }

  public isFav(fid: string) {
    const api_query = this.apiRoot + 'favorites/is/' + fid;
    return this._httpClient.get(api_query, this._authService.jwtHttpClient());
  }

  public ToggleFavAndupdateInLocalStorage(cid: string): void {
    const currentUser = this._authService.getUser();
    const favIndex = currentUser.favorites.indexOf(cid);
    if ( favIndex != -1) {
      currentUser.favorites.splice(favIndex, 1);
    } else {
      currentUser.favorites.push(cid);
    }
    this._authService.updateCurrentUser(currentUser);
  }
}