<?php

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	die( 'Silence is golden.' );
}

if ( ! class_exists( 'GFGB_GravityForms_Webapi_Authentication' ) ) {

	class GFGB_GravityForms_Webapi_Authentication {

		public function get_all_forms() {
			return $this->authenticate_gravityforms_webapi();
		}

		/**
		 * Since the Gravity Forms REST API ( Web API v2 ) is still in beta we shouldn't really use it on production.
		 * Let's stick to v1 then, which requires us to authenticate on the server-side.
		 * @return [object] returns available forms
		 */
		private function authenticate_gravityforms_webapi() {
			$gravityforms_webapi = get_option( 'gravityformsaddon_gravityformswebapi_settings' );

			if ( ! intval($gravityforms_webapi['enabled']) === 1 ) {
				return [
					'error'   => true,
					'details' => __( 'Gravity Forms Web API is not enabled.', 'gravityforms-gutenberg' ),
				];
			}

			// vars
			$api_key     = $gravityforms_webapi['public_key'];
			$private_key = $gravityforms_webapi['private_key'];
			$route       = 'forms';

			// request URL
			$expires        = strtotime( '+60 mins' );
			$string_to_sign = sprintf( '%s:%s:%s:%s', $api_key, 'GET', $route, $expires );
			$sig            = $this->calculate_signature( $string_to_sign, $private_key );
			$url            = get_home_url() . '/gravityformsapi/' . $route . '?api_key=' . $api_key . '&signature=' . $sig . '&expires=' . $expires;

			//retrieve data
			$response = wp_remote_request( $url, ['method' => 'GET'] );
			if ( wp_remote_retrieve_response_code( $response ) != 200 || ( empty( wp_remote_retrieve_body( $response ) ) ) ) {
				//http request failed
				return [
					'error'   => true,
					'details' => __( 'There was an error attempting to access the API. Please check your settings or refresh the page.', 'gravityforms-gutenberg' ),
				];
			}

			//result is in the response "body" and is json encoded.
			$body = json_decode( wp_remote_retrieve_body( $response ), true );

			if ( $body['status'] > 202 ) {
				return [
					'status'  => 'error',
					'details' => __( 'Could not retrieve forms. Please check your settings or refresh the page.', 'gravityforms-gutenberg' ),
				];
			}

			//forms retrieved successfully
			$forms = $body['response'];
			return $forms;
		}

		private function calculate_signature( $string, $private_key ) {
			$hash = hash_hmac( 'sha1', $string, $private_key, true );
			$sig  = rawurlencode( base64_encode( $hash ) );
			return $sig;
		}
	}
}
