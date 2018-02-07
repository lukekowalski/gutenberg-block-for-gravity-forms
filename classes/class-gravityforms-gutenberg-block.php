<?php

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	die( 'Silence is golden.' );
}

if ( ! class_exists( 'GBGF_GravityForms_Gutenberg_Block' ) ) {

	class GBGF_GravityForms_Gutenberg_Block {

		private static $instance = null;
		private $authenticate    = null;
		private $version         = '1.0.0';

		public static function get_instance() {
			if ( is_null( self::$instance ) ) {
				self::$instance = new self();
			}
			return self::$instance;
		}

		private function __construct() {
			require_once dirname(__FILE__) . '/class-gravityforms-webapi-authentication.php';
			$this->authenticate = new GBGF_GravityForms_Webapi_Authentication();

			add_action( 'enqueue_block_editor_assets', [ $this, 'enqueue_backend_assets' ] );
			add_action( 'init', [ $this, 'register_gravityforms_block'] );
		}

		public function enqueue_backend_assets() {
			wp_enqueue_script(
				'gbgf-gravityforms-block',
				plugins_url( 'dist/assets/js/backend.blocks.js', __DIR__ ),
				['wp-i18n', 'wp-element', 'wp-blocks', 'wp-components', 'wp-api'],
				$this->get_plugin_version()
			);

			wp_localize_script( 'gbgf-gravityforms-block', 'gbgfGlobals', [
				// camelCase because will be used in JS
				'gravityformsWebapiResponse' => $this->authenticate->get_all_forms(),
			] );
		}

		public function register_gravityforms_block() {
			register_block_type(
				'wpjsio/gravity-forms', [
					'render_callback' => [ $this, 'render_gravityforms_block' ],
					'attributes'      => [
						'formID'          => ['type' => 'number'],
						'formTitle'       => ['type' => 'boolean'],
						'formDescription' => ['type' => 'boolean'],
						'useAjax'         => ['type' => 'boolean'],
						'formTabIndex'    => ['type' => 'number'],
						'fieldValues'     => ['type' => 'string'],
					],
				]
			);
		}
		
		/**
		 * Sever-side rendering for dynamic block
		 * Gets the values from $attributes and puts them into shortcode
		 */
		public function render_gravityforms_block( $attributes ) {

			$id = $attributes['formID'];

			if ( empty( $id ) || intval( $id ) === 0 ) {
				return '';
			}

			$title = $this->number_to_boolean( $attributes['formTitle'] );
			$description = $this->number_to_boolean( $attributes['formDescription'] );
			$ajax = $this->number_to_boolean( $attributes['useAjax'] );
			$tab_index = isset( $attributes['formTabIndex'] ) ? 'tabindex="' . intval( $attributes['formTabIndex'] ) . '"' : '';
			$field_values = isset( $attributes['fieldValues'] ) ?
				'field_values="' . sanitize_text_field($attributes['fieldValues']) . '"' : '';

			return '[gravityform 
						id='. intval($id) .' 
						title='. $title .'
						description='. $description .'
						ajax='. $ajax .' 
						'. $tab_index .' 
						'. $field_values .' ]';
		}
		
		/* '$attributes' returns '1' in case of true and nothing in case of false
		let's make it a 'truthy' value so we can easily utilize it in the shortcode */
		private function number_to_boolean( $value ) {
			return intval( $value ) === 1 ? "true" : "false";
		}

		private function get_plugin_version() {
			return $this->version;
		}
	}
}
