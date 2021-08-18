<?php

namespace Newfold\Plugin\Tours;

use \__;
use \Newfold\Plugin\DefaultContent\Pages;

/**
 * REST API Endpoint
 */
class BlockEditorRestController extends \Newfold\Plugin\RestApi\BaseHiiveController {

    /**
     * Register Editor Tours REST API Routes
     */
    public function register_routes() {
        \register_rest_route(
            $this->namespace,
            '/' . $this->rest_base . '/tours/blockeditor',
            array(
                array(
                    'methods' => \WP_REST_Server::READABLE,
                    'callback' => array( $this, 'get_steps' ),
                    'permission_callback' => array( $this, 'has_permission' ),
                    'args' => array(
                        'type' => array(
                            'description'       => 'Type of Editor Tour',
                            'type'              => 'string',
                            'enum'              => Pages::$contexts,
                            'default'           => 'about',
                            'sanitize_callback' => 'sanitize_text_field'
                        ),
                    ),
                )
            )
        );
    }

    /**
     * Undocumented function
     *
     * @return void
     */
    public function get_steps( $request ) {
        $steps = array();
        $type = isset( $request['type'] ) ? $request['type'] : '';

        switch( $type ) {
            case 'about':
                $steps = $this->steps_about_page();
                break;
            case 'contact':
                $steps = $this->steps_contact_page();
                break;
            case 'home':
                $steps = $this->steps_home_page();
                break;
            case 'about-me':
                $steps = $this->steps_about_me();
                break;
        }

        return \rest_ensure_response( $steps );
    }

    /**
     * Undocumented function
     *
     * @return boolean
     */
    public function has_permission() {
        return \current_user_can('edit_posts');
    }

    /**
     * Shepherd.js Steps for About Page Tour
     *
     * @return array
     */
    private function steps_about_page() {
        $about_image = '<img src="https://cdn.hiive.space/bluehost/about-page.svg" alt="' . \__('People around monitor working and pointing.', 'bluehost-wordpress-plugin') . '" height="340" width="auto" style="display:block;margin:0 auto;" />';

        return array(
            array(
                'id' => 'intro',
                'classes' => 'wrap-large',
                'buttons' => array(
                    Shared::secondary_button( 'Exit', 'cancel' ),
                    Shared::primary_button( 'Get Started' ),
                ),
                'title' => __('Create an About Page with Bluehost', 'bluehost-wordpress-plugin'),
                'text'  => Shared::large_step( $about_image . __('Your about page is where people get to know you.<br /><br />It\'s a great place to share how you got started and reasons you do what you do.', 'bluehost-wordpress-plugin') ),
            ),
            array(
                'id' => 'audience',
                'attachTo' => array( 'element' => '.block-editor-block-list__layout.is-root-container', 'on' => 'auto' ),
                'buttons' => array(
                    Shared::secondary_button(),
                    Shared::primary_button(),
                ),
                'title' => __('What should visitors know?', 'bluehost-wordpress-plugin'),
                'text' => Shared::step( 'We have some fill-in-the-blanks here to get you started. Original stories will often rank better with search engines, so change as much as you want!' ),
                'scrollTo' => true,
                'canClickTarget' => false,
            ),
            array(
                'id' => 'inserter',
                'attachTo' => array( 'element' => '.edit-post-header-toolbar__inserter-toggle', 'on' => 'bottom' ),
                'advanceOn' => array( 'selector' => '.edit-post-header-toolbar__inserter-toggle', 'event' => 'click' ),
                'buttons' => array(
                    Shared::secondary_button()
                ),
                'title' => __( 'Find the building blocks you\'ll need', 'bluehost-wordpress-plugin' ),
                'text' => Shared::step( __('The Block Inserter contains your toolkit with text & media blocks, plus common layouts called Block Patterns: <strong>Click the button now to open the Block Inserter</strong>.', 'bluehost-wordpress-plugin') ),
            ),
            array(
                'id' => 'inserter-opened',
                'attachTo' => array( 'element' => '.interface-interface-skeleton__secondary-sidebar', 'on' => 'auto' ),
                'buttons' => array(
                    Shared::secondary_button(),
                    Shared::primary_button(),
                ),
                'scrollTo' => false,
                'popperOptions' => array(
                    'modifiers' => array(
                        array(
                            'name' => 'focusAfterRender',
                            'enabled' => false,
                        )
                    )
                ),
                'canClickTarget' => false,
                'title' => __('Tell with words, show with media', 'bluehost-wordpress-plugin'),
                'text' => Shared::step( __('Weave photos, YouTube embeds, logos, and social icons in with Paragraphs and Headings for a compelling story.', 'bluehost-wordpress-plugin')),
            ),
            array(
                'id' => 'fork',
                'attachTo' => array( 'element' => '.editor-post-publish-button__button', 'on' => 'auto' ),
                'buttons' => array(
                    Shared::primary_button('Get Started', 'complete'),
                ),
                'title' => __('Let\'s go!', 'bluehost-wordpress-plugin'),
                'text' => Shared::step( __('It\'s time to tackle those placeholders and tell the web who you are! When you\'re ready, you can click here to publish your page.', 'bluehost-wordpress-plugin')),
            ),
        );
    }

