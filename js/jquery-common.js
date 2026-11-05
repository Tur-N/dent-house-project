
'use strict';

$(document).ready(function () {

    const STORAGE_KEYS = {
        booking: 'dentHouse.confirmedAppointment',
        draft: 'dentHouse.bookingDraft',
        cart: 'dentHouse.serviceCart',
        doctor: 'dentHouse.selectedDoctor'
    };

    // Browser storage helpers.
    function readStorage(key, fallback = null) {

        try {

            const value = localStorage.getItem(key);

            return value === null
                ? fallback
                : JSON.parse(value);

        } catch (error) {

            console.error('Storage read error:', error);

            return fallback;
        }
    }

    function writeStorage(key, value) {

        try {

            localStorage.setItem(key, JSON.stringify(value));

            return true;

        } catch (error) {

            console.error('Storage write error:', error);

            return false;
        }
    }

    function removeStorage(key) {

        try {

            localStorage.removeItem(key);

            return true;

        } catch (error) {

            console.error('Storage removal error:', error);

            return false;
        }
    }

    function formatPrice(value) {

        return new Intl.NumberFormat('en-US').format(value) + ' KZT';
    }

    window.DentHouse = {
        storageKeys: STORAGE_KEYS,
        readStorage: readStorage,
        writeStorage: writeStorage,
        removeStorage: removeStorage,
        formatPrice: formatPrice
    };

    // Apply the same header dimensions as index.html to every page.
    $('.main-header').each(function () {

        const $header = $(this);

        const $container = $header
            .children('.container-fluid')
            .first();

        $container.attr(
            'class',
            'container-fluid px-3 px-md-5 py-4'
        );

        // Match the homepage eyebrow.
        $header.find('.eyebrow').first().attr(
            'class',
            'eyebrow text-uppercase fw-bold small mb-2'
        );

        // Match the homepage title size and spacing.
        $header.find('.site-title').first().attr(
            'class',
            'site-title display-4 fw-bold mb-2'
        );

        // Match the homepage tagline.
        $header.find('.site-tagline').first().attr(
            'class',
            'site-tagline lead mb-4'
        );

        // Match the homepage Bootstrap navigation.
        const $navigation = $header.find('nav.navbar').first();

        $navigation.attr(
            'class',
            'navbar navbar-expand-lg navbar-dark'
        );

        $navigation.find('.navbar-toggler').attr(
            'class',
            'navbar-toggler mx-auto'
        );

        $navigation.find('.navbar-collapse').first().attr(
            'class',
            'collapse navbar-collapse justify-content-center'
        );

        $navigation.find('.navbar-nav').attr(
            'class',
            'navbar-nav flex-wrap justify-content-center gap-2'
        );

        // Remove previously generated booking buttons from the navigation.
        // The homepage already has its own hero booking button.
        $navigation.find(
            '.js-booking-nav-item, .js-quick-booking-wrap, [data-role="booking-link"]'
        ).remove();

        // Remove legacy booking links even if they were created without
        // the expected class name.
        $navigation.find('a').filter(function () {

            return $(this).text().trim() === 'Book an Appointment';

        }).each(function () {

            const $link = $(this);

            const $item = $link.closest('li');

            if ($item.length) {
                $item.remove();
            } else {
                $link.remove();
            }

        });

        // Highlight the current page.
        const currentPage =
            window.location.pathname.split('/').pop() || 'index.html';

        $navigation.find('a.nav-link').each(function () {

            const $link = $(this);

            const href = $link.attr('href') || '';

            const destination = href.split('#')[0];

            if (destination === currentPage) {

                $link.addClass('active');
                $link.attr('aria-current', 'page');

            } else {

                $link.removeClass('active');
                $link.removeAttr('aria-current');
            }
        });

    });

});
