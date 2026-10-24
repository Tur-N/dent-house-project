'use strict';

(() => {
    const data = window.DentHouseData;
    const utils = window.DentHouseUtils;
    const main = document.querySelector('main');

    const existingCards = [
        ...document.querySelectorAll('.doctor-card')
    ];

    const looksLikeTeamPage = /team|medical/i.test(
        `${window.location.pathname} ${document.title}`
    );

    if (
        !data ||
        !utils ||
        !main ||
        (!existingCards.length && !looksLikeTeamPage)
    ) {
        return;
    }

    const { doctors } = data;
    const { createNode, normalizeText } = utils;

    // Hide the static doctor grid when a dynamic replacement is available.
    const existingGrid = existingCards[0]?.closest('.row') ?? null;

    if (existingGrid) {
        existingGrid.classList.add('is-hidden');
    } else {
        existingCards.forEach((card) => {
            card.classList.add('is-hidden');
        });
    }

    const section = createNode(
        'section',
        'bg-white border rounded-4 shadow-sm p-4 mb-4'
    );

    section.id = 'js-doctor-finder';

    section.setAttribute(
        'aria-labelledby',
        'js-doctor-finder-title'
    );

    const title = createNode(
        'h2',
        'h3 text-primary',
        'Find a Medical Specialist'
    );

    title.id = 'js-doctor-finder-title';

    const intro = createNode(
        'p',
        'text-muted',
        'Search all eight doctors by name or speciality. Clinic opening hours are 10:00-21:00. Individual doctor availability must be confirmed with the clinic.'
    );

    // Search input
    const controls = createNode('div', 'row g-3 mb-3');

    const searchWrap = createNode(
        'div',
        'col-12 col-md-6'
    );

    const searchLabel = createNode(
        'label',
        'form-label fw-semibold',
        'Search by name or speciality'
    );

    searchLabel.htmlFor = 'doctor-search';

    const search = createNode('input', 'form-control');

    search.type = 'search';
    search.id = 'doctor-search';
    search.placeholder = 'Type a doctor name or speciality';
    search.autocomplete = 'off';

    searchWrap.append(searchLabel, search);

    // Speciality filter
    const specialtyWrap = createNode(
        'div',
        'col-12 col-md-4'
    );

    const specialtyLabel = createNode(
        'label',
        'form-label fw-semibold',
        'Speciality'
    );

    specialtyLabel.htmlFor = 'doctor-speciality';

    const specialty = createNode('select', 'form-select');
    specialty.id = 'doctor-speciality';

    const allOption = createNode(
        'option',
        '',
        'All specialities'
    );

    allOption.value = 'all';
    specialty.append(allOption);

    const specialties = [
        ...new Set(
            doctors.map((doctor) => doctor.specialty)
        )
    ].sort((a, b) => a.localeCompare(b));

    specialties.forEach((item) => {
        const option = createNode('option', '', item);
        option.value = item;
        specialty.append(option);
    });

    specialtyWrap.append(specialtyLabel, specialty);

    // Reset button
    const resetWrap = createNode(
        'div',
        'col-12 col-md-2 d-flex align-items-end'
    );

    const reset = createNode(
        'button',
        'btn btn-outline-secondary w-100',
        'Reset'
    );

    reset.type = 'button';
    resetWrap.append(reset);

    controls.append(searchWrap, specialtyWrap, resetWrap);

    const count = createNode('p', 'fw-semibold mb-3');
    count.setAttribute('aria-live', 'polite');

    const grid = createNode('div', 'row g-3');

    const empty = createNode(
        'p',
        'alert alert-secondary is-hidden',
        'No doctors match this search. Try another keyword or reset the filters.'
    );

    empty.setAttribute('role', 'status');
    empty.setAttribute('aria-live', 'polite');

    section.append(
        title,
        intro,
        controls,
        count,
        grid,
        empty
    );

    if (existingGrid && existingGrid.parentElement) {
        existingGrid.parentElement.insertBefore(
            section,
            existingGrid
        );
    } else {
        main.insertBefore(section, main.firstChild);
    }

    // Search names, specialities and experience values.
    function filterDoctors(items, query, selectedSpecialty) {
        const normalizedQuery = normalizeText(query);

        return items.filter((doctor) => {
            const searchableText = [
                doctor.name,
                doctor.specialty,
                doctor.experienceYears
            ].join(' ');

            const matchesQuery =
                normalizedQuery === '' ||
                normalizeText(searchableText).includes(
                    normalizedQuery
                );

            const matchesSpecialty =
                selectedSpecialty === 'all' ||
                doctor.specialty === selectedSpecialty;

            return matchesQuery && matchesSpecialty;
        });
    }

    // Generate a doctor card from one doctor object.
    function createDoctorCard(doctor) {
        const column = createNode(
            'div',
            'col-12 col-md-6 col-lg-4'
        );

        const card = createNode(
            'article',
            'card h-100 shadow-sm doctor-card'
        );

        const body = createNode(
            'div',
            'card-body d-flex flex-column'
        );

        const name = createNode(
            'h3',
            'h5 card-title text-primary',
            doctor.name
        );

        const role = createNode(
            'p',
            'mb-2',
            doctor.specialty
        );

        const experience = createNode(
            'p',
            'mb-2',
            `Experience: more than ${doctor.experienceYears} years`
        );

        const hours = createNode(
            'p',
            'small text-muted',
            `Clinic opening hours: ${doctor.clinicHours}.`
        );

        const note = createNode(
            'p',
            'small text-muted mt-auto',
            doctor.note
        );

        const link = createNode(
            'a',
            'btn btn-outline-primary align-self-start',
            'Ask About Availability'
        );

        link.href = 'contacts.html#booking-form';

        body.append(
            name,
            role,
            experience,
            hours,
            note,
            link
        );

        card.append(body);
        column.append(card);

        return column;
    }

    // Update the visible cards, result count and empty state.
    function renderDoctors(items) {
        grid.replaceChildren();

        items.forEach((doctor) => {
            grid.append(createDoctorCard(doctor));
        });

        count.textContent =
            `${items.length} specialist${items.length === 1 ? '' : 's'} found`;

        empty.classList.toggle(
            'is-hidden',
            items.length > 0
        );
    }

    function updateResults() {
        const filteredDoctors = filterDoctors(
            doctors,
            search.value,
            specialty.value
        );

        renderDoctors(filteredDoctors);
    }

    // Live search and speciality filtering.
    search.addEventListener('input', updateResults);
    specialty.addEventListener('change', updateResults);

    // Restore the original list.
    reset.addEventListener('click', () => {
        search.value = '';
        specialty.value = 'all';

        updateResults();
        search.focus();
    });

    // Render all eight doctors when the page first opens.
    renderDoctors(doctors);
})();