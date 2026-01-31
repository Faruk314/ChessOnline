-- migrate:up
DROP TABLE invites;

-- migrate:down
CREATE TABLE
    invites (
        `id` int NOT NULL AUTO_INCREMENT,
        `sender` int NOT NULL,
        `receiver` int NOT NULL,
        `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (`id`),
        KEY `fk_invites_sender` (`sender`),
        KEY `fk_invites_receiver` (`receiver`),
        CONSTRAINT `fk_invites_receiver` FOREIGN KEY (`receiver`) REFERENCES `users` (`userId`) ON DELETE CASCADE,
        CONSTRAINT `fk_invites_sender` FOREIGN KEY (`sender`) REFERENCES `users` (`userId`) ON DELETE CASCADE
    );