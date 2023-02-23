# COW.UI
 
## COW Frontend Setup
1. Install Node version 18.14 or LTS.
2.  Create text file in the root directory of the project named `.env`.
```
VUE_APP_API_URL=api_url_in_string_format
VUE_APP_PINATA_API_KEY=pinata_api_key_in_string_format
``` 

3. Create a Piñata Account in `https://app.pinata.cloud/register`. Follow this steps (only if you don't own a Piñata account already):
* Access  the pinata website 
* Create an account
* Create an `API_KEY` by going to Developers > Api Keys > + New Key
* Copy & Paste your `API_KEY` to .env `VUE_APP_PINATA_API_KEY`

4. Run the following commands
```
npm install

npm run serve
```

5. Check `http://localhost:8081` to view COW plataform.

- NOTE:
    - A .env.example is provided to help the setup of the project.


