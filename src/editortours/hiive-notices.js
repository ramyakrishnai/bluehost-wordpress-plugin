import { select, dispatch } from '@wordpress/data';
import { useEffect, useState } from '@wordpress/element';
import { PluginPostPublishPanel } from '@wordpress/edit-post';
import { __ } from '@wordpress/i18n';
import { Fragment } from 'react';
import apiFetch from '@wordpress/api-fetch';

const InnerPostPublishNotifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);

    const staleResponse = () => {
        const staleData = `{
            "data": [{
                "id": "733e6c99-5e86-44c1-8848-b602a531d8ec",
                "locations": {
                    "pages": ["#\/accelerator-poc"],
                    "context": "integrated-prototype"
                },
                "expiration": 1629320825,
                "content": "<a href='\/cgi\/app\/#\/sites\/2f7075626c69635f68746d6c2f\/login?bounce=%2Fpost-new.php'>Write a blog post!<\/a><img src='https:\/\/test.hiive.cloud\/i.png?notification_id=733e6c99-5e86-44c1-8848-b602a531d8ec' alt='' width='1' height='1' style='position: absolute;' \/>"
            }, {
                "id": "f34edc3f-0aa1-4540-a85c-ccbfe02b4b1b",
                "locations": {
                    "pages": "all",
                    "context": "block-editor-post-publish"
                },
                "expiration": 1629320825,
                "content": "<div class='components-notice is-info'> <div class='components-notice__content'> <p>It's time to go back to Bluehost to complete next steps!<\/p><div class='components-notice__actions'> <a href='http:\/\/localhost:5000\/#\/accelerator-poc'>Return to Bluehost<\/a> <\/div><\/div><\/div><img src='https:\/\/test.hiive.cloud\/i.png?notification_id=f34edc3f-0aa1-4540-a85c-ccbfe02b4b1b' alt='' width='1' height='1 style='position: absolute;' \/>"
            }, {
                "id": "b4d5d271-29ec-43b8-a658-7d9dbc82ff30",
                "locations": [{
                    "pages": ["#\/accelerator-poc"],
                    "context": "integrated-prototype"
                }],
                "expiration": 1631826341,
                "content": "<a href='\/cgi\/app\/#\/sites\/2f7075626c69635f68746d6c2f\/login?bounce=%3Fdcpage%3Dabout-me'>Make an About Me page<\/a><img src='https:\/\/test.hiive.cloud\/i.png?notification_id=b4d5d271-29ec-43b8-a658-7d9dbc82ff30' alt='' width='1' height='1' style='position: absolute;' \/>"
            }]
        }`;

        const response = JSON.parse(staleData);

        const beContextNotices = [];
        if ( 'undefined' !== typeof response.data ) {
            response.data.map( notice => {
                if ( 'undefined' !== typeof notice.locations ) {
                    if ( 'object' === typeof notice.locations ) {
                        notice.locations = [notice.locations];
                    }
                    notice.locations.map( ({context}) => {
                        if ('block-editor-post-publish' === context ) {
                            beContextNotices.push(notice);
                        }
                    })
                }
            })
        }
        if (beContextNotices.length > 0) {
            jQuery('.newfold-default-content-published-notifications').addClass('loaded');
            setNotifications(beContextNotices);
            setIsLoaded(true);
        }
    }

    const apiResponse = () => {
        apiFetch({
            path: '/bluehost/v1/notifications/events',
            method: 'POST',
            data: {
                action: 'block-editor-post-publish',
                category: window.nfTourContext,
                queue: false,
            },
        }).then( response => {
            const beContextNotices = [];
            if ( 'undefined' !== typeof response.data ) {
                response.data.map( notice => {
                    if ( 'undefined' !== typeof notice.locations ) {
                        if ( 'object' === typeof notice.locations ) {
                            notice.locations = [notice.locations];
                        }
                        notice.locations.map( ({context}) => {
                            if ('block-editor-post-publish' === context ) {
                                beContextNotices.push(notice);
                            }
                        })
                    }
                })
            }
            if (beContextNotices.length > 0) {
                jQuery('.newfold-default-content-published-notifications').addClass('loaded');
                setNotifications(beContextNotices);
                setIsLoaded(true);
            }
        })
    }

    useEffect(() => {
        if ('undefined' !== typeof window.manual) {
            staleResponse();
        } else {
            apiResponse();
        }
    }, [])

    if( ! isLoaded ) {
        return false;
    }

    return(
        <Fragment>
            {notifications.map( notice => <div key={notice.id} dangerouslySetInnerHTML={{ __html: notice.content }} data-id={notice.id} /> ) }
        </Fragment>
    )
}

export const PostPublishNotifications = () => {
    return (
        <PluginPostPublishPanel
            className="newfold-default-content-published-notifications"
            title={__('Bluehost', 'bluehost-wordpress-plugin')}
            opened={true}
            initialOpen={true}
            icon={<span />}
        >
            <InnerPostPublishNotifications />
        </PluginPostPublishPanel>
    )
}