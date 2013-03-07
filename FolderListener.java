import java.nio.file.*;
import java.sql.SQLException;

import static java.nio.file.StandardWatchEventKinds.*;
import java.io.*;


import org.apache.log4j.Logger;
import org.htmlcleaner.XPatherException;

public class FolderListener {
	public static final Logger log =Logger.getLogger(FolderListener.class);
    private final WatchService watcher;
    @SuppressWarnings("unused")
	private final Path dir;

    /**
     * Creates a WatchService and registers the given directory
     */
    FolderListener(Path dir) throws IOException {
    	log.info("Watch for directory"+dir);
        this.watcher = FileSystems.getDefault().newWatchService();
        dir.register(watcher, ENTRY_CREATE,ENTRY_MODIFY);
        this.dir = dir;
    }

    /**
     * Process all events for the key queued to the watcher.
     * @throws XPatherException 
     * @throws SQLException 
     */
    
    @SuppressWarnings({ "rawtypes", "unchecked" })
	void processEvents() throws SQLException, XPatherException {
        for (;;) {
        	
            // wait for key to be signaled
            WatchKey key;
            try {
                key = watcher.take();
            } catch (InterruptedException e) {
            	log.error(e.getMessage(), e);
                return;
            }
            for (WatchEvent<?> event: key.pollEvents()) {
                WatchEvent.Kind kind = event.kind();

                if (kind == OVERFLOW) {
                    continue;
                }

                //The filename is the context of the event.
                WatchEvent<Path> ev = (WatchEvent<Path>)event;
                Path filename = ev.context();
               log.info("Start processing file"+filename);
                //Verify that the new file is a text file.
              ScrapperMain sk = new ScrapperMain("spoke\\"+filename);
              new Thread(sk).start();

            }

            boolean valid = key.reset();
            if (!valid) {
                    break;
            }
        }
    }

   

    public static void main(String[] args) throws IOException, SQLException, XPatherException {
    	System.out.println("start");
        Path dir = Paths.get("C:\\Users\\mkabanov\\workspace\\DBTool\\spoke");
        new FolderListener(dir).processEvents();
    }
}