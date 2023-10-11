1. Stop trying to make regex capturing group like `admins.password`.
2. There's a prototype pollution point when getting the slave instance. Change firstname and lastname to get the prototype.
> If lastname string isn't set, it will be 'undefined'.
3. `/setpassword (<admins>?.)` to create first layer capture `admins` and append `password` attribute to prototype. Then we have `match.groups.admins.password`.
4. `/regex` to get flag
