# lucky-night

This project was generated with the [Angular Full-Stack Generator](https://github.com/DaftMonk/generator-angular-fullstack) version 3.0.0-rc8.

## Free Code Camp - Basejump: Build a Nightlife Coordination App

1)  User Story: As an unauthenticated user, I can view all bars in my area.
2)  User Story: As an authenticated user, I can add myself to a bar to indicate I am going there tonight.
3)  User Story: As an authenticated user, I can remove myself from a bar if I no longer want to go there.
4)  Bonus User Story: As an unauthenticated user, when I login I should not have to search again.

### TODO
<ol>
<li>test</li>
</ol>
1)  (US:2-4)  Setup local auth 
2)  (US:2-3)  Add API end point to add/remove user from a bar
3)  (US:1)    Add API end point to get bars/clubs near user search location from Yelp to include other users who have added themselves to the bar 
4)  (US:1)    Create view with nearby bars with search filter
              1. If user is logged in check if they have a stored search, if so use that search initially
              2. If user is not logged in check if user has a search stored in cookies
              3. If user searches store it/update stored search
5)  (US:4)    Store users search in cookie for when they are not logged in
6)  (US:4)    Store users search on server, should this be in the users table or a new table?
7)  (US:1-4)  Deploy to Heroku
8)  (US:1-4)  Setup auth on Heroku
