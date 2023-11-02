<?php

/*
Plugin Name: Pay attention
Description: Please pay attention to this plugin
Author: Hazem
Version: 1.0
Author URI: http://www.example.com
*/

if (!defined('ABSPATH')) {
    exit; // Exit if accessed directly.
}

class PayAttention
{
    function __construct()
    {
        add_action('init', array($this, 'adminAssets'));
    }


    function adminAssets()
    {
        // wp_register_style('quizeditcss', plugin_dir_url(__FILE__) . 'build/index.css');

        // wp_register_script('newBlockType', plugin_dir_url(__FILE__) . 'build/index.js', array('wp-blocks', 'wp-element', 'wp-editor'));


        // register_block_type('my-plugin/pay-attention', array(
        //     'editor_script' => 'newBlockType',
        //     'editor_style' => 'quizeditcss',
        //     'render_callback' => array($this, 'theHTML')
        // ));
        register_block_type(__DIR__, array(
            'render_callback' => array($this, 'theHTML')
        ));
    }


    function theHTML($attrs)
    {
        if (!is_admin()) {

            wp_enqueue_script('attentionFrontend', plugin_dir_url(__FILE__) . 'build/frontend.js', array('wp-element'), '1.0', true);
        }
        ob_start(); ?>


        <div class="paying-attention-update-me">
            <pre style="display:none">
             <?php echo wp_json_encode($attrs) ?> </div>


<?php return ob_get_clean();
    }
}

$payattention = new PayAttention();
