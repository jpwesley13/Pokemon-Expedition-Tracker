# PokET: The Pokémon Expedition Tracker

PokET is an application for users to chronicle their adventures through expeditions in various locales. These expeditions are documented by the user, and the results are then catalogued into a personal Pokédex within PokET, based on the National Dex standard. With PokET, a user can easily track their progress over time through the results of their expeditions, and set future goals in regards to finding numbers of new species, obtaining various quantities of a given Type, or anything else they may wish. As a primarily self-driven application, most of PokET's features require a user to be logged in, but not necessarily be a contributor.

## Initialization

When PokET is loaded, the user is greeted by the home page, displaying a random assortment of Pokémon, as well as a handful of global stats for the app. Assuming the user is not already logged in, they will see a message instructing them to do so for additional features. If they are logged in already, they will see some recommendation(s) for their progress based on existing user data.

## Local Installation
Requirements: Postgres, Python 3.13, pipenv, npm

### Setting Up The Backend
1. Start a new terminal just for the backend
2. While in the root project directory, run `pipenv install`
3. Start the environment using `pipenv shell`
4. Run `cd backend`
5. Start your local `postgres` service (i.e. `sudo service postgres start`)
6. Run `flask db upgrade` to apply migrations to the DB
7. Run `python seed.py` to seed the DB
8. Run `python app.py`

### Setting Up The Frontend

1. In a separate terminal window, run `cd frontend` from the root project directory
2. Run `npm install` to install the dependencies
3. After installation, run `npm start`
4. This should open a browser window with your app hosted on port `3000`

## Features

* Users may view global stats and information on locales that other users have had expeditions within, featuring basic information about the locale and its confirmed contents. Locales may be filtered and sorted as the user wishes, to narrow down options that are practical to them. A logged in user may also add a new locale they have adventured on if it is not already present.
* When logged in, users may view their own Expeditions, as well as add new ones. Expeditions on this page give simple analytics for their contents, with additional details accessible.
* Logged in users may also access their personal goals. These goals may be added, edited, and removed as the user sees fit. Goals are a wholly self-accountable piece to PokET.
* Accessing one's profile page displays a variety of personal analytics to the user relating to various aspects of PokET's logged expedition and Pokémon info. The profile page is also where the user may access their personal Pokédex.
* A personal Pokédex displays all Pokémon the user has logged through expeditions on PokET, accompanied with basic information.

## Global Access

Of the main pages of PokET, the two that may be accessed regardless of a user account or not are the home page and the locales page. The initial home page displays randomly selected Pokémon as well as various user stats. When not logged in, the only stats displayed are global ones, taking the results of all users of PokET. The majority of these displayed stats are monthly, allowing a user to see trends that develop over time. If a user is logged in, in addition to the global stats, they will see a recommendation based on their own user info. By default this recommendation is a Pokémon Type the user has fewer of, encouraging them to seek an even spread of Typings.

On PokET's Locales page a user, logged in or not, may see a list of all locales that have been visited by members of the app. Due to the potentially limitless number of locales that may be visited by users, the Locales page features the ability to search a locale by name, filter them by the region they may be found in, and change whether they are sorted alphabetically or by the number of user expeditions within them. Each locale is accompanied with a card of information, detailing the locale's region, how many expeditions have been recorded there on PokET, and the most common Pokémon that was caught there. Additionally the info card features a button to display every confirmed Pokémon captured at the locale. If a user is logged in, they may also add new locales to the app for confirmed expeditions, with checks in place to prevent duplicate locations within the same region.

## Expeditions

The core of PokET are its expeditions. On the Expeditions page, a logged in user may access and add their expeditions to the app. By default when a user accesses the Expeditions page, all of their expeditions for the current month will be displayed. If the user wishes to see past expeditions, they are given a date picking field to select or enter a month and year. Each expedition displayed on this page gives very basic information on the expedition itself. These info bits are when the expedition took place, the amount of Pokémon caught on the expedition if any, and the most common Type(s) of Pokémon caught on the expedition if any. Displayed expeditions also each feature a Details button, which when pressed open a panel that more explicitly breaks down the individual expedition. The detailed panel directly numbers how many of each Type was caught, all Pokémon that were caught, and if any Pokémon were Shiny.

When a user wishes to log a new expedition, they will do so on this page by pressing the "add new expedition" button. This button will open up a form that initially asks only for a date and locale for the expedition. Under these initial fields is a button to add a new capture, which itself will expand the form to display additional fields for a Pokémon's info. The fields relating to the Pokémon capture are the Pokémon species' name, its Pokédex number, its Type(s), and whether or not the Pokémon is Shiny; however, the middle two fields will be automatically populated after the user enters the Pokémon's name, saving them hassle. At the end of these Pokémon-specific fields is another button to remove the capture, in the event the user made a mistake and did not mean to press the add new capture button. Should any fields be left empty or otherwise invalid, the user will receive error messages directing their next steps. Upon submission, the form will close and the user's new expedition will be immediately added, showing up on the page if it is for the currently displayed month.

## Goals

PokET also features a Goals page where the user may give themselves personal goals with deadlines. This feature is intended to keep the user self-accountable for progress on PokET. Goals may be freely edited by the user should the contents of the goal or target date change, as well as deleted should the goal be achieved or abandoned. Because there are no limits to how long the contents of a user's goal may be, each goal rests within a card that will truncate its content after a certain length until the user presses a View button to see the contents in their entirety.

## Profile

When a user visits their profile page, there will by default be three blocks of displayed information. These default blocks give basic guiding information to the user to begin logging expeditions, informing them that the locales they have been to, the Types they have caught, and the expeditions they have undergone will be displayed in the future. An experienced user of PokET will have these displays in effect, detailing to the user the following information:
* Total number of Pokémon caught across a total number of expeditions, alongside how many of those expeditions were this month
* The most common Type(s) the user has caught
* All locales the user has visited through their expeditions

In addition to these default blocks, as soon as a user has caught at least one Pokémon on their expeditions, they will see a block that links to their personal Pokédex page. The final block of displayed information on a user's profile page is something of a bonus; the total number of Shiny Pokémon the user has caught will also be displayed, but due to their rarity the user is not informed of this block until it is already in effect.

## Pokédex

PokET's other primary feature is its Pokédex. When a user adds Pokémon captures through expeditions, the Pokémon are automatically added to a personal Pokédex accessible from their profile. This Pokédex is displayed in National Dex order, allowing for a consistent tracking method. All Pokémon in a user's Pokédex display various information:
* The Pokémon's picture
* The Pokémon's National Dex Number
* The Pokémon's Typing
* How many of the Pokémon the user has captured

In addition to this, PokET's Pokédex also displays any variants of Pokémon the user has caught, such as regional forms or forme changes. The Pokédex displays these entries with a colored indentation to inform the user of the presence of variants.
