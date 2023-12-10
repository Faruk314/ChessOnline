-- migrate:up

CREATE TABLE
    users (
        `userId` int NOT NULL AUTO_INCREMENT,
        `userName` varchar(50) NOT NULL,
        `image` varchar(255) DEFAULT NULL,
        `password` varchar(255) NOT NULL,
        `email` varchar(100) NOT NULL,
        PRIMARY KEY (`userId`)
    );

CREATE TABLE
    friend_requests (
        `id` int NOT NULL AUTO_INCREMENT,
        `sender` int NOT NULL,
        `receiver` int NOT NULL,
        `status` enum('pending', 'accepted') NOT NULL,
        `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (`id`),
        KEY `fk_friend_request_sender` (`sender`),
        KEY `fk_friend_request_receiver` (`receiver`),
        CONSTRAINT `fk_friend_request_receiver` FOREIGN KEY (`receiver`) REFERENCES `users` (`userId`) ON DELETE CASCADE,
        CONSTRAINT `fk_friend_request_sender` FOREIGN KEY (`sender`) REFERENCES `users` (`userId`) ON DELETE CASCADE
    );

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

-- Add test users

INSERT INTO
    chess.users (
        userName,
        image,
        password,
        email
    )
VALUES (
        'guest',
        '/src/client/assets/images/goblin.png',
        '$2b$10$HwtbEmH35/UYhpPphqiD5unEtoPsB1yBesbRPXYVSKxHynhgrQKcm',
        'guest@gmail.com'
    );

INSERT INTO
    chess.users (
        userName,
        image,
        password,
        email
    )
VALUES (
        'test',
        '/src/client/assets/images/wizard.png',
        '$2b$10$Kf5fjyEs525RGUbmtGE/N.ljrZQyI9G52aylnH8KyDkRRGhWb8L5S',
        'test@gmail.com'
    );

-- migrate:down

DROP TABLE friend_requests;

DROP TABLE invites;

DROP TABLE users;