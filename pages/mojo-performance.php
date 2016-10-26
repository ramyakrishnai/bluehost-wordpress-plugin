<?php
if ( ! defined( 'WPINC' ) ) { die; }
?>
<div id="mojo-wrapper" class="<?php echo mm_brand( 'mojo-%s-branding' );?>">
<?php
require_once( MM_BASE_DIR . 'pages/header-small.php' );
$defaults = array(
	'page'    => 'disabled',
	'browser' => 'disabled',
	'object'  => 'disabled',
);
$cache_settings = get_option( 'mm_cache_settings' );
$cache_settings = wp_parse_args( $cache_settings, $defaults );
?>
	<main id="main">
		<div class="container">
			<div class="panel panel-default">
				<div class="panel-heading">
					<div class="row">
						<div class="col-xs-12 col-sm-12">
							<ol class="breadcrumb">
								<li>Cache Settings</li>
							</ol>
						</div>
					</div>
				</div>
				<div class="panel-body">
					<div class="row">
						<div class="col-xs-12 col-sm-12">
							<p>Caching is storing data where it is easy/quick to retrieve, making your site faster.</p>
						</div>
					</div>
					<div class="row">
						<div class="col-xs-12 col-sm-4">
							Page Cache
							<p>
								<img style="margin: 5px;" class="pull-left" src="<?php echo MM_BASE_URL; ?>tmp/pagecache.svg" />
								When pages are eligable for a full page cache, a copy of the page is created and stored for easy retrieval. This means it skips most of the stuff that makes a page slow.
							</p>
							<br/>
							<?php
							if ( 'enabled' == $cache_settings['page'] ) {
								?>
								<button data-type="page" data-status="enabled" class="mojo-cache-toggle btn btn-primary btn-md">Disable</button>
								<?php
							} else {
								?>
								<button data-type="page" data-status="disabled" class="mojo-cache-toggle btn btn-success btn-md">Enable</button>
								<?php
							}
							?>
						</div>
						<div class="col-xs-12 col-sm-4">
							Browser Cache
							<p>
								<img style="margin: 5px;" class="pull-left" src="<?php echo MM_BASE_URL; ?>tmp/browsercache.svg" />
								Browser cache tells a visitors computer to keep a copy of your page assets on their computer, so it does not have to reach back out to the server for the asset.</p>
							<br/>
							<?php
							if ( 'enabled' == $cache_settings['browser'] ) {
								?>
								<button data-type="browser" data-status="enabled" class="mojo-cache-toggle btn btn-primary btn-md">Disable</button>
								<?php
							} else {
								?>
								<button data-type="browser" data-status="disabled" class="mojo-cache-toggle btn btn-success btn-md">Enable</button>
								<?php
							}
							?>
						</div>
						<div class="col-xs-12 col-sm-4">
							Object Cache
							<p>
								<img style="margin: 5px;" class="pull-left" src="<?php echo MM_BASE_URL; ?>tmp/objectcache.svg" />
								Object cache is the most effective cache for sites that are highly dynamic. Storing small peices of data in memory. These pieces that live in memory are persistent across multiple pageviews.</p>
							<br/>
							<?php
							if ( 'enabled' == $cache_settings['object'] ) {
								?>
								<button data-type="object" data-status="enabled" class="mojo-cache-toggle btn btn-primary btn-md">Disable</button>
								<?php
							} else {
								?>
								<button data-type="object" data-status="disabled" class="mojo-cache-toggle btn btn-success btn-md">Enable</button>
								<?php
							}
							?>
						</div>
					</div>
				</div>
			</div>
		</div>
	</main>
</div>
<script type="text/javascript">
jQuery( document ).ready( function( $ ) {
	$( '.mojo-cache-toggle' ).click( function () {
		var cache_data = {
			'action'         : 'mm_cache',
			'type'           : $( this ).data( 'type' ) ,
			'current_status' : $( this ).data( 'status' )
		}
		var button = $(this);
		$.post( ajaxurl, cache_data, function( cache_response ) {
			try {
				response = JSON.parse( cache_response );
			} catch (e) {
				response = {status:"error", message:"Invalid JSON response."};
			}

			if ( typeof response.message !== 'undefined' ) {
				$( '#mojo-wrapper' ).append( '<div id="mm-message" class="mm-' + response.status + '" style="display:none;">' + response.message + '</div>' );
				$( '#mm-message' ).fadeIn( 'slow', function() {
					if ( response.status == 'success' ) {
						if ( button.data( 'status' ) == 'disabled' ) {
							button.data( 'status', 'enabled' );
							button.removeClass( 'btn-success' );
							button.addClass( 'btn-primary' );
							button.html( 'Disable' );
						} else {
							button.data( 'status', 'disabled' );
							button.removeClass( 'btn-primary' );
							button.addClass( 'btn-success' );
							button.html( 'Enable' );
						}
					}
					setTimeout( function() {
						$( '#mm-message' ).fadeOut( 'fast', function() {
							$( '#mm-message' ).remove();
						} );
					}, 8000 );
				} );
			}

		} );
	} );
} );
</script>
