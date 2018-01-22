"use strict";
const program = require('commander');
const colors = require('colors');
const FileStore = require('../../lib/filestore');
const glob = require('glob');

function UploadCommand () {
    return program
        .command('upload')
        .description('upload some files to SAP')
        .option("--conn_server <conn_server>", "SAP host")
        .option("--conn_user <conn_user>", "SAP user")
        .option("--conn_password <conn_password>", "SAP password")
        .option("--conn_client <conn_client>", "Optional parameter to specify the client (transferred as sap-client URL parameter). In case the option is not specified the default client is used if specified.")
        .option("--usestrictssl <conn_usestrictssl>", "Default: true. SSL mode handling. In case of self signed certificates the useStrictSSL mode option can be set to false to allow an upload of files.")
        .option("--base <base>", "Base dir")
        .option("--files <files>", "Files to upload (relative from basedir)")
        .option("--abap_transport <abap_transport>", "ABAP transport no.")
        .option("--abap_package <abap_package>", "ABAP package name")
        .option("--abap_bsp <abap_bsp>", "ABAP BSP container ID")
        .option("--abap_bsp_text <abap_bsp_text>", "ABAP BSP container name")
        .option("--abap_language <abap_language>", "ABAP language")
        .option("--calcappindex <calcappindex>", "Re-calculate application index")
        .action(function(_options){
            const options = {
                conn_server: "",
                conn_user: "",
                conn_password: "",
                conn_client: "",
                conn_usestrictssl: true,
                base: "",
                files: "**",
                abap_transport: "",
                abap_package: "",
                abap_bsp: "",
                abap_bsp_text: "",
                abap_language: "EN",
                calcappindex: false
            };

            Object.keys(options).map(key => {
                if (_options[key] !== undefined) {
                    options[key] = _options[key];
                }
            });

            // Validation
            const validation = {
                errors: [],
                warnings: [],
                information: []
            };

            if (!options.base || !options.files) {
                validation.errors.push('Define both the base dir and files.');
            }

            if (!options.conn_user || !options.conn_password) {
                validation.errors.push('Define both a username and password.');
            }

            if (!options.abap_package || !options.abap_bsp || !options.abap_bsp_text) {
                validation.errors.push('ABAP options not fully specified (check package, BSP container, BSP container text information).');
            }

            // Check for length > 15 excluding /PREFIX/
            if (options.abap_bsp && options.abap_bsp.substring(options.abap_bsp.lastIndexOf('/')+1).length > 15) {
                validation.errors.push('BSP name must not be longer than 15 characters.');
            }

            if (options.abap_package !== '$TMP' && !options.abap_transport) {
                validation.errors.push('You should supply a transport.');
            }

            validation.warnings.map(msg => {
                console.log(colors.yellow(msg));
            });

            validation.errors.map(msg => {
                console.log(colors.red(msg));
            });

            if (validation.errors.length > 0) {
                process.exit(1);
            }

            // Information messages
            if (options.conn_usestrictssl === true || options.conn_usestrictssl === "true" || options.conn_usestrictssl === "1") {
                validation.information.push('If HTTPS is used, strict SSL enabled!');
            }

            validation.information.map(msg => {
                console.log(colors.blue(msg));
            });

            // Retrieve files
            const files = [];
            try {
                if(options.base.substr(-1) === '/' || options.base.substr(-1) === '\\') {
                    options.base = options.base.substr(0, options.base.length - 1);
                }

                glob.sync(options.files, {
                    cwd: options.base,
                    nodir: true
                }).map(file => {
                    files.push(file);
                });
            } catch(e) {
                console.log(colors.red('Error!'), e);
                process.exit(1);
            }

            if (files.length === 0) {
                console.log(colors.yellow('No files found. Stopping...'));
                process.exit(1);
            }

            console.log(colors.yellow(`Found ${files.length} files. Starting upload...`));

            // Prepare to call libs
            const filestore = new FileStore({
                conn: {
                    server: options.conn_server,
                    client: options.conn_client,
                    useStrictSSL: options.conn_usestrictssl
                },
                auth: {
                    user: options.conn_user,
                    pwd: options.conn_password
                },
                ui5: {
                    language: options.abap_language.toUpperCase(),
                    transportno: options.abap_transport,
                    package: options.abap_package,
                    bspcontainer: options.abap_bsp,
                    bspcontainer_text: options.abap_bsp_text,
                    calc_appindex: (options.calcappindex === true || options.calcappindex === "true" || options.calcappindex === "1")
                }
            });
            filestore.syncFiles(files, options.base, function (err) {
                if (err) {
                    console.log(colors.red('Error!'), err);
                }
            });
        });
}

module.exports = UploadCommand;