import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../auth/_services/auth.service';
import { environment } from '../../environments/environment';

@Injectable()
export class FavService {
  apiRoot: string = environment.apiUrl;
  constructor(private httpClient: HttpClient, private authService: AuthService) {

  }

  public toggleFav(cid: string) {
    const apiQuery = this.apiRoot + 'favorites/' + cid + '/toggle';
    return this.httpClient.patch(apiQuery, {}, this.authService.jwtHttpClient());
  }

  public isFav(fid: string) {
    const apiQuery = this.apiRoot + 'favorites/is/' + fid;
    return this.httpClient.get(apiQuery, this.authService.jwtHttpClient());
  }

  public ToggleFavAndupdateInLocalStorage(cid: string): void {
    const currentUser = this.authService.getUser();
    const favIndex = currentUser.favorites.indexOf(cid);
    if ( favIndex !== -1) {
      currentUser.favorites.splice(favIndex, 1);
    } else {
      currentUser.favorites.push(cid);
    }
    this.authService.updateCurrentUser(currentUser);
  }
}
