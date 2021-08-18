import apiFetch from '@wordpress/api-fetch';
import { select, dispatch } from '@wordpress/data';
import { createBlock, parse } from '@wordpress/blocks';
import { useState, useEffect } from '@wordpress/element';
import { addQueryArgs } from '@wordpress/url';
import { __ } from '@wordpress/i18n';

import { BaseTour, addToStep, awaitElement, clearAllBlocks } from '../base';

/**
 * Merge API-driven content and config with necessary JS functions to make tour 💯 work.
 * 
 * @param {array} apiResponse 
 * @returns {array}
 */
const aboutMeTourSteps = (apiResponse) => {
    let steps = apiResponse;

    steps = addToStep(
        steps,
        'about-me-intro',
        {
            when: {
                show: () => {
                    dispatch('core/block-editor').lockPostSaving('bluehost-general-tour');
                    dispatch('core/block-editor').lockPostAutosaving('bluehost-general-tour');
                }
            }
        }
    );
    
    steps = addToStep(
        steps, 
        'about-me-content-area', 
        { 
            beforeShowPromise: () => {
                return new Promise( resolve => {
                    dispatch('core/editor').editPost({ title: ''})
                    clearAllBlocks().then( () => {
                        resolve()
                    })
                })
            },
            when: {
                show: () => {
                    const contentString = `<!-- wp:paragraph -->
                    <p>Telling your story in paragraphs is <em>so 2010.</em></p>
                    <!-- /wp:paragraph -->
                    
                    <!-- wp:list -->
                    <ul><li>Sure lists add...</li><li>... some nice separation...</li><li>... but they're still not exciting.</li></ul>
                    <!-- /wp:list -->
                    
                    <!-- wp:group {"align":"full"} -->
                    <div class="wp-block-group alignfull"><!-- wp:spacer {"height":70} -->
                    <div style="height:70px" aria-hidden="true" class="wp-block-spacer"></div>
                    <!-- /wp:spacer -->
                    
                    <!-- wp:group {"align":"full","gradient":"purple-to-red"} -->
                    <div class="wp-block-group alignfull has-purple-to-red-gradient-background has-background"><!-- wp:columns {"verticalAlignment":"center","align":"wide"} -->
                    <div class="wp-block-columns alignwide are-vertically-aligned-center"><!-- wp:column {"width":"50%"} -->
                    <div class="wp-block-column" style="flex-basis:50%"><!-- wp:paragraph {"style":{"typography":{"lineHeight":"1.1","fontSize":"30px"},"color":{"text":"#000000"}}} -->
                    <p class="has-text-color" style="color:#000000;font-size:30px;line-height:1.1"><strong>That's where Blocks come in...</strong></p>
                    <!-- /wp:paragraph --></div>
                    <!-- /wp:column -->
                    
                    <!-- wp:column {"width":"50%"} -->
                    <div class="wp-block-column" style="flex-basis:50%"><!-- wp:separator {"customColor":"#000000","className":"is-style-wide"} -->
                    <hr class="wp-block-separator has-text-color has-background is-style-wide" style="background-color:#000000;color:#000000"/>
                    <!-- /wp:separator --></div>
                    <!-- /wp:column --></div>
                    <!-- /wp:columns -->
                    
                    <!-- wp:columns {"align":"wide"} -->
                    <div class="wp-block-columns alignwide"><!-- wp:column -->
                    <div class="wp-block-column"><!-- wp:spacer {"height":99} -->
                    <div style="height:99px" aria-hidden="true" class="wp-block-spacer"></div>
                    <!-- /wp:spacer -->
                    
                    <!-- wp:pullquote {"align":"left"} -->
                    <figure class="wp-block-pullquote alignleft"><blockquote><p>Learn Blocks, <br>you must 🖖</p><cite>- The Block High Council</cite></blockquote></figure>
                    <!-- /wp:pullquote --></div>
                    <!-- /wp:column -->
                    
                    <!-- wp:column -->
                    <div class="wp-block-column"><!-- wp:paragraph {"style":{"color":{"text":"#000000"}},"fontSize":"extra-small"} -->
                    <p class="has-text-color has-extra-small-font-size" style="color:#000000">Blocks let you tell your story in a more visually-striking way, making your content look professionally-designed and assembled.<br><br>Sure, there are simple Paragraphs and Lists, Headings and Blockquotes. But also rich media layouts, design elements and interactive embeds and forms.<br><br><strong>The simple word document is out. Blocks are in.</strong></p>
                    <!-- /wp:paragraph --></div>
                    <!-- /wp:column -->
                    
                    <!-- wp:column -->
                    <div class="wp-block-column"><!-- wp:paragraph {"style":{"color":{"text":"#000000"}},"fontSize":"extra-small"} -->
                    <p class="has-text-color has-extra-small-font-size" style="color:#000000"><em><strong>There's so much you can you.</strong></em> You can change alignments, you can build Columns and Groups, beautiful Covers to introduce your ideas and Social Media Buttons to be found. You can also show all your WordPress content, where you want and how you want. There are dozens of Blocks built-in and hundreds available for free. <br><br>Once you learn Blocks, nothing can block you from building beautiful website content!</p>
                    <!-- /wp:paragraph --></div>
                    <!-- /wp:column --></div>
                    <!-- /wp:columns --></div>
                    <!-- /wp:group --></div>
                    <!-- /wp:group -->`
                    dispatch('core/editor').editPost({ title: __('About Me', 'bluehost-wordpress-plugin')})
                    dispatch('core/block-editor').resetBlocks(parse(contentString));
                },
            }
        }
    );

    steps = addToStep(
        steps, 
        'about-me-settings-sidebar', 
        { 
            beforeShowPromise: () => {
                clearAllBlocks()
                return new Promise( resolve => {
                    dispatch('core/edit-post').openGeneralSidebar('edit-post/document').then( () => {
                        jQuery('.editor-post-title__input').focus();
                        resolve();
                    })
                })
            },
        }
    );

    steps = addToStep(
        steps, 
        'about-me-block-sidebar', 
        { 
            beforeShowPromise: () => {
                return new Promise( resolve => {
                    clearAllBlocks().then( () => {
                        const blockSidebarString = `<!-- wp:paragraph {"style":{"typography":{"fontSize":"64px"}}} -->
                        <p style="font-size:64px">This Paragraph Block can be designed using options in the Block Sidebar to the right!</p>
                        <!-- /wp:paragraph -->`
                        dispatch('core/block-editor').resetBlocks(parse(blockSidebarString)).then( () => {
                            let blocks = select('core/block-editor').getBlocks();
                            dispatch('core/block-editor').selectBlock(blocks[0].clientId).then( () => {
                                dispatch('core/edit-post').openGeneralSidebar('edit-post/block').then( () => {
                                    resolve()
                                })
                            })
                        })
                    })
                })
            },
        }
    );

    steps = addToStep(
        steps, 
        'about-me-block-inserter', 
        { 
            beforeShowPromise: () => {
                return new Promise( resolve => {
                    clearAllBlocks().then( () => {
                        const inserterContentString = `<!-- wp:cover {"overlayColor":"green","contentPosition":"center center","align":"wide","className":"is-style-twentytwentyone-border"} -->
                        <div class="wp-block-cover alignwide has-green-background-color has-background-dim is-style-twentytwentyone-border"><div class="wp-block-cover__inner-container"><!-- wp:spacer {"height":20} -->
                        <div style="height:20px" aria-hidden="true" class="wp-block-spacer"></div>
                        <!-- /wp:spacer -->
                        
                        <!-- wp:paragraph {"fontSize":"huge"} -->
                        <p class="has-huge-font-size">Don't rebuild the wheel every time.</p>
                        <!-- /wp:paragraph -->
                        
                        <!-- wp:spacer {"height":20} -->
                        <div style="height:20px" aria-hidden="true" class="wp-block-spacer"></div>
                        <!-- /wp:spacer -->
                        
                        <!-- wp:paragraph {"align":"left","fontSize":"extra-large"} -->
                        <p class="has-text-align-left has-extra-large-font-size">Checkout <strong>Patterns</strong>!</p>
                        <!-- /wp:paragraph -->
                        
                        <!-- wp:spacer {"height":20} -->
                        <div style="height:20px" aria-hidden="true" class="wp-block-spacer"></div>
                        <!-- /wp:spacer --></div></div>
                        <!-- /wp:cover -->
                        
                        <!-- wp:paragraph -->
                        <p></p>
                        <!-- /wp:paragraph -->`;
                        dispatch('core/block-editor').resetBlocks(parse(inserterContentString));

                        jQuery('.edit-post-header-toolbar__inserter-toggle').click();
                        awaitElement('.interface-interface-skeleton__secondary-sidebar').then(() => {
                            resolve();
                        })
                    })
                })
            },
        }
    );

    steps = addToStep(
        steps, 
        'about-me-copying', 
        { 
            beforeShowPromise: () => {
                return new Promise( resolve => {
                    clearAllBlocks().then( () => {
                        resolve();
                    })
                })
            },
        }
    );

    return steps;
}

export const AboutMeTour = () => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [steps, setSteps] = useState([]);
    const path = addQueryArgs('/newfold/v1/tours/blockeditor', {type: 'about-me', brand: 'bluehost', lang: 'en-us'});

    useEffect(() => {
        apiFetch({ path }).then(response => {
            setSteps(aboutMeTourSteps(response));
            setIsLoaded(true);
        })
    }, [])

    if(! isLoaded) {
        return false;
    }

    return <BaseTour type="about-me" steps={steps} />
}

export default AboutMeTour;