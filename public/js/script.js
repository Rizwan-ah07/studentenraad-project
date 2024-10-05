// Random Username Generator

const adjectives = [
    "Fluffy", "Brave", "Mighty", "Clever", "Happy", "Quiet", "Bright", "Bold", "Gentle", "Swift",
    "Fierce", "Calm", "Loyal", "Vivid", "Nimble", "Curious", "Proud", "Silent", "Eager", "Wise",
    "Playful", "Gracious", "Daring", "Radiant", "Steady", "Fearless", "Vibrant", "Majestic", "Luminous", "Sturdy",
    "Breezy", "Sleek", "Agile", "Courageous", "Spirited", "Charming", "Humble", "Dazzling", "Elegant", "Patient",
    "Stubborn", "Cheerful", "Witty", "Serene", "Gritty", "Crafty", "Savvy", "Dynamic", "Tenacious", "Whimsical",
    "Persistent", "Mysterious", "Resilient", "Chilly", "Lively", "Faithful", "Epic", "Dreamy", "Energetic", "Adventurous",
    "Passionate", "Kind", "Generous", "Sincere", "Optimistic", "Pensive", "Reliable", "Resourceful", "Jolly", "Diligent",
    "Ambitious", "Cunning", "Thoughtful", "Enchanting", "Vigilant", "Graceful", "Gleaming", "Brilliant", "Stealthy", "Tough",
    "Bold", "Artful", "Polished", "Imaginative", "Radiant", "Robust", "Compassionate", "Noble", "Vigorous", "Glorious",
    "Quiet", "Affectionate", "Prudent", "Jovial", "Astute", "Ingenious", "Excitable", "Epic", "Friendly", "Exuberant"
];

const nouns = [
    "Unicorn", "Tiger", "Phoenix", "Dragon", "Panther", "Falcon", "Lion", "Wolf", "Eagle", "Shark",
    "Bear", "Elephant", "Dolphin", "Hawk", "Cheetah", "Raven", "Whale", "Butterfly", "Swan", "Horse",
    "Leopard", "Jaguar", "Cobra", "Orca", "Rhino", "Gorilla", "Gazelle", "Otter", "Hummingbird", "Hedgehog",
    "Penguin", "Koala", "Owl", "Crocodile", "Fox", "Giraffe", "Penguin", "Zebra", "Octopus", "Armadillo",
    "Sloth", "Puma", "Walrus", "Peacock", "Raccoon", "Lynx", "Squirrel", "Beetle", "Frog", "Bison",
    "Parrot", "Antelope", "Wolf", "Chameleon", "Caterpillar", "Salmon", "Porcupine", "Lemur", "Bumblebee", "Hawk",
    "Moose", "Alligator", "Hippo", "Badger", "Toucan", "Camel", "Jellyfish", "Tortoise", "Mongoose", "Stingray",
    "Kangaroo", "Caribou", "Bat", "Woodpecker", "Otter", "Crane", "Viper", "Flamingo", "Platypus", "Skunk",
    "Moth", "Rattlesnake", "Gecko", "Hyena", "Wombat", "Penguin", "Iguana", "Echidna", "Narwhal", "Seal",
    "Sea Lion", "Lobster", "Manatee", "Polar Bear", "Reindeer", "Starling", "Tarantula", "Osprey", "Hawk", "Sea Turtle"
];

    // Random Username button logic
        document.getElementById('random-username-btn').addEventListener('click', function() {

            const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
            const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];        

            const randomUsername = randomAdjective + randomNoun;
    
            document.getElementById('username').value = randomUsername;
        });


// Password Strength Meter
document.addEventListener('DOMContentLoaded', () => {
    const passwordInput = document.getElementById('password');
    const passwordConfirmInput = document.getElementById('passwordConfirm');
    const passwordError = document.getElementById('passwordError');
    const passwordRequirements = document.getElementById('passwordHelp');

    const requirements = {
        length: {
            regex: /.{8,}/,
            element: document.getElementById('length')
        },
        uppercase: {
            regex: /[A-Z]/,
            element: document.getElementById('uppercase')
        },
        number: {
            regex: /[0-9]/,
            element: document.getElementById('number')
        },
        symbol: {
            regex: /[!@#$%^&*(),.?":{}|<>]/,
            element: document.getElementById('symbol')
        }
    };

    // Show password requirements on focus
    passwordInput.addEventListener('focus', () => {
        passwordRequirements.style.display = 'block';
    });

    // Hide password requirements on blur
    passwordInput.addEventListener('blur', () => {
        setTimeout(() => {
            passwordRequirements.style.display = 'none';
        }, 200);
    });
    // Validate password on input
    passwordInput.addEventListener('input', () => {
        const password = passwordInput.value;
        // Check each requirement
        Object.keys(requirements).forEach(key => {
            if (requirements[key].regex.test(password)) {
                requirements[key].element.classList.remove('invalid');
                requirements[key].element.classList.add('valid');
            } else {
                requirements[key].element.classList.remove('valid');
                requirements[key].element.classList.add('invalid');
            }
        });
        // Check if all requirements are met
        const allValid = Object.keys(requirements).every(key => requirements[key].regex.test(password));
        if (allValid) {
            passwordRequirements.style.display = 'none';
        } else {
            passwordRequirements.style.display = 'block';
        }

        if (passwordConfirmInput.value.length > 0) {
            validatePasswordMatch();
        }
    });
// Validate password match on input
    passwordConfirmInput.addEventListener('input', () => {
        validatePasswordMatch();
    });
// Validate password match
    function validatePasswordMatch() {
        const password = passwordInput.value;
        const confirmPassword = passwordConfirmInput.value;

        if (password && confirmPassword && password !== confirmPassword) {
            passwordError.style.display = 'block';
            passwordConfirmInput.classList.add('is-invalid');
        } else {
            passwordError.style.display = 'none';
            passwordConfirmInput.classList.remove('is-invalid');
        }
    }

// Register form submit
    const registerForm = document.getElementById('registerForm');
    registerForm.addEventListener('submit', (event) => {

        const allValid = Object.keys(requirements).every(key => requirements[key].regex.test(passwordInput.value));

        if (!allValid) {
            event.preventDefault();
            alert('Please ensure your password meets all requirements.');
            passwordRequirements.style.display = 'block';
        }

        // Check password match
        if (passwordInput.value !== passwordConfirmInput.value) {
            event.preventDefault();
            passwordError.style.display = 'block';
            passwordConfirmInput.classList.add('is-invalid');
        }
    });
});


