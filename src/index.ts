#!/usr/bin/env node
import * as yargs from "yargs";
import chalk from "chalk";
import fetch from "node-fetch";
import * as fs from "fs";
import * as os from "os";
import api, { ImplementationType, ImpType } from "./api";
import * as Table from "cli-table";
const H = process.env.DEV ? "http://localhost:3000/" : "https://imp.aexol.com/";
const loc = `${os.homedir()}/imp.json`;

export type Credentials = {
  username: string;
  token: string;
};
console.log(`Current host = ${H}\n`);
export const Api = api(H, async (url, { props, method = "POST" }) => {
  let res: Promise<any>;
  if (method === "GET") {
    res = fetch(
      url +
        "?" +
        Object.keys(props)
          .reduce(function(a, k) {
            a.push(k + "=" + encodeURIComponent(props[k]));
            return a;
          }, [])
          .join("&")
    );
  } else {
    res = fetch(url, {
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
});
const requireCredentials = (): Promise<Credentials> =>
  new Promise((resolve, reject) =>
    fs.readFile(loc, (e, data) => {
      if (e) {
        console.error(
          chalk.red("No credentials file. Please login using: imp login.")
        );
        return reject("Forbidden");
      }
      return resolve(JSON.parse(data.toString()) as Credentials);
    })
  );
const argv = yargs
  .command("logout", "Logout from your slothking account", {}, async argv => {
    console.log(chalk.redBright("Logging out..."));
    try {
      fs.unlink(loc, e => {
        if (e) {
          console.log(chalk.red("Already logged out"));
          return;
        }
        console.log(chalk.green("Successfully logged out"));
      });
    } catch (e) {
      console.log(chalk.red("Already logged out"));
    }
  })
  .command(
    "login <username> <password>",
    "Login to your imp account",
    {},
    async argv => {
      console.log(chalk.white("Logging in..."));
      try {
        let parsed = await Api.user.endpoints.login({
          props: {
            username: argv.username,
            password: argv.password
          }
        });
        if (parsed.token) {
          console.log(chalk.green(`Logged in, credentials stored in: ${loc}`));
          fs.writeFile(loc, JSON.stringify(parsed), e => {});
        } else {
          console.log(chalk.red("Wrong username or password"));
        }
      } catch (e) {
        console.log(chalk.red("Wrong username or password"));
      }
    }
  )
  .command(
    "register <username> <password> <repeat_password>",
    "Register new imp account",
    {},
    async argv => {
      console.log(chalk.white("Registering..."));
      if (argv.password !== argv.repeat_password) {
        return chalk.red("Password mismatch");
      }
      try {
        let parsed = await Api.user.endpoints.register({
          props: {
            username: argv.username,
            password: argv.password
          }
        });
        if (parsed.token) {
          console.log(
            chalk.green(`Registered & Logged in, credentials stored in: ${loc}`)
          );
          fs.writeFile(loc, JSON.stringify(parsed), e => {});
        } else {
          console.log(chalk.red("Username already exists"));
        }
      } catch (e) {
        console.log(chalk.red("Username already exists"));
      }
    }
  )
  .command("init <impName>", "Init a new imp", {}, async argv => {
    const credentials = await requireCredentials();
    try {
      await Api.imp.endpoints.initImp({
        props: {
          name: argv.impName,
          token: credentials.token
        }
      });
      console.log(
        chalk.greenBright(`Imp ${argv.impName} successfully initialized`)
      );
    } catch (error) {
      console.log(chalk.red(error));
    }
  })
  .command("get <name> <impVersion> <path>", "Get imp", {}, async argv => {
    const imp = await Api.imp.endpoints.getImp({
      props: {
        name: argv.name,
        version: argv.impVersion
      }
    });
    fs.writeFile(argv.path, imp.Imp.code, err => {
      if (err) {
        console.log(chalk.red(err.message));
      } else {
        console.log(chalk.green(`Code downloaded and saved to ${argv.path}`));
      }
    });
  })
  .command("rm <name>", "Delete imp", {}, async argv => {
    const credentials = await requireCredentials();
    try {
      await Api.imp.endpoints.removeImp({
        props: {
          name: argv.name,
          token: credentials.token
        }
      });
      console.log(chalk.green(`Imp ${argv.name} successfully deleted`));
    } catch (error) {
      console.log(chalk.red(error));
    }
  })
  .command(
    "update <name> <impVersion> <path>",
    "Update imp",
    {},
    async argv => {
      console.log(argv.impVersion);
      const credentials = await requireCredentials();
      try {
        await Api.imp.endpoints.updateImp({
          props: {
            name: argv.name,
            Imp: {
              version: argv.impVersion,
              code: (await new Promise((resolve, reject) =>
                fs.readFile(argv.path, (err, data) => {
                  if (err) {
                    reject(err);
                  }
                  resolve(data.toString());
                })
              )) as string
            } as ImpType,
            token: credentials.token
          }
        });
        console.log(
          chalk.green(
            `Imp ${argv.name} version ${argv.impVersion} successfully updated`
          )
        );
      } catch (error) {
        console.log(chalk.red(error));
      }
    }
  )
  .command("search <query>", "Search imps", {}, async argv => {
    const imps = await Api.imp.endpoints.searchImp({
      props: {
        query: argv.query
      }
    });
    const table = new Table({
      head: ["name", "version", "quick install"],
      colWidths: [20, 10, 40]
    });
    imps.Imp.map(i => {
      const { name } = i.Implementation as ImplementationType;
      table.push([
        chalk.cyan(name),
        i.version,
        `imp get ${name} ${i.version} <path>`
      ]);
    });
    if (!imps.Imp.length) {
      console.log(chalk.yellow("No results for this query"));
    } else {
      console.log(table.toString());
    }
  })
  .help().argv;
argv;
