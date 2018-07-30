#!/usr/bin/env node
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const yargs = require("yargs");
const chalk_1 = require("chalk");
const node_fetch_1 = require("node-fetch");
const fs = require("fs");
const os = require("os");
const api_1 = require("./api");
const Table = require("cli-table");
const H = process.env.DEV ? "http://localhost:3000/" : "https://imp.aexol.com/";
const loc = `${os.homedir()}/imp.json`;
console.log(`Current host = ${H}\n`);
exports.Api = api_1.default(H, (url, { props, method = "POST" }) => __awaiter(this, void 0, void 0, function* () {
    let res;
    if (method === "GET") {
        res = node_fetch_1.default(url +
            "?" +
            Object.keys(props)
                .reduce(function (a, k) {
                a.push(k + "=" + encodeURIComponent(props[k]));
                return a;
            }, [])
                .join("&"));
    }
    else {
        res = node_fetch_1.default(url, {
            method,
            body: JSON.stringify(props),
            headers: {
                "Content-Type": "application/json"
            }
        });
    }
    return res.then(r => {
        if (r.status >= 400) {
            throw new Error(r.statusText);
        }
        return r;
    });
}));
const requireCredentials = () => new Promise((resolve, reject) => fs.readFile(loc, (e, data) => {
    if (e) {
        console.error(chalk_1.default.red("No credentials file. Please login using: imp login."));
        return reject("Forbidden");
    }
    return resolve(JSON.parse(data.toString()));
}));
const argv = yargs
    .command("logout", "Logout from your slothking account", {}, (argv) => __awaiter(this, void 0, void 0, function* () {
    console.log(chalk_1.default.redBright("Logging out..."));
    try {
        fs.unlink(loc, e => {
            if (e) {
                console.log(chalk_1.default.red("Already logged out"));
                return;
            }
            console.log(chalk_1.default.green("Successfully logged out"));
        });
    }
    catch (e) {
        console.log(chalk_1.default.red("Already logged out"));
    }
}))
    .command("login <username> <password>", "Login to your imp account", {}, (argv) => __awaiter(this, void 0, void 0, function* () {
    console.log(chalk_1.default.white("Logging in..."));
    try {
        let parsed = yield exports.Api.user.endpoints.login({
            props: {
                username: argv.username,
                password: argv.password
            }
        });
        if (parsed.token) {
            console.log(chalk_1.default.green(`Logged in, credentials stored in: ${loc}`));
            fs.writeFile(loc, JSON.stringify(parsed), e => { });
        }
        else {
            console.log(chalk_1.default.red("Wrong username or password"));
        }
    }
    catch (e) {
        console.log(chalk_1.default.red("Wrong username or password"));
    }
}))
    .command("register <username> <password> <repeat_password>", "Register new imp account", {}, (argv) => __awaiter(this, void 0, void 0, function* () {
    console.log(chalk_1.default.white("Registering..."));
    if (argv.password !== argv.repeat_password) {
        return chalk_1.default.red("Password mismatch");
    }
    try {
        let parsed = yield exports.Api.user.endpoints.register({
            props: {
                username: argv.username,
                password: argv.password
            }
        });
        if (parsed.token) {
            console.log(chalk_1.default.green(`Registered & Logged in, credentials stored in: ${loc}`));
            fs.writeFile(loc, JSON.stringify(parsed), e => { });
        }
        else {
            console.log(chalk_1.default.red("Username already exists"));
        }
    }
    catch (e) {
        console.log(chalk_1.default.red("Username already exists"));
    }
}))
    .command("init <impName>", "Init a new imp", {}, (argv) => __awaiter(this, void 0, void 0, function* () {
    const credentials = yield requireCredentials();
    try {
        yield exports.Api.imp.endpoints.initImp({
            props: {
                name: argv.impName,
                token: credentials.token
            }
        });
        console.log(chalk_1.default.greenBright(`Imp ${argv.impName} successfully initialized`));
    }
    catch (error) {
        console.log(chalk_1.default.red(error));
    }
}))
    .command("get <name> <impVersion> <path>", "Get imp", {}, (argv) => __awaiter(this, void 0, void 0, function* () {
    const imp = yield exports.Api.imp.endpoints.getImp({
        props: {
            name: argv.name,
            version: argv.impVersion
        }
    });
    fs.writeFile(argv.path, imp.Imp.code, err => {
        if (err) {
            console.log(chalk_1.default.red(err.message));
        }
        else {
            console.log(chalk_1.default.green(`Code downloaded and saved to ${argv.path}`));
        }
    });
}))
    .command("rm <name>", "Delete imp", {}, (argv) => __awaiter(this, void 0, void 0, function* () {
    const credentials = yield requireCredentials();
    try {
        yield exports.Api.imp.endpoints.removeImp({
            props: {
                name: argv.name,
                token: credentials.token
            }
        });
        console.log(chalk_1.default.green(`Imp ${argv.name} successfully deleted`));
    }
    catch (error) {
        console.log(chalk_1.default.red(error));
    }
}))
    .command("update <name> <impVersion> <path>", "Update imp", {}, (argv) => __awaiter(this, void 0, void 0, function* () {
    console.log(argv.impVersion);
    const credentials = yield requireCredentials();
    try {
        yield exports.Api.imp.endpoints.updateImp({
            props: {
                name: argv.name,
                Imp: {
                    version: argv.impVersion,
                    code: (yield new Promise((resolve, reject) => fs.readFile(argv.path, (err, data) => {
                        if (err) {
                            reject(err);
                        }
                        resolve(data.toString());
                    })))
                },
                token: credentials.token
            }
        });
        console.log(chalk_1.default.green(`Imp ${argv.name} version ${argv.impVersion} successfully updated`));
    }
    catch (error) {
        console.log(chalk_1.default.red(error));
    }
}))
    .command("search <query>", "Search imps", {}, (argv) => __awaiter(this, void 0, void 0, function* () {
    const imps = yield exports.Api.imp.endpoints.searchImp({
        props: {
            query: argv.query
        }
    });
    const table = new Table({
        head: ["name", "version", "quick install"],
        colWidths: [20, 10, 40]
    });
    imps.Imp.map(i => {
        const { name } = i.Implementation;
        table.push([
            chalk_1.default.cyan(name),
            i.version,
            `imp get ${name} ${i.version} <path>`
        ]);
    });
    if (!imps.Imp.length) {
        console.log(chalk_1.default.yellow("No results for this query"));
    }
    else {
        console.log(table.toString());
    }
}))
    .help().argv;
argv;
//# sourceMappingURL=index.js.map