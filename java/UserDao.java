package dao;

import java.util.Date;

import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;

import domain.User;
import store.utils.JdbcUtils;

public class UserDao {
	
	private JdbcTemplate template = new JdbcTemplate(JdbcUtils.getDataSource());

	//检验用户是否登录（JDBC）
	public User login(String username,String password){
		String sql = "select * from user where username=? and password=?";
		User user = null;
		try {
			//执行sql语句，并且把username和password当作参数，传递给sql语句
			user = template.queryForObject(sql,new BeanPropertyRowMapper<>(User.class),username,password);
		} catch (Exception e) {
		}
		
		return user;
	}
	
	//注册用户
	public void registUser(User user){
		String sql = "insert into user values(?,?,?,?,?,?,?,?,?,?)";
		template.update(sql,user.getUid(),
				user.getUsername(),
				user.getPassword(),
				user.getNikeName(),
				user.getEmail(),
				user.getTelephone(),
				user.getBirthday(),
				user.getSex(),
				user.getState(),
				new Date());
	}

	//激活用户(修改它的state为0)
	public void activUser(String uid) {
		String sql = "update user set state=0 where uid=?";
		template.update(sql,uid);
	}
}
