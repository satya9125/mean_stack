import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { GrowlService } from './growl.service';
import { catchError, map } from 'rxjs/operators';
import { tokenNotExpired } from 'angular2-jwt';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  authToken: any;
  user: any;
  public apiUrl = "http://localhost:3000/";
  public errorMasses = "Service unavailable. please try again later";
  constructor(
    private http: HttpClient,
    private GrowlService: GrowlService
  ) { }


  /**
   * Request for login 
   * 
   * @param user object
   */
  authenticate(user) {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8' });
    return this.http.post(this.apiUrl + 'users/authenticate', JSON.stringify(user), { headers: headers })
      .pipe(catchError((res: HttpErrorResponse) => {
        this.GrowlService.error(this.errorMasses);
        return res.error;
      }), map((response: Response) => response);
  }

  /**
   * Store user data
   * 
   * @param token any
   * @param user any
   */
  storeUserData(token, user) {
    localStorage.setItem('token_id', token);
    localStorage.setItem('user', JSON.stringify(user));
    this.authToken = token;
    this.user = user;
  }

  /**
   * check logging user
   */
  loggedIn() {
    return tokenNotExpired('token_id');
  }

  /**
   * Log out 
   */
  logOut() {
    this.authToken = null;
    this.user = null;
    localStorage.clear();
    this.GrowlService.success('Logout your session ...');
    this.GrowlService.Redirect('/login');
  }
}
