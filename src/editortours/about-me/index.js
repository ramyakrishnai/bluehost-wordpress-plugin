import apiFetch from '@wordpress/api-fetch';
import { select, dispatch } from '@wordpress/data';
import { createBlock, parse } from '@wordpress/blocks';
import { useState, useEffect } from '@wordpress/element';
import { addQueryArgs } from '@wordpress/url';

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
                    jQuery('.editor-post-title__input').text('')
                    clearAllBlocks().then( () => {
                        resolve()
                    })
                })
            },
            when: {
                show: () => {
                    const contentString = `<!-- wp:list -->
                    <ul><li>Instead of just <strong>Paragraphs</strong> and <strong>Lists</strong>, look for opportunities to call your users to actions you want them to take using <strong>Social Icons</strong>, <strong>Buttons</strong>, <strong>Media</strong> and <strong>Embeds</strong>!</li><li>Be conscious about what's above the "digital fold" and what visitors need to scroll to see -- put the most important things at the top and work your way into longer paragraphs and stories.</li></ul>
                    <!-- /wp:list -->`
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
                        const newParagraph = createBlock('core/paragraph', { content: 'When you click into a Block, the Settings Sidebar automatically switches to the Block Sidebar.' })
                        dispatch('core/block-editor').insertBlock(newParagraph).then( () => {
                            dispatch('core/edit-post').openGeneralSidebar('edit-post/block').then( () => {
                                resolve()
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
                        jQuery('.edit-post-header-toolbar__inserter-toggle').click();
                        awaitElement('.interface-interface-skeleton__secondary-sidebar').then(() => {
                            resolve();
                        })
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