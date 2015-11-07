# lucky-night

This project was generated with the [Angular Full-Stack Generator](https://github.com/DaftMonk/generator-angular-fullstack) version 3.0.0-rc8.

## Free Code Camp - Basejump: Build a Nightlife Coordination App
<ol>
  <li>User Story: As an unauthenticated user, I can view all bars in my area.</li>
  <li>User Story: As an authenticated user, I can add myself to a bar to indicate I am going there tonight.</li>
  <li>User Story: As an authenticated user, I can remove myself from a bar if I no longer want to go there.</li>
  <li>Bonus User Story: As an unauthenticated user, when I login I should not have to search again.</li>
</ol>

### TODO
<ol>
<li>(US:2-4)  Setup local auth</li>
<li>(US:2-3)  Add API end point to add/remove user from a bar</li>
<li>(US:  1)  Add API end point to get bars/clubs near user search location from Yelp to include other users who have added themselves to the bar</li>
<li>(US:  1)  Create view with nearby bars with search filter
  <ol>
    <li>If user is logged in check if they have a stored search, if so use that search initially</li>
    <li>If user is not logged in check if user has a search stored in cookies</li>
    <li>If user searches store it/update stored search</li>
  </ol>
</li>
<li>(US:  4)  Store users search in cookie for when they are not logged in</li>
<li>(US:  4)  Store users search on server, should this be in the users table or a new table?</li>
<li>(US:1-4)  Deploy to Heroku</li>
<li>(US:1-4)  Setup auth on Heroku</li>
</ol>
