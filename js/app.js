// ============================================
// CSE LEARNHUB - MAIN JAVASCRIPT
// ============================================


// Scroll to Categories
function scrollToCategories() {

    const section = document.getElementById("categories");

    if (section) {

        section.scrollIntoView({
            behavior: "smooth"
        });

    }

}


// Show About information
function showAbout() {

    const about = document.getElementById("about");

    if (about) {

        about.scrollIntoView({
            behavior: "smooth"
        });

    }

}


// Open a category
function openCategory(category) {

    alert(
        category +
        " courses will be available here."
    );

}


// Open a course
function openCourse(course) {

    alert(
        "Opening " +
        course +
        " course..."
    );

}


// Login button
const loginButton =
    document.querySelector(".login-btn");

if (loginButton) {

    loginButton.addEventListener(
        "click",
        function () {

            alert(
                "Login system will be added soon!"
            );

        }
    );

}


// Continue Learning button
const continueButton =
    document.querySelector(".continue-btn");

if (continueButton) {

    continueButton.addEventListener(
        "click",
        function () {

            alert(
                "Your learning dashboard will open here!"
            );

        }
    );

}