    /**
     * Shepherd.js Steps for Contact Page Tour
     *
     * @return array
     */
    private function steps_contact_page() {
        $contact_image = '<img src="https://cdn.hiive.space/bluehost/contact-page.svg" alt="' . \__('Person throwing paper airplanes.', 'bluehost-wordpress-plugin') . '" height="340" width="auto" style="display:block;margin:0.5rem auto;" />';
        return array(
            array(
                'id' => 'intro',
                'classes' => 'wrap-large',
                'buttons' => array(
                    Shared::secondary_button( 'Exit', 'cancel' ),
                    Shared::primary_button( 'Get Started' ),
                ),
                'title' => __('Create a Contact Page with Bluehost', 'bluehost-wordpress-plugin'),
                'text'  => Shared::large_step( $contact_image . __('Forms power conversations and commerce across the web -- put yours to work for you today!', 'bluehost-wordpress-plugin') ),
            ),
            array(
                'id' => 'starter',
                'attachTo' => array( 'element' => '[data-type="wpforms/form-selector"]', 'on' => 'auto' ),
                'buttons' => array(
                    Shared::secondary_button(),
                    Shared::primary_button(),
                ),
                'title' => __('We\'ve got the basics covered', 'bluehost-wordpress-plugin'),
                'text' => Shared::step( 'We\'ve setup a simple form for you. Keep in mind short, simple forms are often best -- only add essential fields.' ),
                'scrollTo' => true,
                'canClickTarget' => false,
            ),
            array(
                'id' => 'show-wpforms-link',
                'attachTo' => array( 'element' => 'a.toplevel_page_wpforms-overview', 'on' => 'auto' ),
                'buttons' => array(
                    Shared::secondary_button(),
                    Shared::primary_button(),
                ),
                'title' => __('Read responses, change form fields', 'bluehost-wordpress-plugin'),
                'text' => Shared::step( 'All your forms, including the contact form on this page, can be found right here in your WordPress Admin.' ),
                'scrollTo' => true,
                'canClickTarget' => false,
            ),
            array(
                'id' => 'show-wpforms-menu',
                'attachTo' => array( 'element' => '.toplevel_page_wpforms-overview .wp-submenu', 'on' => 'auto' ),
                'buttons' => array(
                    Shared::secondary_button(),
                    Shared::primary_button(),
                ),
                'title' => __('All the form tools you need', 'bluehost-wordpress-plugin'),
                'text' => Shared::step( 'You can customize email branding, prevent spam, fine-tune form behavior, check logs, and even change the email address form submissions are sent to.' ),
                'scrollTo' => true,
                'canClickTarget' => false,
            ),
            array(
                'id' => 'final-polish',
                'attachTo' => array( 'element' => '.wpforms-gutenberg-panel-notice', 'on' => 'auto' ),
                'buttons' => array(
                    Shared::secondary_button(),
                    Shared::primary_button('Got it', 'complete'),
                ),
                'title' => __('Don\'t forget to test', 'bluehost-wordpress-plugin'),
                'text' => Shared::step( 'Check out this comprehensive guide on how to test your form!' ),
                'scrollTo' => true,
                'canClickTarget' => false,
            ),
        );
    }

