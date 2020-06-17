package store.utils;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JavaType;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.io.IOException;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

public class JacksonUtils {
    private static ObjectMapper mapper = new ObjectMapper();

    private JacksonUtils() {    }

    /**
     * 对象转换为json字符串
     * @param obj 被转换的对象
     * @return 转换后的json字符串
     */
    public static String getJson(Object obj)  {
        String s = null;
        try {
            s =  mapper.writeValueAsString(obj);
        } catch (JsonProcessingException e) {
            e.printStackTrace();
        }
        return s;
    }

    /**
     * 把json字符串转换为JavaBean对象
     * @param json 待转json字符串
     * @param c JavaBean的字节码文件
     * @return  返回JavaBean对象
     */
    public static <T> T jsonToBean(String json,Class<T> c){
        T t = null;
        try {
            t = mapper.readValue(json, c);
        } catch (IOException e) {
            e.printStackTrace();
        }
        return t;
    }

    /**
     * 把json字符串转换为List集合
     * @param json 待转json字符串
     * @return  返回List<String>集合
     */
    public static List<String> jsonToList(String json){
        ArrayList<String> arrayList = null;
        try {
            arrayList = mapper.readValue(json, ArrayList.class);
        } catch (IOException e) {
            e.printStackTrace();
        }
        return arrayList;
    }

    /**
     * 把json字符串转换为List集合
     * @param json 待转json字符串
     * @param c 集合中存储的JavaBean类型
     * @return  返回List集合,集合的泛型是传递的JavaBean类型
     */
    public static <T> List<T> jsonToList(String json,Class<T> c){
        JavaType jt = mapper.getTypeFactory().constructParametricType(ArrayList.class, c);
        List<T> list = null;
        try {
            list =  mapper.readValue(json, jt);
        } catch (IOException e) {
            e.printStackTrace();
        }
        return list;
    }

    /**
     * 把json字符串转换为Map<String,String>集合
     * @param json 待转json字符串
     * @return  返回Map<String,String>集合
     */
    public static Map<String,String> jsonToMap(String json){
        LinkedHashMap<String,String> map=null;
        try {
            map = mapper.readValue(json, LinkedHashMap.class);
        } catch (IOException e) {
            e.printStackTrace();
        }
        return map;
    }

    /**
     * 把json字符串转换为Map集合
     * @param json 待转json字符串
     * @param c Map集合的值的类型的字节码文件(键固定为String)
     * @return  返回Map集合
     */
    public static <V> Map<String,V> jsonToMap(String json,Class<V> c){
        JavaType jvt = mapper.getTypeFactory().constructParametricType(LinkedHashMap.class,String.class,c);
        Map<String,V> map = null;
        try {
            map = mapper.readValue(json, jvt);
        } catch (IOException e) {
            e.printStackTrace();
        }
        return map;
    }
}
