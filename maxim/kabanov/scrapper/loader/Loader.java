package maxim.kabanov.scrapper.loader;

import java.io.*;

import org.apache.log4j.Logger;

public class Loader {
	public static final Logger log =Logger.getLogger(Loader.class);
	private BufferedReader br;
	private DataInputStream in;
	private FileInputStream fstream;
	public Loader(String file_path) {
		try {

			fstream = new FileInputStream(file_path);
			// Get the object of DataInputStream
			in = new DataInputStream(fstream);
			br = new BufferedReader(new InputStreamReader(in));
			
		} catch (Exception e) {// Catch exception if any
			log.error(e.getMessage(),e);
			System.err.println("Error: " + e.getMessage());
		}
	}
	public String getNextRow(){
		try {
			return br.readLine();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			log.error(e.getMessage(),e);
			e.printStackTrace();
		}
		return null;
	}

}
