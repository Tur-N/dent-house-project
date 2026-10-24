'use strict';

(() => {
    const clinicHours = '10:00-21:00';

    // Medical team data
    const doctors = [
        {
            id: 'mukhamediyarov-kanat',
            name: 'Мухамедьяров Канат Магауиянович',
            specialty: 'Implantologist and prosthodontist',
            experienceYears: 25,
            clinicHours,
            note: 'Individual appointment times must be confirmed with the clinic.'
        },
        {
            id: 'tauershe-baghzhan',
            name: 'Тауерше Багжан Ордабаевич',
            specialty: 'Oral surgeon and implantologist',
            experienceYears: 7,
            clinicHours,
            note: 'Individual appointment times must be confirmed with the clinic.'
        },
        {
            id: 'kenzhe-sarzhan',
            name: 'Кенже Саржан Байжанович',
            specialty: 'General dentist, surgeon, implantologist and prosthodontist',
            experienceYears: 9,
            clinicHours,
            note: 'Individual appointment times must be confirmed with the clinic.'
        },
        {
            id: 'sagimbaeva-zukhra',
            name: 'Сагимбаева Зухра Бериковна',
            specialty: 'Microscopic dentistry and therapeutic dentistry',
            experienceYears: 10,
            clinicHours,
            note: 'Individual appointment times must be confirmed with the clinic.'
        },
        {
            id: 'shalabay-zhamilya',
            name: 'Шалабай Жамиля Кайратовна',
            specialty: 'Microscopic dentistry and therapeutic dentistry',
            experienceYears: 6,
            clinicHours,
            note: 'Individual appointment times must be confirmed with the clinic.'
        },
        {
            id: 'tukesheva-svetlana',
            name: 'Тукешева Светлана Маратовна',
            specialty: 'Therapeutic dentist and periodontist',
            experienceYears: 15,
            clinicHours,
            note: 'Individual appointment times must be confirmed with the clinic.'
        },
        {
            id: 'abzhapbar-symbat',
            name: 'Абжапбар Сымбат Багдатовна',
            specialty: 'Pediatric dentist and microscopic dentistry',
            experienceYears: 10,
            clinicHours,
            note: 'Individual appointment times must be confirmed with the clinic.'
        },
        {
            id: 'otarbaeva-alma',
            name: 'Отарбаева Алма Аманжоловна',
            specialty: 'Orthodontist',
            experienceYears: 10,
            clinicHours,
            note: 'Individual appointment times must be confirmed with the clinic.'
        }
    ];

    // Service catalogue
    const services = [
        {
            id: 'xray-lower',
            name: 'Lower Jaw X-ray',
            category: 'Diagnostics',
            price: 7500,
            durationMinutes: 15,
            description: 'Radiographic examination of the lower jaw.'
        },
        {
            id: 'xray-upper',
            name: 'Upper Jaw X-ray',
            category: 'Diagnostics',
            price: 7500,
            durationMinutes: 15,
            description: 'Radiographic examination of the upper jaw.'
        },
        {
            id: 'caries-treatment',
            name: 'Caries Treatment',
            category: 'Therapeutic',
            price: 24000,
            durationMinutes: 60,
            description: 'Starting price. The final price depends on the diagnosis and cavity depth.'
        },
        {
            id: 'tooth-extraction',
            name: 'Tooth Extraction',
            category: 'Surgical',
            price: 20000,
            durationMinutes: 45,
            description: 'Starting price. Complexity and root access affect the final price.'
        },
        {
            id: 'dental-implantation',
            name: 'Dental Implantation',
            category: 'Surgical',
            price: 200000,
            durationMinutes: 120,
            description: 'Starting price. The final price depends on the selected implant system.'
        },
        {
            id: 'root-canal-1',
            name: '1-Canal Root Canal Therapy',
            category: 'Therapeutic',
            price: 90000,
            durationMinutes: 90,
            description: 'Microscopic cleaning and filling of a single canal.'
        },
        {
            id: 'root-canal-2',
            name: '2-Canal Root Canal Therapy',
            category: 'Therapeutic',
            price: 110000,
            durationMinutes: 120,
            description: 'Dual-canal treatment under a microscope.'
        },
        {
            id: 'zirconia-natural-crown',
            name: 'Zirconium Dioxide Crown for a Natural Tooth',
            category: 'Restorative',
            price: 140000,
            durationMinutes: 90,
            description: 'Listed price per unit for a natural tooth.'
        },
        {
            id: 'zirconia-implant-crown',
            name: 'Zirconium Dioxide Crown for an Implant',
            category: 'Restorative',
            price: 165000,
            durationMinutes: 90,
            description: 'Listed price per unit for a dental implant.'
        },
        {
            id: 'metal-ceramic-natural-crown',
            name: 'Metal-Ceramic Crown for a Natural Tooth',
            category: 'Restorative',
            price: 85000,
            durationMinutes: 90,
            description: 'Listed price per unit for a natural tooth.'
        },
        {
            id: 'metal-ceramic-implant-crown',
            name: 'Metal-Ceramic Crown for an Implant',
            category: 'Restorative',
            price: 120000,
            durationMinutes: 90,
            description: 'Listed price per unit for a dental implant.'
        }
    ];

    // Create a DOM element without inserting HTML strings.
    function createNode(tagName, className = '', text = '') {
        const node = document.createElement(tagName);

        if (className) {
            node.className = className;
        }

        if (text !== '') {
            node.textContent = String(text);
        }

        return node;
    }

    // Normalize text for case-insensitive search.
    function normalizeText(value) {
        return String(value ?? '').trim().toLocaleLowerCase();
    }

    // Format a price in Kazakhstani tenge.
    function formatKzt(value) {
        return `${new Intl.NumberFormat('en-US', {
            maximumFractionDigits: 0
        }).format(value)} KZT`;
    }

    // Find a service by its unique identifier.
    function findServiceById(serviceId) {
        return services.find(
            (service) => service.id === serviceId
        ) ?? null;
    }

    // Calculate a total from service IDs and quantities.
    function calculateTotal(items) {
        return items.reduce((total, item) => {
            const service = findServiceById(item.id);
            const quantity = Number(item.quantity) || 1;

            return total + (
                service ? service.price * quantity : 0
            );
        }, 0);
    }

    // Share project data and reusable functions with other scripts.
    window.DentHouseData = {
        clinicHours,
        doctors,
        services
    };

    window.DentHouseUtils = {
        createNode,
        normalizeText,
        formatKzt,
        findServiceById,
        calculateTotal
    };

    // Add a shared appointment link to the site header.
    function addQuickBookingLink() {
        const header = document.querySelector(
            '.main-header .container-fluid, .main-header .container'
        );

        if (
            !header ||
            document.querySelector('.js-quick-booking-wrap')
        ) {
            return;
        }

        const wrapper = createNode(
            'div',
            'js-quick-booking-wrap text-center mt-3'
        );

        const link = createNode(
            'a',
            'btn btn-warning fw-bold px-4',
            'Book an Appointment'
        );

        link.href = 'contacts.html#booking-form';
        link.setAttribute(
            'aria-label',
            'Open the appointment form'
        );

        wrapper.append(link);
        header.append(wrapper);
    }

    addQuickBookingLink();
})();
(() => {
    "use strict";

    const desktopNavigation = document.querySelector(
        ".desktop-navigation"
    );

    if (desktopNavigation) {
        desktopNavigation.classList.add(
            "w-100",
            "mx-auto",
            "justify-content-center"
        );
    }
})();