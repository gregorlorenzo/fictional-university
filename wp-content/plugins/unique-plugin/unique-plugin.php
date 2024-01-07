<?php

/*
    Plugin Name: Test Plugin
    Description: A truly amazing plugin.
    Version: 1.0
    Author: Lorenzo
    Author URI: https://facebook.com/goryeongie
    Text Domain: wcpdomain
    Domain Path: /languages
*/

class WordCountAndTimePlugin {
    function __construct() {
        add_action('admin_menu', array($this, 'adminPage'));
        add_action('admin_init', array($this, 'settings'));
        add_filter('the_content', array($this, 'ifWrap'));
        add_action('init', array($this, 'languages'));
    }

    function languages() {
        load_plugin_textdomain('wcpdomain', false, dirname(plugin_basename(__FILE__)) . '/languages');
    }

    function ifWrap($content) {
        if(is_main_query() AND is_single() AND (get_option('wcp_wordcount', '1') OR get_option('wcp_charcount', '1') OR get_option('wcp_readtime', '1')))
            return $this->createHTML($content);
    
        return $content;
    }

    function createHTML($content) {
        $html = '<h3>' . esc_html(get_option('wcp_headline', 'Post Statistics')) . '</h3><p>';

        // Get word count
        if(get_option('wcp_wordcount', '1') OR get_option('wcp_readtime', '1'))
            $wordCount = str_word_count(strip_tags($content));

        if(get_option('wcp_wordcount', '1'))
            $html .= esc_html__('This post has', 'wcpdomain') . ' '. $wordCount . ' ' . esc_html__('words', 'wcpdomain') . ' ' . '<br>';

        if(get_option('wcp_charcount', '1'))
            $html .= 'This post has ' . strlen(strip_tags($content)) . ' characters.<br>';

        if(get_option('wcp_readtime', '1')) {
            $readTime =  (round($wordCount/225) > 1) ? "minute" : "minutes";
            $html .= 'This post will take about ' . $wordCount . ' ' . $readTime .' to read.<br>';
        }

        $html .= '</p>';

        if(get_option('wcp_location', '0') === '0')
            return $html . $content;
        
        return $content . $html;
    }


    function settings() {
        add_settings_section('wcp_first_section', null, null, 'word-count-settings-page');

        add_settings_field('wcp_location', 'Display Location', array($this, 'locationHTML'), 'word-count-settings-page', 'wcp_first_section');
        register_setting('wordcountplugin', 'wcp_location', array(
            'sanitize_callback' => array($this, 'sanitizeLocation'),
            'default' => '0'
        ));

        add_settings_field('wcp_headline', 'Headline Text', array($this, 'headlineHTML'), 'word-count-settings-page', 'wcp_first_section');
        register_setting('wordcountplugin', 'wcp_headline', array(
            'sanitize_callback' => 'sanitize_text_field',
            'default' => 'Post Statistics'
        ));

        add_settings_field('wcp_wordcount', 'Word Count', array($this, 'checkboxHTML'), 'word-count-settings-page', 'wcp_first_section', array('theName' => 'wcp_wordcount'));
        register_setting('wordcountplugin', 'wcp_wordcount', array(
            'sanitize_callback' => 'sanitize_text_field',
            'default' => '1'
        ));

        add_settings_field('wcp_charcount', 'Character Count', array($this, 'checkboxHTML'), 'word-count-settings-page', 'wcp_first_section', array('theName' => 'wcp_charcount'));
        register_setting('wordcountplugin', 'wcp_charcount', array(
            'sanitize_callback' => 'sanitize_text_field',
            'default' => '1'
        ));

        add_settings_field('wcp_readtime', 'Read Time', array($this, 'checkboxHTML'), 'word-count-settings-page', 'wcp_first_section', array('theName' => 'wcp_readtime'));
        register_setting('wordcountplugin', 'wcp_readtime', array(
            'sanitize_callback' => 'sanitize_text_field',
            'default' => '1'
        ));
    }

    function sanitizeLocation($input) {
        if($input !== '0' AND $input !== '1') {
            add_settings_error('wcp_location', 'wcp_location_error', 'Display location must be either beginning or end.');
            return get_option('wcp_location');
        }

        return $input;
    }

    function checkboxHTML($args) { ?>
        <input type="checkbox" name="<?php echo $args['theName']; ?>" value="1" <?php checked(get_option($args['theName']), '1') ?>>
    <?php }

    function headlineHTML() { ?>
        <input type="text" name="wcp_headline" value="<?php echo esc_attr(get_option('wcp_headline')); ?>">
    <?php }

    function locationHTML() { ?>
        <select name="wcp_location">
            <option value="0" <?php selected(get_option('wcp_location'), '0') ?>>Beginning of Post</option>
            <option value="1" <?php selected(get_option('wcp_location'), '1')?>>End of Post</option>
        </select>
    <?php }

    function adminPage() {
        $page_title = 'Word Count Settings';
        $menu_title = __('Word Count', 'wcpdomain'); 
        $capability = 'manage_options';
        $menu_slug = 'word-count-settings-page';
    
        add_options_page($page_title, $menu_title, $capability, $menu_slug, array($this, 'ourHTML'));
    }
    
    function ourHTML() { ?>
        <div class="wrap">
            <h1>Word Count Settings</h1>
            <form action="options.php" method="POST">
                <?php
                    settings_fields('wordcountplugin');
                    do_settings_sections('word-count-settings-page');
                    submit_button();
                ?>
            </form>
        </div>
    <?php }
}

$wordCountAndTimePlugin = new WordCountAndTimePlugin();





