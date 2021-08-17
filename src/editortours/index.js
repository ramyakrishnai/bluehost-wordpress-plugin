import './style.scss';

import { lazy, Suspense, Fragment } from '@wordpress/element';
import { registerPlugin } from '@wordpress/plugins';
import { ErrorBoundary } from 'react-error-boundary';
import { suppressCoreTour } from './suppress-core-tour';
import { setupCaretEvents, PrePublishValidation, PostPublishNotifications } from './highlighting';

const AboutTour = lazy(() => import('./about'));
const ContactTour = lazy(() => import('./contact'));
const HomeTour = lazy(() => import('./home'));
const AboutMeTour = lazy(() => import('./about-me'));

// Register Placeholder Validation Panel in Pre-Publish Sidebar
registerPlugin( 'newfold-editor-placeholders', { render: PrePublishValidation } );
registerPlugin( 'newfold-digital-postpublish-notices', { render: PostPublishNotifications })

export const EditorTours = () => {
    // suppress Core Welcome Guide when Newfold Tours are active.
    suppressCoreTour();
    // setup caretIn and caretOut custom events
    setupCaretEvents();

    const tour = 'undefined' !== typeof window.nfTourContext ? window.nfTourContext : false;
    let CurrentTour = <Fragment />;

    switch( tour ) {
        case 'about':
            CurrentTour = AboutTour;
            break;
        case 'contact':
            CurrentTour = ContactTour;
            break;
        case 'home':
            CurrentTour = HomeTour;
            break;
        case 'about-me':
            CurrentTour = AboutMeTour;
            break;
        default:
            CurrentTour = Fragment;
            break;
    }
    
    return (
        <ErrorBoundary FallbackComponent={<div />}>
            <Suspense fallback={<div />}>
                <CurrentTour />
            </Suspense>
        </ErrorBoundary>
    )
}

export default EditorTours;