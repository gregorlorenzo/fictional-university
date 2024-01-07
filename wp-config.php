<?php

/**
 * The base configuration for WordPress
 *
 * The wp-config.php creation script uses this file during the installation.
 * You don't have to use the web site, you can copy this file to "wp-config.php"
 * and fill in the values.
 *
 * This file contains the following configurations:
 *
 * * Database settings
 * * Secret keys
 * * Database table prefix
 * * ABSPATH
 *
 * @link https://wordpress.org/documentation/article/editing-wp-config-php/
 *
 * @package WordPress
 */

if (file_exists(__DIR__ . '/vendor/autoload.php')) {
	require_once __DIR__ . '/vendor/autoload.php';
	$dotenv = Dotenv\Dotenv::createImmutable(__DIR__);
	$dotenv->load();
}

// ** Database settings - You can get this info from your web host ** //
/** The name of the database for WordPress */
define('DB_NAME', $_ENV["DB_NAME"]);

/** Database username */
define('DB_USER', $_ENV["DB_USER"]);

/** Database password */
define('DB_PASSWORD', $_ENV["DB_PASSWORD"]);

/** Database hostname */
define('DB_HOST', $_ENV["DB_HOST"]);

/** Database charset to use in creating database tables. */
define('DB_CHARSET', 'utf8mb4');

/** The database collate type. Don't change this if in doubt. */
define('DB_COLLATE', '');

/**#@+
 * Authentication unique keys and salts.
 *
 * Change these to different unique phrases! You can generate these using
 * the {@link https://api.wordpress.org/secret-key/1.1/salt/ WordPress.org secret-key service}.
 *
 * You can change these at any point in time to invalidate all existing cookies.
 * This will force all users to have to log in again.
 *
 * @since 2.6.0
 */
define('AUTH_KEY',         '5A]htO7PSwN*0Yh/j*]BigA4w0Pzil:%tHVeKm(9{_7Nb0^X3S@JWhqr#_gc{.ll');
define('SECURE_AUTH_KEY',  'w>}M9+orGCL;d^1FB]F>U_KpQwULcd)?qbE!=4b^3VNAmo0_sRJ|GE!h0m)^pyMe');
define('LOGGED_IN_KEY',    '^==%|_;4z^ru TQHzwNLTtTK=|z0pBs{X~3YxE:F/Xt]qquqmhQoGOsrZts|=G:x');
define('NONCE_KEY',        'Rj=r:9Qfp1bT5*2(.FFB 9]?SSoa,D5 YZ |3Qh.475uD V,-SEh#B1eU}e}L+i*');
define('AUTH_SALT',        'n4|QvZJxqNYHM2BN~s8Za31u5*,{!D[UohME-D4Rjk9.!|ExOi#wW$$g/9RWT(Y#');
define('SECURE_AUTH_SALT', 'skI%pLqv@oEn3ikrrA{S!g)&wFv9$}FtLsLQ&tZ6zdT!Df-Bg&@:tq{g!-NHKHSe');
define('LOGGED_IN_SALT',   'r-g7=$})alA /@p|D-%m^?4uDF<,Bz6w}e/3zL|,w%G3&t;~z2j4thy4`jd~@vS}');
define('NONCE_SALT',       ' w%@sGSj&m!UILX9oGCl;jX=j<k)Y@@7:[TppW^s.V>Qgw8*EheAdAX*C~lng^JB');

/**#@-*/

/**
 * WordPress database table prefix.
 *
 * You can have multiple installations in one database if you give each
 * a unique prefix. Only numbers, letters, and underscores please!
 */
$table_prefix = 'wp_';

/**
 * For developers: WordPress debugging mode.
 *
 * Change this to true to enable the display of notices during development.
 * It is strongly recommended that plugin and theme developers use WP_DEBUG
 * in their development environments.
 *
 * For information on other constants that can be used for debugging,
 * visit the documentation.
 *
 * @link https://wordpress.org/documentation/article/debugging-in-wordpress/
 */
define('WP_DEBUG', false);

/* Add any custom values between this line and the "stop editing" line. */



/* That's all, stop editing! Happy publishing. */

/** Absolute path to the WordPress directory. */
if (!defined('ABSPATH')) {
	define('ABSPATH', __DIR__ . '/');
}

/** Sets up WordPress vars and included files. */
require_once ABSPATH . 'wp-settings.php';
