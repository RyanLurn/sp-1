CREATE TABLE `chat_messages` (
	`id` text PRIMARY KEY,
	`role` text NOT NULL,
	`parts` text NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
