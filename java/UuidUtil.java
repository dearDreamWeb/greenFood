package store.utils;

import java.util.UUID;

/**
 * 产生UUID随机字符串工具类
 */
public final class UuidUtil {
	private UuidUtil(){}
	
	public static String getUuid(){
		return UUID.randomUUID().toString().replace("-","");
	}
}
