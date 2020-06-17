package store.utils;

import java.util.ResourceBundle;
import redis.clients.jedis.Jedis;
import redis.clients.jedis.JedisPool;
import redis.clients.jedis.JedisPoolConfig;

/**
 * Jedis工具类
 */
public final class JedisUtil {
	private JedisUtil(){}
	private static JedisPool jedilPool;
	private static int maxtotal;
	private static int maxwaitmillis;
	private static String host;
	private static int port;;
	
	/**
	 * 读取jedis.properties配置文件
	 */
	static{
		ResourceBundle rb = ResourceBundle.getBundle("jedis");
		maxtotal = Integer.parseInt(rb.getString("maxtotal"));
		maxwaitmillis = Integer.parseInt(rb.getString("maxwaitmillis"));
		host = rb.getString("host");
		port = Integer.parseInt(rb.getString("port"));
	}
	/**
	 * 创建连接池
	 */
	static{
		JedisPoolConfig jedisPoolConfig = new JedisPoolConfig();
		jedisPoolConfig.setMaxTotal(maxtotal);
		jedisPoolConfig.setMaxWaitMillis(maxwaitmillis);
		jedilPool = new JedisPool(jedisPoolConfig,host,port);
	}
	/**
	 * 获取Jedis
	 */
	public static Jedis getJedis(){
		return jedilPool.getResource();
	}
	/**
	 * 关闭Jedis
	 */
	public static void close(Jedis jedis){
		if(jedis!=null){
			jedis.close();
		}
	}
}
