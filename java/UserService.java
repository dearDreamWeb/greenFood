package service;

import dao.UserDao;
import domain.User;
import store.utils.MailUtil;
import store.utils.UuidUtil;

public class UserService {

	private UserDao userDao = new UserDao();

	//检验用户是否登录（JDBC）
	public User login(String username,String password){
		User user = userDao.login(username, password);
		return user;
	}
	
	//注册用户
	public void registUser(User user){
		//给user的uid赋值
		user.setUid(UuidUtil.getUuid());
		//给user设置状态
		user.setState(0);		
		
		//保存用户
		userDao.registUser(user);
		
		//给用户发送激活邮件		
		/*try {
			MailUtil.sendCodeMail(user.getEmail(), user.getUid());
		} catch (Exception e) {
			e.printStackTrace();
		}
		**/
	}
	//根据用户的Uid激活用户
	public void activUser(String uid) {
		userDao.activUser(uid);
	}
}
