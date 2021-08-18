import { select, dispatch } from '@wordpress/data';
import { parse } from '@wordpress/blocks';
import { capitalize } from 'lodash';
import { __ } from '@wordpress/i18n';
import apiFetch from '@wordpress/api-fetch';
import { initHighlightEraser, scrubPlaceholders } from './highlighting'

const NOTICES_STORE = 'core/notices';
const TOUR_NOTICE_ID = 'newfold-tour-notice';
const TOUR_RELAUNCHER_ELEMENT = 'newfold-tour-relauncher';

export const initEvents = (tourName, tour) => {

    initHighlightEraser();

    const aboutMeInsertContent = () => {
        const aboutMeContent = `<!-- wp:image {"align":"center","sizeSlug":"large","className":"is-style-rounded"} -->
        <div class="wp-block-image is-style-rounded"><figure class="aligncenter size-large"><img src="https://cdn.hiive.space/bluehost/ise/bluebot.png" alt=""/><figcaption><strong><em>@botfluencer</em></strong></figcaption></figure></div>
        <!-- /wp:image -->
        
        <!-- wp:heading {"textAlign":"center","style":{"typography":{"lineHeight":"1"}}} -->
        <h2 class="has-text-align-center" style="line-height:1"><strong>Botfluencer Blueuser</strong></h2>
        <!-- /wp:heading -->
        
        <!-- wp:paragraph {"align":"center","style":{"typography":{"lineHeight":"1"}},"fontSize":"extra-small"} -->
        <p class="has-text-align-center has-extra-small-font-size" style="line-height:1"><em>YouTube Creator. Twitch Streamer. That dancing #TikTok bot.</em></p>
        <!-- /wp:paragraph -->
        
        <!-- wp:social-links {"size":"has-large-icon-size","className":"items-justified-center is-style-pill-shape"} -->
        <ul class="wp-block-social-links has-large-icon-size items-justified-center is-style-pill-shape"><!-- wp:social-link {"url":"#","service":"youtube"} /-->
        
        <!-- wp:social-link {"url":"#","service":"instagram"} /-->
        
        <!-- wp:social-link {"url":"#","service":"tiktok"} /-->
        
        <!-- wp:social-link {"url":"#","service":"twitch"} /-->
        
        <!-- wp:social-link {"url":"#","service":"twitter"} /--></ul>
        <!-- /wp:social-links -->
        
        <!-- wp:columns {"align":"wide"} -->
        <div class="wp-block-columns alignwide"><!-- wp:column {"verticalAlignment":"top","width":"33.33%"} -->
        <div class="wp-block-column is-vertically-aligned-top" style="flex-basis:33.33%"><!-- wp:buttons {"contentJustification":"center"} -->
        <div class="wp-block-buttons is-content-justification-center"><!-- wp:button {"width":100,"style":{"color":{"background":"#111111","text":"#fefefe"},"border":{"radius":6}}} -->
        <div class="wp-block-button has-custom-width wp-block-button__width-100"><a class="wp-block-button__link has-text-color has-background" style="border-radius:6px;background-color:#111111;color:#fefefe">Watch my videos</a></div>
        <!-- /wp:button -->
        
        <!-- wp:button {"width":100,"style":{"color":{"background":"#111111","text":"#fefefe"},"border":{"radius":6}}} -->
        <div class="wp-block-button has-custom-width wp-block-button__width-100"><a class="wp-block-button__link has-text-color has-background" style="border-radius:6px;background-color:#111111;color:#fefefe">Join my exclusive Patreon</a></div>
        <!-- /wp:button -->
        
        <!-- wp:button {"width":100,"style":{"color":{"background":"#111111","text":"#fefefe"},"border":{"radius":6}}} -->
        <div class="wp-block-button has-custom-width wp-block-button__width-100"><a class="wp-block-button__link has-text-color has-background" style="border-radius:6px;background-color:#111111;color:#fefefe">Get 5% off Bluehost</a></div>
        <!-- /wp:button --></div>
        <!-- /wp:buttons -->
        
        <!-- wp:buttons {"contentJustification":"center"} -->
        <div class="wp-block-buttons is-content-justification-center"><!-- wp:button {"width":50,"className":"is-style-outline"} -->
        <div class="wp-block-button has-custom-width wp-block-button__width-50 is-style-outline"><a class="wp-block-button__link">Merch</a></div>
        <!-- /wp:button -->
        
        <!-- wp:button {"width":50,"className":"is-style-outline"} -->
        <div class="wp-block-button has-custom-width wp-block-button__width-50 is-style-outline"><a class="wp-block-button__link">Booking</a></div>
        <!-- /wp:button --></div>
        <!-- /wp:buttons --></div>
        <!-- /wp:column -->
        
        <!-- wp:column {"verticalAlignment":"center","width":"66.66%"} -->
        <div class="wp-block-column is-vertically-aligned-center" style="flex-basis:66.66%"><!-- wp:spacer {"height":1} -->
        <div style="height:1px" aria-hidden="true" class="wp-block-spacer"></div>
        <!-- /wp:spacer -->
        
        <!-- wp:embed {"url":"https://www.youtube.com/watch?v=mDORe5-zrfs","type":"video","providerNameSlug":"youtube","responsive":true,"className":"wp-embed-aspect-16-9 wp-has-aspect-ratio"} -->
        <figure class="wp-block-embed is-type-video is-provider-youtube wp-block-embed-youtube wp-embed-aspect-16-9 wp-has-aspect-ratio"><div class="wp-block-embed__wrapper">
        https://www.youtube.com/watch?v=mDORe5-zrfs
        </div><figcaption><strong>Meet <em>Botfluencer</em> Tuesdays at 10AM ET on Twitch</strong></figcaption></figure>
        <!-- /wp:embed --></div>
        <!-- /wp:column --></div>
        <!-- /wp:columns -->
        
        <!-- wp:separator {"className":"is-style-dots"} -->
        <hr class="wp-block-separator is-style-dots"/>
        <!-- /wp:separator -->
        
        <!-- wp:paragraph {"dropCap":true} -->
        <p class="has-drop-cap">Bluehost is a leading web hosting solutions company. Since our founding in 2003, Bluehost has continually innovated new ways to deliver on our mission: to empower people to fully harness the web. Based in Orem, Utah, we provide comprehensive tools to millions of users throughout the world so anyone, novice or pro, can get on the web and thrive with our web hosting packages.</p>
        <!-- /wp:paragraph -->
        
        <!-- wp:heading {"level":3} -->
        <h3>Committed to WordPress</h3>
        <!-- /wp:heading -->
        
        <!-- wp:paragraph -->
        <p>We believe in WordPress and our partnership has allowed us to support it for over 10 years. Our in-house team consists of dedicated WordPress experts to provide the best customer support whenever you need answers. We even dedicate engineers on our development staff to full-time WordPress CORE development. No one powers WordPress better or understands it more than we do. Bluehost is constantly driven to be the number one web solution provider.</p>
        <!-- /wp:paragraph -->`

        dispatch('core/block-editor').resetBlocks(parse(aboutMeContent));
    }

    const initNoticeRelauncher = () => {
        jQuery('a.' + TOUR_RELAUNCHER_ELEMENT).on('click', evt => {
            evt.preventDefault();
            tour.start();
        });
    }

    const disableLoader = () => {
        const loader = document.getElementById('newfold-editortours-loading');
        if ( loader ) {
            scrubPlaceholders();
            loader.classList.add('loaded');
        }
    }
    disableLoader();

    const eventTracking = (context, category)  => {
        let data = {
            action: 'tour-' + context.tour.options.type,
            category: category,
            data: {
                step: context?.step?.id
            },
        };
        apiFetch({ path: '/bluehost/v1/notifications/events', method: 'POST', data });
    }

    const noticeConfig = {
        id: TOUR_NOTICE_ID,
        actions: [{
            url: '#',
            label: __('Reopen Tour', 'bluehost-wordpress-plugin'),
            className: TOUR_RELAUNCHER_ELEMENT
        }]
    };

    const noticeLabel = capitalize(tour.options.type);

    tour.on('active', () => { 
        dispatch(NOTICES_STORE).removeNotice(TOUR_NOTICE_ID);
    });

    tour.on('show', context => {
        eventTracking(context, 'show');
    });

    tour.on('hide', () => { 
        if ( 'about-me' === tour.options.type ) {
            aboutMeInsertContent();
        } else {
            dispatch(NOTICES_STORE).createInfoNotice(
                noticeLabel + ' ' + __('Page tour closed.', 'bluehost-wordpress-plugin'), 
            noticeLabel + ' ' + __('Page tour closed.', 'bluehost-wordpress-plugin'), 
                noticeLabel + ' ' + __('Page tour closed.', 'bluehost-wordpress-plugin'), 
                noticeConfig
            ).then(() => {
                initNoticeRelauncher();
            });
        }
       
        
    });

    tour.on('complete', context => {
        eventTracking(context, 'complete'); 
        if ( 'about-me' === tour.options.type ) {
            aboutMeInsertContent();
        } else {
            dispatch(NOTICES_STORE).createSuccessNotice(
                noticeLabel + ' ' + __('Page tour is complete!', 'bluehost-wordpress-plugin'), 
            noticeLabel + ' ' + __('Page tour is complete!', 'bluehost-wordpress-plugin'), 
                noticeLabel + ' ' + __('Page tour is complete!', 'bluehost-wordpress-plugin'), 
                noticeConfig
            ).then(() => {
                initNoticeRelauncher();
            });
        }
    });

    tour.on('cancel', context => {
        eventTracking(context, 'cancel'); 
        if ( 'about-me' === tour.options.type ) {
            aboutMeInsertContent();
        } else {
            dispatch(NOTICES_STORE).createInfoNotice(
                noticeLabel + ' ' + __('Page tour closed. You can restart it below.', 'bluehost-wordpress-plugin'), 
            noticeLabel + ' ' + __('Page tour closed. You can restart it below.', 'bluehost-wordpress-plugin'), 
                noticeLabel + ' ' + __('Page tour closed. You can restart it below.', 'bluehost-wordpress-plugin'), 
                noticeConfig
            ).then(() => {
                initNoticeRelauncher();
            });
        }
    });

}

export default { initEvents };