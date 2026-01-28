CREATE TABLE `users` (
  `userId` int NOT NULL AUTO_INCREMENT,
  `userName` varchar(50) NOT NULL,
  `image` varchar(255) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `email` varchar(100) NOT NULL,
  PRIMARY KEY (`userId`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `friend_requests` (
  `id` int NOT NULL AUTO_INCREMENT,
  `sender` int NOT NULL,
  `receiver` int NOT NULL,
  `status` enum('pending','accepted') NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_friend_request_sender` (`sender`),
  KEY `fk_friend_request_receiver` (`receiver`),
  CONSTRAINT `fk_friend_request_receiver` FOREIGN KEY (`receiver`) REFERENCES `users` (`userId`) ON DELETE CASCADE,
  CONSTRAINT `fk_friend_request_sender` FOREIGN KEY (`sender`) REFERENCES `users` (`userId`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `invites` (
  `id` int NOT NULL AUTO_INCREMENT,
  `sender` int NOT NULL,
  `receiver` int NOT NULL,
  `gameMode` enum('bullet', 'blitz', 'rapid', 'long') NOT NULL DEFAULT 'rapid',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  /* This is the magic line that prevents duplicate invites */
  UNIQUE KEY `unique_invite_pair` (`sender`, `receiver`), 
  CONSTRAINT `fk_invites_receiver` FOREIGN KEY (`receiver`) REFERENCES `users` (`userId`) ON DELETE CASCADE,
  CONSTRAINT `fk_invites_sender` FOREIGN KEY (`sender`) REFERENCES `users` (`userId`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;