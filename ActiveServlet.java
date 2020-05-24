package web.servlet;

import java.io.IOException;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import service.UserService;

public class ActiveServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
   
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// 激活用户(就是把用户的start改为0)
		// 获取被激活用户uid
		String uid = request.getParameter("uid");
		// 激活用户
		UserService userService = new UserService();
		userService.activUser(uid);
		//
		response.sendRedirect("/store_v1.0/active_ok.jsp");
	}

	
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		doGet(request, response);
	}

}
