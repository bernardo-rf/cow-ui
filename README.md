# Master's Project - COW.UI

## Description

Welcome to COW UI this is the first step to decentralize food supply chains.

- MEI-CM project at Politécnico de Leiria
- Developed since 09/2021 until 02/2023
- Review by: [catarinareis](https://github.com/catarinareis-rf)

![](https://www.ipleiria.pt/wp-content/uploads/2021/10/estg_h-01.png)

- ESTG - School of Technology and Management
- ciTechCare - Center for Innovative Care and Health Technology

## Contents

- [Installation](#installation)
- [Configuration](#configuration)
- [Contributing](#contributing)
- [License](#license)
- [Related Projects](#related-projects)
- [Contact](#contact)

## Installation

1. Install Node version 18.14 or LTS.

## Configuration

1.  Create text file in the root directory of the project named `.env`.

```
VUE_APP_API_URL=api_url_in_string_format
VUE_APP_PINATA_API_KEY=pinata_api_key_in_string_format
```

2. Create a Piñata Account in `https://app.pinata.cloud/register`. Follow this steps (only if you don't own a Piñata account already):

- Access the pinata website
- Create an account
- Create an `API_KEY` by going to Developers > Api Keys > + New Key
- Copy & Paste your `API_KEY` to .env `VUE_APP_PINATA_API_KEY`

3. Run the following commands

```
npm install

npm run serve
```

4. Check `http://localhost:8081` to view COW plataform.

#### NOTE:

- A .env.example is provided to help the setup of the project.

## Contributing

We appreciate and welcome contributions! To contribute to the project, please follow these guidelines:

1. Fork the repository.
2. Create a new branch.
3. Make your changes and ensure they are appropriately documented.
4. Test your changes thoroughly.
5. Submit a pull request, describing the changes you have made.
6. Our team will review your contribution, provide feedback if necessary, and merge it once it meets the required standards.

## License

Cow API is licensed under a Creative Commons Attribution 4.0 International License.

<p xmlns:cc="http://creativecommons.org/ns#" xmlns:dct="http://purl.org/dc/terms/"><a property="dct:title" rel="cc:attributionURL" href="https://github.com/bernardo-rf/cow-api">cow-api</a> by <a rel="cc:attributionURL dct:creator" property="cc:attributionName" href="https://github.com/bernardo-rf">Bernardo Figueiredo</a> is licensed under <a href="http://creativecommons.org/licenses/by-nc-sa/4.0/?ref=chooser-v1" target="_blank" rel="license noopener noreferrer" style="display:inline-block;">CC BY-NC-SA 4.0<img style="height:22px!important;margin-left:3px;vertical-align:text-bottom;" src="https://mirrors.creativecommons.org/presskit/icons/cc.svg?ref=chooser-v1"><img style="height:22px!important;margin-left:3px;vertical-align:text-bottom;" src="https://mirrors.creativecommons.org/presskit/icons/by.svg?ref=chooser-v1"><img style="height:22px!important;margin-left:3px;vertical-align:text-bottom;" src="https://mirrors.creativecommons.org/presskit/icons/nc.svg?ref=chooser-v1"><img style="height:22px!important;margin-left:3px;vertical-align:text-bottom;" src="https://mirrors.creativecommons.org/presskit/icons/sa.svg?ref=chooser-v1"></a></p>

## Related Projects

- [cow-ui](https://github.com/bernardo-rf/cow-api)
- [cow-smart_contracts](https://github.com/bernardo-rf/cow-smart_contracts)

## Contact

If you have any questions, suggestions, or feedback, please feel free to contact us:

- Email: [bernardo.figueiredo@outlook.com]
- GitHub: [bernardo-rf](https://github.com/bernardo-rf)
- Trello: [cow-ui](https://trello.com/b/5CnlL9nG/cow-project)
