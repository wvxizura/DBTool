-- CREATE EVENT IF NOT EXISTS scraper.CheckForScrap ON SCHEDULE EVERY 5 MINUTE  DO CALL scraper.checkScrapedInfoForUpdate();
-- DROP EVENT IF EXISTS scraper.CheckForScrap;