document.addEventListener("DOMContentLoaded", function () {

    /* =========================================
       DECENCY GADGETS - WEBSITE JAVASCRIPT
       ========================================= */

    const WHATSAPP_NUMBER = "2349168891385";
    const UNIT_PRICE = 190000;

    /* -----------------------------------------
       ELEMENTS
       ----------------------------------------- */

    const quantitySelect = document.getElementById("quantitySelect");
    const summaryQty = document.getElementById("summaryQty");
    const summaryTotal = document.getElementById("summaryTotal");
    const discountMessage = document.getElementById("discountMessage");
    const displayPrice = document.getElementById("displayPrice");

    const orderForm = document.getElementById("orderForm");
    const formMessage = document.getElementById("formMessage");

    const mainProductImage = document.getElementById("mainProductImage");

    const menuBtn = document.getElementById("menuBtn");
    const mobileMenu = document.getElementById("mobileMenu");

    const yearElement = document.getElementById("year");


    /* -----------------------------------------
       CURRENT YEAR
       ----------------------------------------- */

    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }


    /* -----------------------------------------
       FORMAT NAIRA
       ----------------------------------------- */

    function formatNaira(amount) {

        return "₦" + Number(amount).toLocaleString("en-NG");

    }


    /* -----------------------------------------
       CALCULATE PRODUCT PRICE
       
       1 machine = ₦190,000
       2 machines = ₦370,000
       3 machines = ₦550,000
       
       Every additional machine saves ₦10,000.
       ----------------------------------------- */

    function calculatePrice(quantity) {

        quantity = Number(quantity);

        if (quantity <= 1) {
            return UNIT_PRICE;
        }

        const discount = (quantity - 1) * 10000;

        return (quantity * UNIT_PRICE) - discount;

    }


    /* -----------------------------------------
       UPDATE PRICE DISPLAY
       ----------------------------------------- */

    function updatePrice(quantity) {

        quantity = Number(quantity);

        const total = calculatePrice(quantity);

        const discount = Math.max(0, (quantity - 1) * 10000);


        /* Quantity */

        if (summaryQty) {

            summaryQty.textContent =
                quantity +
                " machine" +
                (quantity > 1 ? "s" : "");

        }


        /* Total */

        if (summaryTotal) {

            summaryTotal.textContent =
                formatNaira(total);

        }


        /* Main product price */

        if (displayPrice) {

            displayPrice.textContent =
                formatNaira(total);

        }


        /* Discount message */

        if (discountMessage) {

            if (discount > 0) {

                discountMessage.textContent =
                    "You save " +
                    formatNaira(discount) +
                    " on " +
                    quantity +
                    " units";

            } else {

                discountMessage.textContent =
                    "Standard price";

            }

        }


        /* Highlight selected package */

        document
            .querySelectorAll(".bundle-card")
            .forEach(function (card) {

                const cardQuantity =
                    Number(card.dataset.qty);

                if (cardQuantity === quantity) {

                    card.classList.add("selected");

                } else {

                    card.classList.remove("selected");

                }

            });

    }


    /* -----------------------------------------
       QUANTITY SELECT
       ----------------------------------------- */

    if (quantitySelect) {

        quantitySelect.addEventListener(
            "change",
            function () {

                updatePrice(
                    this.value
                );

            }
        );

    }


    /* -----------------------------------------
       PACKAGE / BUNDLE BUTTONS
       ----------------------------------------- */

    const bundleCards =
        document.querySelectorAll(".bundle-card");


    bundleCards.forEach(function (card) {

        card.addEventListener(
            "click",
            function () {

                const quantity =
                    this.dataset.qty;


                /* Change quantity */

                if (quantitySelect) {

                    quantitySelect.value =
                        quantity;

                }


                /* Update price */

                updatePrice(quantity);


                /* Scroll to order form */

                const orderSection =
                    document.getElementById("order");

                if (orderSection) {

                    orderSection.scrollIntoView({
                        behavior: "smooth",
                        block: "start"
                    });

                }

            }
        );

    });


    /* -----------------------------------------
       PRODUCT IMAGE GALLERY
       ----------------------------------------- */

    const thumbnails =
        document.querySelectorAll(".thumb");


    thumbnails.forEach(function (thumbnail) {

        thumbnail.addEventListener(
            "click",
            function () {

                const image =
                    this.dataset.image;


                if (mainProductImage && image) {

                    mainProductImage.src =
                        image;

                }


                /* Remove active state */

                thumbnails.forEach(function (item) {

                    item.classList.remove(
                        "active"
                    );

                });


                /* Add active state */

                this.classList.add("active");

            }
        );

    });


    /* -----------------------------------------
       MOBILE MENU
       ----------------------------------------- */

    if (menuBtn && mobileMenu) {

        menuBtn.addEventListener(
            "click",
            function () {

                mobileMenu.classList.toggle(
                    "open"
                );


                if (
                    mobileMenu.classList.contains(
                        "open"
                    )
                ) {

                    menuBtn.textContent = "×";

                } else {

                    menuBtn.textContent = "☰";

                }

            }
        );


        /* Close menu after clicking a link */

        const mobileLinks =
            mobileMenu.querySelectorAll("a");


        mobileLinks.forEach(function (link) {

            link.addEventListener(
                "click",
                function () {

                    mobileMenu.classList.remove(
                        "open"
                    );

                    menuBtn.textContent = "☰";

                }
            );

        });

    }


  /* -----------------------------------------
   ORDER FORM
   Send order to backend
----------------------------------------- */

if (orderForm) {

    orderForm.addEventListener("submit", async function (event) {

        event.preventDefault();

        /* Browser validation */
        if (!orderForm.checkValidity()) {

            orderForm.reportValidity();

            return;

        }

        /* Prevent double submission */
        const submitButton =
            orderForm.querySelector(".submit-btn");

        if (submitButton) {

            submitButton.disabled = true;

            submitButton.innerHTML =
                "Submitting Order...";

        }

        /* Collect form data */
        const formData =
            new FormData(orderForm);

        const fullName =
            String(formData.get("fullName") || "").trim();

        const phone =
            String(formData.get("phone") || "").trim();

        const whatsapp =
            String(formData.get("whatsapp") || "").trim();

        const email =
            String(formData.get("email") || "").trim();

        const address =
            String(formData.get("address") || "").trim();

        const state =
            String(formData.get("state") || "").trim();

        const quantity =
            Number(formData.get("quantity"));

        const specialDemand =
            String(
                formData.get("specialDemand") || ""
            ).trim();

        /* Calculate order */
        const total =
            calculatePrice(quantity);

        const discount =
            Math.max(
                0,
                (quantity - 1) * 10000
            );

        /* -----------------------------------------
           ORDER DATA
        ----------------------------------------- */

        const orderData = {

            fullName: fullName,

            phone: phone,

            whatsapp:
                whatsapp || null,

            email:
                email || null,

            address: address,

            state: state,

            product:
                "Full Body Massage Machine",

            quantity: quantity,

            total: total,

            discount: discount,

            specialDemand:
                specialDemand || null

        };

        try {

            /* -----------------------------------------
               SEND ORDER TO BACKEND
            ----------------------------------------- */

            const response = await fetch(
                "/api/orders",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify(orderData)
                }
            );

            const result =
                await response.json();

            /* -----------------------------------------
               SUCCESS
            ----------------------------------------- */

            if (response.ok && result.success) {

                if (formMessage) {

                    formMessage.style.display =
                        "block";

                    formMessage.textContent =
                        "✓ Order received successfully! We will contact you shortly to confirm your order.";

                }

                /* Reset form */

                orderForm.reset();

                /* Reset quantity */

                if (quantitySelect) {

                    quantitySelect.value = "1";

                    updatePrice("1");

                }

            }

            /* -----------------------------------------
               BACKEND ERROR
            ----------------------------------------- */

            else {

                throw new Error(
                    result.message ||
                    "Unable to submit order."
                );

            }

        }

        catch (error) {

            console.error(
                "Order submission error:",
                error
            );

            if (formMessage) {

                formMessage.style.display =
                    "block";

                formMessage.style.background =
                    "#fff0f0";

                formMessage.style.color =
                    "#b91820";

                formMessage.textContent =
                    "We could not submit your order. Please try again or contact us on WhatsApp.";

            }

        }

        finally {

            /* Restore button */

            if (submitButton) {

                submitButton.disabled =
                    false;

                submitButton.innerHTML =
                    'Submit Order <span>→</span>';

            }

        }

    });

}


    /* -----------------------------------------
       INITIAL PRICE
       ----------------------------------------- */

    if (quantitySelect) {

        updatePrice(
            quantitySelect.value
        );

    }


    /* -----------------------------------------
       SMOOTH SCROLL FOR ANCHOR LINKS
       ----------------------------------------- */

    document
        .querySelectorAll('a[href^="#"]')
        .forEach(function (link) {

            link.addEventListener(
                "click",
                function (event) {

                    const targetID =
                        this.getAttribute("href");


                    if (
                        targetID === "#" ||
                        targetID === ""
                    ) {

                        return;

                    }


                    const target =
                        document.querySelector(
                            targetID
                        );


                    if (target) {

                        event.preventDefault();


                        target.scrollIntoView({
                            behavior: "smooth",
                            block: "start"
                        });

                    }

                }
            );

        });


});