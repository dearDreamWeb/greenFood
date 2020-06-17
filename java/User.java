package domain;

import java.util.Date;

/**
 * 用户模块的实体类
 */
public class User {
	//用户id
	private String uid;
	//用户名
	private String username;
	//密码
	private String password;
	//用户的昵称
	private String nikeName;
	//邮箱
	private String email;
	//电话
	private String telephone;
	//生日
	private Date birthday;
	//性别
	private String sex;
	//状态,0:激活,1:未激活
	private Integer state;
	//注册时间
	private Date registtime;

	public String getUid() {
		return uid;
	}
	public void setUid(String uid) {
		this.uid = uid;
	}
	public String getUsername() {
		return username;
	}
	public void setUsername(String username) {
		this.username = username;
	}
	public String getPassword() {
		return password;
	}
	public void setPassword(String password) {
		this.password = password;
	}
	public String getNikeName() {
		return nikeName;
	}
	public void setNikeName(String nikeName) {
		this.nikeName = nikeName;
	}
	public String getEmail() {
		return email;
	}
	public void setEmail(String email) {
		this.email = email;
	}
	public String getTelephone() {
		return telephone;
	}
	public void setTelephone(String telephone) {
		this.telephone = telephone;
	}
	public Date getBirthday() {
		return birthday;
	}
	public void setBirthday(Date birthday) {
		this.birthday = birthday;
	}
	public String getSex() {
		return sex;
	}
	public void setSex(String sex) {
		this.sex = sex;
	}
	public Integer getState() {
		return state;
	}
	public void setState(Integer state) {
		this.state = state;
	}	
	public Date getRegisttime() {
		return registtime;
	}
	public void setRegisttime(Date registTime) {
		this.registtime = registTime;
	}
	@Override
	public String toString() {
		return "User [uid=" + uid + ", username=" + username + ", password=" + password + ", nikeName=" + nikeName
				+ ", email=" + email + ", telephone=" + telephone + ", birthday=" + birthday + ", sex=" + sex
				+ ", state=" + state + ", registtime=" + registtime + "]";
	}
	
	
}
