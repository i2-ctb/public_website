# Public Website

## Getting Started

Use the following commands to setup the website on your local computer. These commands pull the latest code from GitHub and then install the necessary tools to build and run the website.

```
git clone git@github.com:i2-ctb/public_website.git
cd public_website
npm install
```

Once the code has been downloaded and the tooling installed, you can run this command from the `public_website` directory to start the website.

```
npm start
```

The `npm start` command should output some build information and finally a list of URLs. You should now be able to open your browser and go to http://localhost:8080 to view the website.

## Development

The following sections describe the website configuration and development process.

### Overview

The site is built using the static site generator 11ty. The main build configuration is contained in the `.eleventy.js` file in the root of the repo. This file contains the basic information required by the build tool like input and output folders etc. Please refer to the 11ty documentation for detailed information.

All of the code used to build the site resides under the `src` folder. This folder contains two sub-folders `site` and `theme`. The `theme` folder contains all of the various assets required by the Wash U website theme. These files should not be modified unless updating the theme per MPA.

The `site` folder contains the html pages and the code that will be used to build the content of the site and follows the common pattern for sites built using 11ty.

When the site is built a `dist` folder will be created in the root of the repo. This folder will contain the output of the build pipeline. All of the HTML, CSS and JS files needed to run the site have been "complied" and written to this folder. When running the `npm start` command, the local webserver will point to this folder to allow for local browsing of the website.

### Managing Pages

One of the advantages to using the 11ty tooling is the simplicity it uses in managing pages.  

All files with an `.html` extension in the `src/site` folder and all sub-folders will be compiled by the 11ty and placed in the output folder: `dist`.

While these files have an `.html` extension, they are actually templates and support the full Nunjucks template syntax. This means they provide more functionality that a traditional `html` page.

It is out of scope of this document to discuss templating in depth. Please refer to the 11ty documentation for detailed information regarding templating. 

https://www.11ty.dev/docs/templates/
https://www.11ty.dev/docs/languages/nunjucks/

However, here are a few basic concepts used in this project.

#### front-matter

Each template contains a section of "front-matter" that provides data about the page. The section is surrounded by `---` and follows the `YAML` syntax. Here is an example from the home page.

```
---
title: Home
layout: main
tags: ['pages']
---
```

The `title`, `layout`, and `tags` properties are used by the build pipeline and should be provided for each page. Additional ad-hoc data/configuration can be included if needed.


    NOTE: Currently the site uses the"tags" property to build the navigation menu. This may change in the future.

#### Data

The best way to see how data is used in the build process for this site is to take a look at the `projects/index.html` and `_data/repos.js` files. This is described in a bit more detail in the `_data` section below.

An example of using data from the `_data/site.json` file can be seen in the `about.html` file.

Additional information about using custom JavaScript code to provide data to the site can be found here: https://www.11ty.dev/docs/data-js/


### Important Folders and Files

In this section we will go through the important files and folders that are used to create the site.

#### _assets

The `_assets` folder is used to contain any custom CSS and JavaScript the site needs. The layout file used by the site contains references to the two existing files within this folder: `scripts.js` and `site.css`. Any CSS or JavaScript used by multiple pages in the site can be placed in the files and it will be automatically included in all pages.

#### _data

One of the great things about the 11ty build tool is it's ability to add data to your website using a very straightforward approach. The files contained within the `_data` folder will be evaluated and exposed to page templates during build. An easier way to say that is, this folder contains all of the custom code and/or configuration used to build the site.

`site.json` contains the basic configuration of the website. This includes things like the site title, contact email address, GitHub information etc.

The `repos.js` contains the code that queries the GitHub API to return the list of repos owned by the organization configured for the site (in `site.json`). The code does an HTTP call and returns the JSON response to the build system. This data is later used by the `projects/index.html` file to build the list of projects.

#### _includes

The global layout and menu are contained within this folder in the `main.njk` and `menu.njk` files respectively. These files are not likely to need to be modified unless the theme changes. However, if the site grows to need more complex navigation, the `menu.njk` file will be the appropriate location to add any code necessary to support the navigation.

The `main.njk` could potentially need to be modified if additional CSS or JS files need to be referenced by the site.

