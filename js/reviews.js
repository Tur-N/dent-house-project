'use strict';

(() => {
    const { createNode } = window.DentHouseUtils ?? {};
    const main = document.querySelector('main');

    const isHomePage = Boolean(
        document.querySelector('.hero-banner, #home-title')
    );

    if (
        !createNode ||
        !main ||
        !isHomePage ||
        document.querySelector('#js-reviews')
    ) {
        return;
    }

    // This sample is for demonstration only.
    const reviews = [
        {
            id: 'demo-comment',
            name: 'Sample visitor (demo)',
            text: 'This is an example comment used to demonstrate the comment feature. It is not a real patient review.',
            date: 'Demo sample - not a real submission'
        }
    ];

    const section = createNode(
        'section',
        'bg-white border rounded-4 shadow-sm p-4 my-4'
    );

    section.id = 'js-reviews';

    section.setAttribute(
        'aria-labelledby',
        'js-reviews-title'
    );

    const title = createNode(
        'h2',
        'h3 text-primary',
        'Patient Comments'
    );

    title.id = 'js-reviews-title';

    const intro = createNode(
        'p',
        'text-muted',
        'Leave a comment about your website visit or service experience. Comments remain in this page session and are not sent to a server. No star rating is collected.'
    );

    const form = createNode('form', 'review-form');
    form.noValidate = true;

    // Name field
    const nameWrap = createNode('div', 'mb-3');

    const nameLabel = createNode(
        'label',
        'form-label fw-semibold',
        'Your name'
    );

    nameLabel.htmlFor = 'review-name';

    const nameInput = createNode('input', 'form-control');

    nameInput.type = 'text';
    nameInput.id = 'review-name';
    nameInput.name = 'review-name';
    nameInput.maxLength = 60;
    nameInput.autocomplete = 'name';

    const nameError = createNode(
        'div',
        'invalid-feedback is-hidden'
    );

    nameError.id = 'review-name-error';
    nameError.setAttribute('aria-live', 'polite');

    nameInput.setAttribute(
        'aria-describedby',
        nameError.id
    );

    nameWrap.append(nameLabel, nameInput, nameError);

    // Comment field
    const textWrap = createNode('div', 'mb-3');

    const textLabel = createNode(
        'label',
        'form-label fw-semibold',
        'Comment'
    );

    textLabel.htmlFor = 'review-text';

    const commentInput = createNode('textarea', 'form-control');

    commentInput.id = 'review-text';
    commentInput.name = 'review-text';
    commentInput.rows = 4;
    commentInput.minLength = 10;
    commentInput.maxLength = 500;
    commentInput.placeholder = 'Write 10 to 500 characters';

    const counter = createNode(
        'p',
        'small text-muted mt-1 mb-1',
        '0 / 500 characters'
    );

    counter.id = 'review-counter';
    counter.setAttribute('aria-live', 'polite');

    const commentError = createNode(
        'div',
        'invalid-feedback is-hidden'
    );

    commentError.id = 'review-text-error';
    commentError.setAttribute('aria-live', 'polite');

    commentInput.setAttribute(
        'aria-describedby',
        `${counter.id} ${commentError.id}`
    );

    textWrap.append(
        textLabel,
        commentInput,
        counter,
        commentError
    );

    // Form buttons
    const submitButton = createNode(
        'button',
        'btn btn-primary me-2',
        'Submit Comment'
    );

    submitButton.type = 'submit';

    const resetButton = createNode(
        'button',
        'btn btn-outline-secondary',
        'Clear Form'
    );

    resetButton.type = 'reset';

    const formFeedback = createNode(
        'p',
        'mt-3 is-hidden'
    );

    formFeedback.setAttribute('role', 'status');
    formFeedback.setAttribute('aria-live', 'polite');

    form.append(
        nameWrap,
        textWrap,
        submitButton,
        resetButton,
        formFeedback
    );

    const listHeading = createNode(
        'h3',
        'h4 text-primary mt-4',
        'Comments'
    );

    const reviewCount = createNode(
        'p',
        'small text-muted'
    );

    reviewCount.setAttribute('aria-live', 'polite');

    const reviewList = createNode('div', 'row g-3');

    const emptyState = createNode(
        'p',
        'alert alert-secondary is-hidden',
        'There are no comments yet. Be the first to leave a comment.'
    );

    emptyState.setAttribute('role', 'status');

    section.append(
        title,
        intro,
        form,
        listHeading,
        reviewCount,
        reviewList,
        emptyState
    );

    main.append(section);

    // Format the automatic submission timestamp.
    function formatDateTime(date) {
        return new Intl.DateTimeFormat('en-GB', {
            dateStyle: 'medium',
            timeStyle: 'short'
        }).format(date);
    }

    // One rendering function is used for all comments.
    function createReviewCard(review) {
        const column = createNode(
            'div',
            'col-12 col-md-6'
        );

        const card = createNode(
            'article',
            'card h-100 shadow-sm'
        );

        const body = createNode('div', 'card-body');

        const name = createNode(
            'h4',
            'h5 card-title text-primary',
            review.name
        );

        const text = createNode(
            'p',
            'card-text',
            review.text
        );

        const date = createNode(
            'p',
            'small text-muted mb-0',
            review.date
        );

        body.append(name, text, date);
        card.append(body);
        column.append(card);

        return column;
    }

    // Render all cards and the empty state.
    function renderReviews(items) {
        reviewList.replaceChildren();

        items.forEach((review) => {
            reviewList.append(createReviewCard(review));
        });

        reviewCount.textContent =
            `${items.length} comment${items.length === 1 ? '' : 's'}`;

        emptyState.classList.toggle(
            'is-hidden',
            items.length > 0
        );
    }

    // Show a field-specific error.
    function setFieldError(input, errorNode, message) {
        errorNode.textContent = message;
        errorNode.classList.remove('is-hidden');

        input.classList.add('is-invalid');
        input.setAttribute('aria-invalid', 'true');
    }

    // Clear an existing field error.
    function clearFieldError(input, errorNode) {
        errorNode.textContent = '';
        errorNode.classList.add('is-hidden');

        input.classList.remove('is-invalid');
        input.removeAttribute('aria-invalid');
    }

    // Update the live character counter.
    function updateCounter() {
        counter.textContent =
            `${commentInput.value.length} / 500 characters`;
    }

    commentInput.addEventListener('input', () => {
        updateCounter();
        clearFieldError(commentInput, commentError);
    });

    nameInput.addEventListener('input', () => {
        clearFieldError(nameInput, nameError);
    });

    // Validate and add a new comment.
    form.addEventListener('submit', (event) => {
        event.preventDefault();

        clearFieldError(nameInput, nameError);
        clearFieldError(commentInput, commentError);

        formFeedback.textContent = '';
        formFeedback.classList.add('is-hidden');

        const nameValue = nameInput.value.trim();
        const commentValue = commentInput.value.trim();

        let valid = true;
        let firstInvalid = null;

        if (nameValue.length < 2 || nameValue.length > 60) {
            setFieldError(
                nameInput,
                nameError,
                'Enter a name containing 2 to 60 characters.'
            );

            firstInvalid = nameInput;
            valid = false;
        }

        if (
            commentValue.length < 10 ||
            commentValue.length > 500
        ) {
            setFieldError(
                commentInput,
                commentError,
                'The comment must contain 10 to 500 characters.'
            );

            firstInvalid = firstInvalid || commentInput;
            valid = false;
        }

        if (!valid) {
            firstInvalid.focus();
            return;
        }

        const newReview = {
            id: `comment-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
            name: nameValue,
            text: commentValue,
            date: formatDateTime(new Date())
        };

        reviews.unshift(newReview);

        renderReviews(reviews);

        formFeedback.textContent =
            'Your demo comment has been added to this page. It has not been sent to a server.';

        formFeedback.classList.remove('is-hidden');

        form.reset();
        updateCounter();
    });

    // Clear errors and reset the character counter.
    form.addEventListener('reset', () => {
        window.setTimeout(() => {
            clearFieldError(nameInput, nameError);
            clearFieldError(commentInput, commentError);

            formFeedback.textContent = '';
            formFeedback.classList.add('is-hidden');

            updateCounter();
        }, 0);
    });

    renderReviews(reviews);
    updateCounter();
})();