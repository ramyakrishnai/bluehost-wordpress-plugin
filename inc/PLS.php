<?php 
/**
 * Demo code for PLS integration
 * 
 * Hit a proxy wp-api endpoint such as the following:
 * /wp-json/newfold-pls/v1/pls
 * 
 * This proxy hits the hiive endpoint route at /sites/v1/pls using the established 
 * connection token as authetication and will request a license for this site.
 * 
 * Here the payload is hard coded in the rest route. 
 * It can be updated to pass these as parameters.
 * 
 * Example response:
 * {
 *		"license_id": "ac4bf8cb-20ec-11ee-8ecb-69f0e5d5fxxx",
 *		"download_url": "https://.../download/auth?licence_key=ac4bf8cb-20ec-11ee-8ecb-69f0e5d5fxxx"
 * }
 *
 * With response:
 * - Save license_id to wp options as yith_pls_license_key_[product_id]. product_id = wondercart. 
 * Note: not sure wonder-cart or wonder_cart, but it should match the plugin slug
 * - Pass the download_url to the installer to install and activate the plugin
 * 
 */ 

use NewfoldLabs\WP\Module\Data\HiiveConnection;

add_action( 'rest_api_init', function() {

		// Add route for getting a plugin license for wonder-cart
		register_rest_route(
			'newfold-pls/v1',
			'/pls',
			array(
				'methods'             => WP_REST_Server::READABLE,
				'permission_callback' => function () {
					return current_user_can( 'manage_options' );
				},
				'callback'            => function ( WP_REST_Request $request ) {

					$payload = array(
						'pluginSlug'   => 'wonder-cart',
						'providerName' => 'YITH',
					);

					$response = wp_remote_post(
						NFD_HIIVE_URL . '/sites/v1/pls',
						array(
							'headers' => array(
								'Content-Type'  => 'application/json',
								'Accept'        => 'application/json',
								'Authorization' => 'Bearer ' . HiiveConnection::get_auth_token(),
							),
							'body'    => wp_json_encode( $payload ),
							'timeout' => 20,
						)
					);

					if ( $response instanceof WP_Error ) {
						return $response;
					}

					return new WP_REST_Response( json_decode( wp_remote_retrieve_body( $response ) ), wp_remote_retrieve_response_code( $response ) );
				},
			)
		);

	}
);
