package web.servlet;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import dao.UserDao;
import domain.User;
import service.UserService;


public class LoginServlet extends HttpServlet {

	protected void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		//接受参数（username，password）
		String username = request.getParameter("username");
		String password = request.getParameter("password");
		
		//访问数据库，查询
		UserService userService = new UserService();
		User login_user = userService.login(username, password);
		//当查询到了用户，并且用户的状态为激活状态
		if (login_user != null && login_user.getState() == 0) {
			//登录成功
			request.getSession().setAttribute("login_user", login_user);
			request.getSession().setAttribute("login_info", "");
			response.sendRedirect("/store_v1.0/index.jsp");
		}else{
			//如果查询到了用户，但用户的状态为未激活
			if(login_user != null && login_user.getState() != 0){
				request.getSession().setAttribute("login_info", "用户未激活，请去激活！");
			}else{
				//登录失败
				request.getSession().setAttribute("login_info", "用户名或密码错误！");
			}
			response.sendRedirect("/store_v1.0/login.jsp");
		}
		
	}

	protected void doPost(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		doGet(request, response);
	}

}
