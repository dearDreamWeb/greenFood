package store.utils;

import javax.servlet.http.Cookie;

/**
 * Cookie的工具类
 * @author admin
 *
 */
public class CookieUtils {

	public static Cookie findCookie(Cookie[] cookies,String name){
		if(cookies == null){
			return null;
		}else{
			for(Cookie cookie:cookies){
				if(name.equals(cookie.getName())){
					return cookie;
				}
			}
			
			return null;
		}
	}
}
