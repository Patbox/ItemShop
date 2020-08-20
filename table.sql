CREATE TABLE IF NOT EXISTS `itemshop_purchases` (
	`buyer` VARCHAR(16) NOT NULL,
	`service` VARCHAR(16) NOT NULL,
	`details` VARCHAR(128),
	`profit` VARCHAR(16) NOT NULL,
	`date` VARCHAR(32) NOT NULL
)