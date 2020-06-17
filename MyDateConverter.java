package store.utils;

import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;

import org.apache.commons.beanutils.Converter;

/**
 * 自定义 java.util.Date日期转换器
 * 
 */
public class MyDateConverter implements Converter {

	@Override
	// 将value 转换 c 对应类型
	// 存在Class参数目的编写通用转换器，如果转换目标类型是确定的，可以不使用c 参数
	public Object convert(Class c, Object value) {
		String strVal = (String) value;
		// 将String转换为Date --- 需要使用日期格式化
		DateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
		try {
			Date date = dateFormat.parse(strVal);
			return date;
		} catch (ParseException e) {
			e.printStackTrace();
		}
		return null;
	}
}
