# nwabap-ui5uploader
This module allows a developer to upload SAPUI5/OpenUI5 sources into a SAP NetWeaver ABAP system. The behavior is (or should be) the same than it is known from the SAP Web IDE app deployment option "Deploy to SAPUI5 ABAP Repository" or from the "SAPUI5 ABAP Repository Team Provider" available for Eclipse via the "UI Development Toolkit for HTML5".
The main reason for developing this module is to integrate the deployment process into a Continuous Integration environment, in which for instance a Jenkins server executes several build steps and finally deploys the sources to a SAP NetWeaver ABAP system if all previous build steps are ok.
The plugin also allows a developer to deploy the sources to a SAP NetWeaver ABAP system by a npm script using a different IDE than Eclipse or SAP Web IDE (for instance WebStorm).

### Based on original gulp and grunt plugins
This module is based on the original gulp and grunt plugins. Though I didn't like the need of gulp or grunt in my projects purely for CI/CD.

## Donations
If you like this port, you find it useful, it has value enough: please donate! ☺️

Ethereum address: 0x951E9eDabD9C41B9A8386091E731Ab15FF574D4f

## Prerequisites
### ABAP Development Tool Services
The ABAP Development Tool Services have to be activated on the SAP NetWeaver ABAP System (transaction SICF, path /sap/bc/adt).
The user used for uploading the sources needs to have the authorization to use the ADT Services and to create/modify BSP applications.
The plugin is tested with NW 7.30, NW 7.40 and NW 7.50 systems.

## Install
Add it to your local project and use npx to run the binary using a `npx`-prefix (as of npm 5.2.0):

```npm install nwabap-ui5uploader --save-dev```

Or just install globally and skip the `npx`-prefix in the examples below:

```npm install -g nwabap-ui5uploader```

## Usage
This node module describes itself on the command line.

```
npx nwabap --help
```
```
npx nwabap upload --help
```

## Examples
Create a npm script that runs the `nwabap` module with the arguments you want.

### Upload to $TMP package
```
npx nwabap upload --base ./dist --conn_server http://myserver:8000 --conn_user upload --conn_password upl04d --abap_package $TMP --abap_bsp ZZ_UI5_LOCAL --abap_bsp_text "UI5 upload local objects"
```

### Upload to a transport tracked package
```
npx nwabap upload --base ./dist --conn_server http://myserver:8000 --conn_user upload --conn_password upl04d --abap_package ZFRONTENDS_TEST --abap_bsp ZABSHR --abap_bsp_text "Absence HR" --abap_transport PRDNK1230120032
```

### (optional) use a configuartion file
```
It is possible to add a script to package.json and a configuration file. Use "npm run upload" or "yarn upload" to upload the sources to SAP.   

"scripts": {
    "upload": "npx nwabap upload"
}

Also create a cofiguration file ".nwabaprc" 

{
    "base": "./dist",
    "conn_server": "http://myserver:8000",
    "conn_user": "upload",
    "conn_password": "upl04d",
    "abap_package": "$TMP",
    "abap_bsp": "ZZ_UI5_LOCAL",
    "abap_bsp_text": "UI5 upload local objects"
}
```

## Release History
[CHANGELOG.md](CHANGELOG.md)

## Contribute
My actual goal is to remove all unnecessary code and libs, except console coloring libs since I find these really helpful. I would also like to rewrite the libs used ([filestore](lib/filestore.js) and [filestoreutils](lib/filestoreutils.js)). Please, and feel free to help me anytime on the project's [GitHub](https://github.com/nrdev88/nwabap-ui5uploader).
