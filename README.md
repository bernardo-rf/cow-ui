# COW.UI
 
## COW Frontend Setup
1. Install node@18.14 LTS
2. Create Pinata Token
* Access  the pinata website `https://app.pinata.cloud/register`
* Create an account
* Create an `API_KEY` by going to Developers > Api Keys > + New Key
* Copy & Paste your `API_KEY` to .env `VUE_APP_PINATA_API_KEY`
3.  Create text file in the root directory of the project named `.env`.
```
VUE_APP_API_URL=api_url_in_string_format
VUE_APP_PINATA_API_KEY=pinata_api_key_in_string_format
```
3. Run the following commands
```
npm install

npm run serve
```


