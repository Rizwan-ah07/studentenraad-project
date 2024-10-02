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

    
        document.getElementById('random-username-btn').addEventListener('click', function() {

            const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
            const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];        

            const randomUsername = randomAdjective + randomNoun;
    
            document.getElementById('username').value = randomUsername;
        });


        document.getElementById('registerForm').addEventListener('submit', function(event) {

            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('passwordConfirm').value;
            const passwordError = document.getElementById('passwordError');


            if (password !== confirmPassword) {
                passwordError.style.display = 'block';
                event.preventDefault(); 
            } else {
                passwordError.style.display = 'none'; 
            }
        });

        document.getElementById('registerForm').addEventListener('submit', function(event) {
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('passwordConfirm').value;
            const passwordError = document.getElementById('passwordError');

            if (password !== confirmPassword) {
                passwordError.innerHTML = "Passwords do not match.";
                passwordError.style.display = 'block';
                event.preventDefault();
            } 
            else if (password.length < 8) {
                passwordError.innerHTML = "Password must be at least 8 characters long.";
                passwordError.style.display = 'block';
                event.preventDefault();
            } 
            else {
                passwordError.style.display = 'none'; 
            }
        });