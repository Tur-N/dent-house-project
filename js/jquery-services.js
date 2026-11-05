
'use strict';

$(document).ready(function () {

    if (!$('body').hasClass('services-page')) {
        return;
    }

    const $main = $('main').first();

    if (!$main.length || !window.DentHouse) {
        return;
    }

    const storage = window.DentHouse;

    const STORAGE_KEY = storage.storageKeys.cart;

    // Dent House service catalogue.
    const services = [
        {
            id: 'caries',
            name: 'Caries Treatment',
            category: 'Therapeutic',
            price: 24000,
            duration: 60,
            description: 'Depends on diagnosis and cavity depth.'
        },
        {
            id: 'extraction',
            name: 'Tooth Extraction',
            category: 'Surgical',
            price: 20000,
            duration: 45,
            description: 'Depends on tooth complexity and root access.'
        },
        {
            id: 'implant',
            name: 'Dental Implantation',
            category: 'Surgical',
            price: 200000,
            duration: 120,
            description: 'Depends on the selected implant system.'
        },
        {
            id: 'root1',
            name: '1-Canal Root Canal Therapy',
            category: 'Therapeutic',
            price: 90000,
            duration: 90,
            description: 'Microscopic cleaning and filling.'
        },
        {
            id: 'root2',
            name: '2-Canal Root Canal Therapy',
            category: 'Therapeutic',
            price: 110000,
            duration: 120,
            description: 'Dual canal treatment under a microscope.'
        },
        {
            id: 'zirconium-natural',
            name: 'Zirconium Dioxide Crown',
            category: 'Restorative',
            price: 140000,
            duration: 90,
            description: 'Placement on a natural tooth.'
        },
        {
            id: 'zirconium-implant',
            name: 'Zirconium Dioxide Implant Crown',
            category: 'Restorative',
            price: 165000,
            duration: 90,
            description: 'Placement on a dental implant.'
        },
        {
            id: 'metal-natural',
            name: 'Metal-Ceramic Crown',
            category: 'Restorative',
            price: 85000,
            duration: 90,
            description: 'Placement on a natural tooth.'
        },
        {
            id: 'metal-implant',
            name: 'Metal-Ceramic Implant Crown',
            category: 'Restorative',
            price: 120000,
            duration: 90,
            description: 'Placement on a dental implant.'
        },
        {
            id: 'xray-lower',
            name: 'Lower Jaw X-ray',
            category: 'Diagnostics',
            price: 7500,
            duration: 15,
            description: 'Radiographic examination of the lower jaw.'
        },
        {
            id: 'xray-upper',
            name: 'Upper Jaw X-ray',
            category: 'Diagnostics',
            price: 7500,
            duration: 15,
            description: 'Radiographic examination of the upper jaw.'
        }
    ];

    // Load the previous service plan.
    let cart = storage.readStorage(STORAGE_KEY, []);

    if (!Array.isArray(cart)) {
        cart = [];
    }

    // Remove invalid or outdated cart entries.
    cart = cart.filter(function (item) {

        const service = services.find(
            entry => entry.id === item.id
        );

        return service &&
            Number.isInteger(item.quantity) &&
            item.quantity >= 1 &&
            item.quantity <= 10;
    });

    function saveCart() {
        storage.writeStorage(STORAGE_KEY, cart);
    }

    function formatPrice(price) {
        return storage.formatPrice(price);
    }

    // Build the interactive catalogue.
    const $section = $('<section>', {
        id: 'jquery-service-catalogue',
        class: 'bg-white border rounded-4 shadow-sm p-4 mt-4'
    });

    const $title = $('<h2>', {
        class: 'h3 text-primary',
        text: 'Interactive Service Catalogue'
    });

    const $intro = $('<p>', {
        class: 'text-muted',
        text: 'Search, filter and prepare a dental service plan.'
    });

    // Search field.
    const $searchLabel = $('<label>', {
        class: 'form-label fw-bold',
        for: 'jquery-service-search',
        text: 'Search Services'
    });

    const $search = $('<input>', {
        id: 'jquery-service-search',
        type: 'search',
        class: 'form-control',
        placeholder: 'Enter a name or keyword',
        autocomplete: 'off'
    });

    // Category field.
    const $categoryLabel = $('<label>', {
        class: 'form-label fw-bold mt-3',
        for: 'jquery-service-category',
        text: 'Category'
    });

    const $category = $('<select>', {
        id: 'jquery-service-category',
        class: 'form-select'
    });

    $('<option>', {
        value: 'all',
        text: 'All Categories'
    }).appendTo($category);

    [...new Set(services.map(service => service.category))]
        .sort()
        .forEach(function (category) {

            $('<option>', {
                value: category,
                text: category
            }).appendTo($category);
        });

    // Sorting does not include price.
    const $sortLabel = $('<label>', {
        class: 'form-label fw-bold mt-3',
        for: 'jquery-service-sort',
        text: 'Sort Results'
    });

    const $sort = $('<select>', {
        id: 'jquery-service-sort',
        class: 'form-select'
    });

    [
        ['name', 'Name: A-Z'],
        ['duration', 'Shortest Duration First']
    ].forEach(function (item) {

        $('<option>', {
            value: item[0],
            text: item[1]
        }).appendTo($sort);
    });

    const $reset = $('<button>', {
        type: 'button',
        class: 'btn btn-outline-secondary mt-3',
        text: 'Reset Filters'
    });

    const $count = $('<p>', {
        class: 'fw-bold mt-3',
        'aria-live': 'polite'
    });

    const $list = $('<div>', {
        id: 'jquery-service-list',
        class: 'row g-3'
    });

    const $empty = $('<p>', {
        class: 'alert alert-secondary',
        text: 'No services found. Try another keyword or category.'
    }).hide();

    // Persistent cart section.
    const $cartSection = $('<section>', {
        id: 'jquery-service-cart',
        class: 'border rounded-4 p-3 mt-5'
    });

    const $cartTitle = $('<h3>', {
        class: 'h4 text-primary',
        text: 'Your Service Plan'
    });

    const $cartCount = $('<p>', {
        class: 'small text-muted',
        'aria-live': 'polite'
    });

    const $cartEmpty = $('<p>', {
        class: 'text-muted',
        text: 'Your service plan is empty.'
    });

    const $cartList = $('<div>', {
        id: 'jquery-cart-list',
        class: 'list-group mb-3'
    });

    const $cartTotal = $('<p>', {
        class: 'h5 fw-bold'
    });

    const $clearCart = $('<button>', {
        type: 'button',
        class: 'btn btn-outline-danger me-2',
        text: 'Clear Plan'
    });

    const $continue = $('<button>', {
        type: 'button',
        class: 'btn btn-primary',
        text: 'Continue to Booking'
    });

    const $notice = $('<p>', {
        class: 'small text-muted mt-3 mb-0',
        text: 'The service plan is stored in this browser. It does not create an appointment or process a payment.'
    });

    $cartSection.append(
        $cartTitle,
        $cartCount,
        $cartEmpty,
        $cartList,
        $cartTotal,
        $clearCart,
        $continue,
        $notice
    );

    $section.append(
        $title,
        $intro,
        $searchLabel,
        $search,
        $categoryLabel,
        $category,
        $sortLabel,
        $sort,
        $reset,
        $count,
        $list,
        $empty,
        $cartSection
    );

    $main.append($section);

    // Reusable service card generator.
    function createServiceCard(service) {

        const $column = $('<div>', {
            class: 'col-12 col-md-6 col-lg-4'
        });

        const $card = $('<article>', {
            class: 'card service-card h-100 shadow-sm'
        }).attr('data-service-id', service.id);

        const $body = $('<div>', {
            class: 'card-body d-flex flex-column'
        });

        const $badge = $('<span>', {
            class: 'badge text-bg-light align-self-start mb-2',
            text: service.category
        });

        const $name = $('<h3>', {
            class: 'h5 text-primary',
            text: service.name
        });

        const $description = $('<p>', {
            class: 'card-text',
            text: service.description
        });

        const $duration = $('<p>', {
            class: 'small text-muted',
            text: 'Estimated duration: ' + service.duration + ' minutes'
        });

        const $price = $('<p>', {
            class: 'fw-bold mt-auto',
            text: formatPrice(service.price)
        });

        const $status = $('<p>', {
            class: 'small text-muted js-service-status',
            text: 'Not added to plan'
        });

        const $button = $('<button>', {
            type: 'button',
            class: 'btn btn-outline-primary js-service-action',
            text: 'Add to Plan'
        })
        .attr('data-action', 'add')
        .attr('data-service-id', service.id)
        .attr('aria-pressed', 'false');

        $body.append(
            $badge,
            $name,
            $description,
            $duration,
            $price,
            $status,
            $button
        );

        $card.append($body);
        $column.append($card);

        return $column;
    }

    // Search and category filtering.
    function filterServices() {

        const query = $search.val().trim().toLowerCase();
        const selectedCategory = $category.val();

        return services.filter(function (service) {

            const text = (
                service.name + ' ' +
                service.description + ' ' +
                service.category
            ).toLowerCase();

            const matchesSearch = text.includes(query);

            const matchesCategory =
                selectedCategory === 'all' ||
                selectedCategory === service.category;

            return matchesSearch && matchesCategory;
        });
    }

    // Sort by name or duration.
    function sortServices(items) {

        const result = [...items];

        if ($sort.val() === 'duration') {
            result.sort((a, b) => a.duration - b.duration);
        } else {
            result.sort((a, b) => a.name.localeCompare(b.name));
        }

        return result;
    }

    function renderServices() {

        const filtered = sortServices(filterServices());

        $list.empty();

        $.each(filtered, function (_, service) {
            $list.append(createServiceCard(service));
        });

        $count.text(filtered.length + ' services found');

        if (filtered.length === 0) {
            $empty.stop(true, true).fadeIn(200);
        } else {
            $empty.stop(true, true).fadeOut(200);
        }

        // Restore the added state after every re-render.
        $list.find('.js-service-action').each(function () {

            const $button = $(this);

            const exists = cart.some(
                item => item.id === $button.attr('data-service-id')
            );

            $button
                .text(exists ? 'Added to Plan' : 'Add to Plan')
                .attr('aria-pressed', String(exists));

            $button.closest('.service-card')
                .toggleClass('border-success', exists);

            $button.closest('.service-card')
                .find('.js-service-status')
                .text(exists ? 'Added to your plan' : 'Not added to plan');

        });
    }

    // Calculate the total price of the cart.
    function calculateTotal() {

        return cart.reduce(function (total, item) {

            const service = services.find(
                entry => entry.id === item.id
            );

            return total + (
                service ? service.price * item.quantity : 0
            );

        }, 0);
    }

    // Render every cart item and line subtotal.
    function renderCart() {

        $cartList.empty();

        const quantity = cart.reduce(
            (total, item) => total + item.quantity,
            0
        );

        $cartCount.text(quantity + ' items in your plan');

        $cartEmpty.toggleClass('d-none', cart.length > 0);

        $cartTotal.text(
            'Estimated total: ' + formatPrice(calculateTotal())
        );

        $continue.prop('disabled', cart.length === 0);
        $clearCart.prop('disabled', cart.length === 0);

        cart.forEach(function (item) {

            const service = services.find(
                entry => entry.id === item.id
            );

            if (!service) {
                return;
            }

            const $row = $('<div>', {
                class: 'list-group-item d-flex flex-wrap justify-content-between align-items-center gap-2'
            });

            const $details = $('<div>');

            $('<strong>', {
                text: service.name
            }).appendTo($details);

            $('<p>', {
                class: 'small text-muted mb-0',
                text: formatPrice(service.price) +
                    ' x ' + item.quantity +
                    ' = ' + formatPrice(service.price * item.quantity)
            }).appendTo($details);

            const isXray = service.id.startsWith('xray-');

            const $actions = $('<div>', {
                class: 'd-flex align-items-center gap-2'
            });

            const $minus = $('<button>', {
                type: 'button',
                class: 'btn btn-sm btn-outline-secondary js-service-action',
                text: '-'
            })
            .attr('data-action', 'decrease')
            .attr('data-service-id', item.id)
            .prop('disabled', item.quantity <= 1 || isXray);

            const $number = $('<span>', {
                text: item.quantity
            });

            const $plus = $('<button>', {
                type: 'button',
                class: 'btn btn-sm btn-outline-secondary js-service-action',
                text: '+'
            })
            .attr('data-action', 'increase')
            .attr('data-service-id', item.id)
            .prop('disabled', isXray);

            const $remove = $('<button>', {
                type: 'button',
                class: 'btn btn-sm btn-outline-danger js-service-action',
                text: 'Remove'
            })
            .attr('data-action', 'remove')
            .attr('data-service-id', item.id);

            $actions.append($minus, $number, $plus, $remove);

            $row.append($details, $actions);
            $cartList.append($row);
        });

        saveCart();
    }

    // Search event.
    $section.on('input', '#jquery-service-search', function () {
        renderServices();
    });

    // Filter and sorting events.
    $section.on('change', '#jquery-service-category, #jquery-service-sort', function () {
        renderServices();
    });

    // Reset filters.
    $reset.on('click', function () {

        const $button = $(this);

        $search.val('');
        $category.val('all');
        $sort.val('name');

        renderServices();

        $button.addClass('active');

        $button.removeClass('active');
    });

    // Delegated handler for dynamically created cards and cart controls.
    // Direct event binding would miss buttons generated after this handler.
    $section.on('click', 'button[data-action]', function (event) {

        event.preventDefault();

        const $button = $(this);

        const action = $button.attr('data-action');
        const serviceId = $button.attr('data-service-id');

        const service = services.find(
            item => item.id === serviceId
        );

        if (!service) {
            return;
        }

        const index = cart.findIndex(
            item => item.id === serviceId
        );

        if (action === 'add') {

            if (index === -1) {

                cart.push({
                    id: serviceId,
                    quantity: 1
                });

            } else if (!serviceId.startsWith('xray-')) {

                cart[index].quantity = Math.min(
                    10,
                    cart[index].quantity + 1
                );
            }

            // Chain: find the card, mark it selected, update its status
            // and change the button state.
            $button
                .closest('.service-card')
                .addClass('border-success')
                .find('.js-service-status')
                .text('Added to your plan')
                .end()
                .find('.js-service-action')
                .text('Added to Plan')
                .attr('aria-pressed', 'true');

        } else if (action === 'increase' && index !== -1) {

            if (!serviceId.startsWith('xray-')) {
                cart[index].quantity = Math.min(
                    10,
                    cart[index].quantity + 1
                );
            }

        } else if (action === 'decrease' && index !== -1) {

            cart[index].quantity = Math.max(
                1,
                cart[index].quantity - 1
            );

        } else if (action === 'remove' && index !== -1) {

            cart.splice(index, 1);
        }

        saveCart();
        renderCart();
        renderServices();
    });

    // Clear the cart.
    $clearCart.on('click', function () {

        cart.length = 0;

        saveCart();
        renderCart();
        renderServices();
    });

    // Continue to the appointment form.
    $continue.on('click', function () {

        if (cart.length === 0) {
            return;
        }

        saveCart();

        window.location.href = 'contacts.html#booking-form';
    });

    // Initial state.
    renderServices();
    renderCart();

});
