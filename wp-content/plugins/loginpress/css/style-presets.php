<?php
/**
 * Get the Template and implement it's design.
 * @since  1.0.9
 * @version 3.0.3
 */
$loginpress_default_theme = $this->loginpress_preset === true && ( empty( $this->loginpress_key ) && empty( $this->loginpress_setting ) ) ? 'minimalist' : 'default1';

$selected_preset = get_option( 'customize_presets_settings', $loginpress_default_theme );

if ( $selected_preset == 'default1' ) {
	include_once LOGINPRESS_ROOT_PATH . 'css/themes/default-1.php';
	echo first_presets();
} elseif ( $selected_preset == 'minimalist' ) {
	include_once LOGINPRESS_ROOT_PATH . 'css/themes/free-minimalist.php';
	echo free_minimalist_presets();
} else {
	do_action( 'loginpress_add_pro_theme', $selected_preset );
}
?>