    /**
     * Shepherd.js Steps for Home Page Tour
     *
     * @return array
     */
    private function steps_home_page() {
        ob_start(); ?>
        <?php \_e('Use this outline to fill in the content for your homepage', 'bluehost-wordpress-plugin'); ?>:
        <ul>
            <li><strong><?php \_e('Hero image', 'bluehost-wordpress-plugin'); ?></strong> <?php \_e('(the first thing your site visitors will see, so make it good.)', 'bluehost-wordpress-plugin'); ?></li>
            <li><strong><?php \_e('Headline', 'bluehost-wordpress-plugin'); ?></strong> <?php \_e('(the most important thing you want visitors to know.)', 'bluehost-wordpress-plugin'); ?></li>
            <li><strong><?php \_e('Subheadline', 'bluehost-wordpress-plugin'); ?></strong> <?php \_e('(consider adding one or two sentences to give your headline more context.)', 'bluehost-wordpress-plugin'); ?></li>
            <li><strong><?php \_e('Call to action button', 'bluehost-wordpress-plugin'); ?></strong> <?php \_e('(encourage your visitors to buy something, subscribe to something or learn more.)', 'bluehost-wordpress-plugin'); ?></li>
        </ul>
        <?php
        $header_contents = ob_get_clean();

        ob_start() ?>
        <?php \_e('Since you\'re more focused on selling to visitors, think about including', 'bluehost-wordpress-plugin'); ?>:
        <ul>
            <li><?php \_e('“Reasons to believe” that help potential customers understand the value of your products.', 'bluehost-wordpress-plugin'); ?></li>
	        <li><?php \_e('Info on sales, promotions, and incentives', 'bluehost-wordpress-plugin'); ?></li>
            <li><?php \_e('Product listings and images', 'bluehost-wordpress-plugin'); ?></li>
	        <li><?php \_e('Testimonials or customer reviews', 'bluehost-wordpress-plugin'); ?></li>
        </ul>
        <?php
        $mostly_selling = ob_get_clean();

        ob_start() ?>
        <?php \_e('Since you\'re more focused on sharing information with visitors, think about including', 'bluehost-wordpress-plugin'); ?>:
        <ul>
            <li><?php \_e('Key information that supports your header', 'bluehost-wordpress-plugin'); ?></li>
	        <li><?php \_e('Most recent posts or news', 'bluehost-wordpress-plugin'); ?></li>
            <li><?php \_e('Most popular or select, curated blog posts', 'bluehost-wordpress-plugin'); ?></li>
	        <li><?php \_e('Top portfolio pieces, awards, certifications or other supporting materials', 'bluehost-wordpress-plugin'); ?></li>
        </ul>
        <?php
        $mostly_sharing = ob_get_clean();

        $home_image = '<img src="https://cdn.hiive.space/bluehost/home-page.svg" alt="' . \__('Person on lounge chair working on laptop.', 'bluehost-wordpress-plugin') . '" height="340" width="auto" />';

        return array(
            array(
                'id' => 'intro',
                'classes' => 'wrap-large',
                'buttons' => array(
                    Shared::secondary_button( 'Exit', 'cancel' ),
                    Shared::primary_button( 'Get Started' ),
                ),
                'title' => __('Create a Home Page with Bluehost', 'bluehost-wordpress-plugin'),
                'text'  => Shared::large_step(
                    $home_image .
                    Shared::two_col(
                        __('Your website’s home page is your online storefront, billboard, and welcome mat. It’s where you make many first impressions, so it’s important to get it right.', 'bluehost-wordpress-plugin'),
                        __('It should be engaging, helpful, and interesting. It could be as simple as the name of your company, or it might be tied to a promotion or sale that you’re running.', 'bluehost-wordpress-plugin')
                    )
                 ),
            ),
            array(
                'id' => 'header',
                // 'classes' => 'wrap-large',
                'buttons' => array(
                    Shared::secondary_button(),
                    Shared::primary_button(),
                ),
                'title' => __('Our formula for successful Home Page headers', 'bluehost-wordpress-plugin'),
                'text'  => Shared::step( $header_contents ),
            ),
            array(
                'id' => 'prompt',
                'buttons' => array(
                    Shared::secondary_button('Mostly selling', ''),
                    Shared::secondary_button('Mostly sharing', '')
                ),
                'title' => __('For this next section, help us understand your primary goal', 'bluehost-wordpress-plugin'),
                'text' => Shared::step('Is your main goal to sell a product or service? Or are you primarily sharing stories or information?')
            ),
            array(
                'id' => 'mostly-selling',
                'buttons' => array(
                    Shared::secondary_button(),
                    Shared::primary_button('Next', '')
                ),
                'title' => __("Great, let's put your website to work for you", 'bluehost-wordpress-plugin'),
                'text' => Shared::step( $mostly_selling )
            ),
            array(
                'id' => 'mostly-sharing',
                'buttons' => array(
                    Shared::secondary_button('Back', ''),
                    Shared::primary_button()
                ),
                'title' => __("Great, let's tell your story", 'bluehost-wordpress-plugin'),
                'text' => Shared::step( $mostly_sharing )
            ),
            array(
                'id' => 'finish-cta',
                'attachTo' => array( 'element' => '.wp-block.wp-block-buttons .wp-block-button', 'on' => 'right' ),
                'scrollTo' => true,
                'buttons' => array(
                    Shared::secondary_button('Back', ''),
                    Shared::primary_button('Get Started', 'complete')
                ),
                'title' => __("Guide users to your primary goal with a 'Call-to-Action' button", 'bluehost-wordpress-plugin'),
                'text' => Shared::step( __('This can be a button or link that directs people to their next steps. Depending on your site, this might be anything from contacting you, to setting up an appointment, looking at products, making a purchase, or subscribing to your blog or newsletter.', 'bluehost-wordpress-plugin' ) )
            )
        );
    }

