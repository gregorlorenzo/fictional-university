<?php

/*
    Plugin Name: Custom Blocks
    Description: Give your readers a multiple choice question.
    Version: 1.0
    Author: Lorenzo
    Author URI: https://facebook.com/goryeongie
*/

if( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly

class CustomBlocks {
  function __construct() {
    add_action('init', array($this, 'adminAssets'));
  }

function adminAssets() {
  // wp_register_style('customblockcss', plugin_dir_url(__FILE__) . 'build/index.css');
  // wp_register_script('ournewblocktype', plugin_dir_url(__FILE__) . 'build/index.js', array('wp-blocks', 'wp-element', 'wp-editor'));
  register_block_type(__DIR__, array(
      // 'editor_script' => 'ournewblocktype',
      // 'editor_style' => 'customblockcss',
      'render_callback' => array($this, 'theHTML')
  ));
}

  function theHTML($attributes) {
    // if(!is_admin()) {
    //   wp_enqueue_script('attentionFrontend', plugin_dir_url(__FILE__) . 'build/frontend.js', array('wp-element'), '1.0', true);
    //   wp_enqueue_style('attentionFrontendStyles', plugin_dir_url(__FILE__) . 'build/frontend.css');
    // }
    ob_start(); ?>
      <div class="custom-blocks-update-me"><pre style="display: none;"><?php echo wp_json_encode($attributes)?></pre></div>
    <?php return ob_get_clean();
  }
}

$customBlocks = new CustomBlocks();