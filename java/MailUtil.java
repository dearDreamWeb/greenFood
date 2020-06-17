package store.utils;

import java.util.Properties;
import javax.mail.Authenticator;
import javax.mail.Message;
import javax.mail.PasswordAuthentication;
import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;
import javax.mail.internet.MimeMessage.RecipientType;

/**
 * 发送邮件工具类
 */
public final class MailUtil {
	private MailUtil(){}
	
	//发件人邮箱地址
	private static String username = "2104785190@qq.com";
	//发件人客户端授权码
	private static String password = "oqbkbugqetwcghfa";
	
	/**
	 * 发送邮件
	 * 参数一:发送邮件给谁
	 * 参数二:发送邮件的内容
	 */
	private static void sendMail(String toEmail, String emailMsg) throws Exception {
		//1:创建Java程序与邮箱服务器的连接对象
		Properties props = new Properties();
		//1.1:设置邮箱服务器的地址
		props.put("mail.smtp.host", "smtp.qq.com");
		//1.2:设置是否验证用户名和密码,默认false
		props.put("mail.smtp.auth", "true");
		//1.3:设置登录邮箱服务器的用户名和密码
		Authenticator auth = new Authenticator() {
			public PasswordAuthentication getPasswordAuthentication() {
				return new PasswordAuthentication(username, password);
			}
		};
		Session session = Session.getInstance(props, auth);
		//2:创建一封邮件
		Message message = new MimeMessage(session);
		//2.1:设置发件人(和登录邮箱服务期的用户必须为同一个用户)
		message.setFrom(new InternetAddress(username));
		//2.2:设置收件人
		message.setRecipient(RecipientType.TO, new InternetAddress(toEmail));
		//2.3:设置邮件主题
		message.setSubject("来自本亲网的激活邮件!");
		//2.3:设置正文
		message.setContent(emailMsg, "text/html;charset=UTF-8");
		//3:发送邮件
		Transport.send(message);
	}
	/**
	 * 发送激活邮件
	 * 参数一:发送邮件给谁
	 * 参数二:激活码
	 */
	public static void sendCodeMail(String toEmail, String code) throws Exception {
		String url = "http://localhost:8080/store_V1.0/login.jsp";
		String emailMsg = "<h2>来自绿色食品销售网站——本亲网的激活邮件</h2><h3>请点击<a href="+url+">激活!</a></h3>";
		sendMail(toEmail,emailMsg);
	}
	
	/*
	UserServlet?method=active&code="+code
	 * 
	 */
	 
	/**
	 * 测试类
	 */
	public static void main(String[] args) throws Exception{
		String toEmail = "2104785190@qq.com";
		String code = "1235613213515132";
		sendCodeMail(toEmail,code);
		System.out.println("激活邮件已发送成功。。。");
	}
}