    /**
     * Shepherd.js Steps for About Me Tour
     *
     * @return array
     */
    private function steps_about_me() {
        $about_me_image = '<img src="https://cdn.hiive.space/bluehost/ise/intro.svg" alt="' . \__('Group jumping in excitement.', 'bluehost-wordpress-plugin') . '" height="340" width="auto" style="display:block;margin:0 auto;" />';

        ob_start(); ?>
            <ul class="about-me-tools">
                <li>
                    <div class="components-button edit-post-header-toolbar__inserter-toggle is-primary has-icon"><svg width="24" height="24" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" role="img" aria-hidden="true" focusable="false"><path d="M18 11.2h-5.2V6h-1.6v5.2H6v1.6h5.2V18h1.6v-5.2H18z"></path></svg></div>
                    <?php \_e('Insert new Blocks &amp; Patterns', 'bluehost-wordpress-plugin'); ?>
                </li>
                <li>
                    <div class="components-button is-pressed has-icon" aria-label="Settings"><svg width="24" height="24" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" role="img" aria-hidden="true" focusable="false"><path fill-rule="evenodd" d="M10.289 4.836A1 1 0 0111.275 4h1.306a1 1 0 01.987.836l.244 1.466c.787.26 1.503.679 2.108 1.218l1.393-.522a1 1 0 011.216.437l.653 1.13a1 1 0 01-.23 1.273l-1.148.944a6.025 6.025 0 010 2.435l1.149.946a1 1 0 01.23 1.272l-.653 1.13a1 1 0 01-1.216.437l-1.394-.522c-.605.54-1.32.958-2.108 1.218l-.244 1.466a1 1 0 01-.987.836h-1.306a1 1 0 01-.986-.836l-.244-1.466a5.995 5.995 0 01-2.108-1.218l-1.394.522a1 1 0 01-1.217-.436l-.653-1.131a1 1 0 01.23-1.272l1.149-.946a6.026 6.026 0 010-2.435l-1.148-.944a1 1 0 01-.23-1.272l.653-1.131a1 1 0 011.217-.437l1.393.522a5.994 5.994 0 012.108-1.218l.244-1.466zM14.929 12a3 3 0 11-6 0 3 3 0 016 0z" clip-rule="evenodd"></path></svg></div> 
                    <?php \_e('Open/Close Sidebar', 'bluehost-wordpress-plugin'); ?>
                </li>
                <li>
                    <div class="components-dropdown components-dropdown-menu edit-post-more-menu"><div class="components-button components-dropdown-menu__toggle has-icon" aria-label="Options"><svg width="24" height="24" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" role="img" aria-hidden="true" focusable="false"><path d="M13 19h-2v-2h2v2zm0-6h-2v-2h2v2zm0-6h-2V5h2v2z"></path></svg></div></div> 
                    <?php \_e('Main Menu', 'bluehost-wordpress-plugin'); ?>
                </li>
            </ul>
        <?php
        $tools = ob_get_clean();

        ob_start() ?>
        <?php \_e('Since you\'re more focused on sharing information with visitors, think about including', 'bluehost-wordpress-plugin'); ?>:
        <ul>
            <li><?php \_e('Check out the Official WordPress Guide.', 'bluehost-wordpress-plugin'); ?></li>
	        <li><?php \_e('Go deep at our Resource Center', 'bluehost-wordpress-plugin'); ?></li>
            <li><?php \_e('Get personalized help from our Blue Sky experts.', 'bluehost-wordpress-plugin'); ?></li>
        </ul>
        <?php
        $blocked = ob_get_clean();

        return array(
            array(
                'id' => 'about-me-intro',
                'classes' => 'wrap-large',
                'buttons' => array(
                    Shared::secondary_button( 'Exit', 'cancel' ),
                    Shared::primary_button( 'Get Started' ),
                ),
                'title' => __('Let\'s build you a great About Me page!', 'bluehost-wordpress-plugin'),
                'text'  => Shared::large_step( $about_me_image . __('Make a great impression on visitors with a great About Page for all your followers to hear your story and find you online.', 'bluehost-wordpress-plugin') ),
            ),
            array(
                'id' => 'about-me-toolbar',
                'attachTo' => array( 'element' => '.interface-interface-skeleton__header', 'on' => 'auto' ),
                'buttons' => array(
                    Shared::secondary_button(),
                    Shared::primary_button(),
                ),
                'title' => __('Find tools you\'ll need on the Editor Toolbar', 'bluehost-wordpress-plugin'),
                'text' => Shared::step(  $tools ),
                'scrollTo' => true,
                'canClickTarget' => false,
            ),
            array(
                'id' => 'about-me-content-area',
                'attachTo' => array( 'element' => '.interface-interface-skeleton__content', 'on' => 'auto' ),
                'buttons' => array(
                    Shared::secondary_button(),
                    Shared::primary_button(),
                ),
                'title' => __('Work on your Title and Blocks in the Content Area', 'bluehost-wordpress-plugin'),
                'text' => Shared::step( 'Assemble Paragraphs, Headings, Lists, Media, Embeds and more to tell your story and interact with visitors.' ),
                'scrollTo' => true,
                'canClickTarget' => false,
            ),
            array(
                'id' => 'about-me-settings-sidebar',
                'attachTo' => array( 'element' => '.interface-interface-skeleton__sidebar', 'on' => 'auto' ),
                'buttons' => array(
                    Shared::secondary_button(),
                    Shared::primary_button(),
                ),
                'title' => __('Sort, schedule and configure your document from the Settings Sidebar', 'bluehost-wordpress-plugin'),
                'text' => Shared::step( 'Configure when your content publishes, how it\'s sorted and tagged, set the Featured image and write a short summary excerpt.' ),
                'scrollTo' => true,
                'canClickTarget' => false,
            ),
            array(
                'id' => 'about-me-block-sidebar',
                'attachTo' => array( 'element' => '.interface-interface-skeleton__sidebar', 'on' => 'auto' ),
                'buttons' => array(
                    Shared::secondary_button(),
                    Shared::primary_button(),
                ),
                'title' => __('Style and design content from the Block Sidebar', 'bluehost-wordpress-plugin'),
                'text' => Shared::step( 'Each kind of Block has a unique sidebar that opens when you select it. Use those options to put your content in it\'s best light and layout.' ),
                'scrollTo' => true,
                'canClickTarget' => false,
            ),
            array(
                'id' => 'about-me-block-inserter',
                'attachTo' => array( 'element' => '.interface-interface-skeleton__secondary-sidebar', 'on' => 'right-start' ),
                'buttons' => array(
                    Shared::secondary_button(),
                    Shared::primary_button(),
                ),
                'title' => __('Find all the pieces to block puzzle in the Block Inserter', 'bluehost-wordpress-plugin'),
                'text' => Shared::step( 'Pick single Blocks or preassembled Patterns with common designs. Install WordPress Plugins with Custom Blocks for even more powerful sites.' ),
                'scrollTo' => false,
                'popperOptions' => array(
                    'modifiers' => array(
                        array(
                            'name' => 'focusAfterRender',
                            'enabled' => false,
                        )
                    )
                ),
                'canClickTarget' => false,
            ),
            array(
                'id' => 'about-me-copying',
                'buttons' => array(
                    Shared::secondary_button(),
                    Shared::primary_button(),
                ),
                'title' => __('Copy from your preferred editor and Block experts', 'bluehost-wordpress-plugin'),
                'text' => Shared::step( 'Paste from Microsoft Word and Google Docs or common layouts from beautiful examples in the <a href="https://wordpress.org/patterns">WordPress Pattern Directory</a>.' ),
                'scrollTo' => true,
                'canClickTarget' => false,
            ),
            array(
                'id' => 'about-me-blocked',
                'buttons' => array(
                    Shared::secondary_button(),
                    Shared::primary_button('Finish Tour', 'complete')
                ),
                'title' => __('Getting blocked by Blocks?', 'bluehost-wordpress-plugin'),
                'text' => Shared::step( $blocked ),
                'scrollTo' => true,
                'canClickTarget' => false,
            ),
        );
    }
}
