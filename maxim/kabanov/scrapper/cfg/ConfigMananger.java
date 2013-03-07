package maxim.kabanov.scrapper.cfg;
import java.io.*;
import java.util.Map;

import org.apache.log4j.Logger;
import org.codehaus.jackson.JsonParseException;
import org.codehaus.jackson.map.JsonMappingException;
import org.codehaus.jackson.map.ObjectMapper;
import org.codehaus.jackson.type.TypeReference;
public class ConfigMananger {
	public static final Logger log =Logger.getLogger(ConfigMananger.class);
	private Map<String, Object> userInMap;
public ConfigMananger(String path){
	ObjectMapper mapper = new ObjectMapper();
	try {
		userInMap = mapper.readValue(new File(path),new TypeReference<Map<String, Object>>() {});
		
	} catch (JsonParseException e) {
		// TODO Auto-generated catch block
		log.error(e.getMessage(),e);
		e.printStackTrace();
	} catch (JsonMappingException e) {
		// TODO Auto-generated catch block
		log.error(e.getMessage(),e);
		e.printStackTrace();
	} catch (IOException e) {
		// TODO Auto-generated catch block
		log.error(e.getMessage(),e);
		e.printStackTrace();
	}
}
public Object get(String node){
	return userInMap.get(node);
}
}
