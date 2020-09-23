const figlet = require("figlet");
const chalk = require("chalk");
const inquirer = require("inquirer");
const clear = require("clear");

function execShellCommand(cmd) {
  const exec = require("child_process").exec;
  return new Promise((resolve, reject) => {
    exec(cmd, (error, stdout, stderr) => {
      if (error) {
        console.warn(error);
        process.exit();
      }
      resolve(stdout ? stdout : stderr);
    });
  });
}

const databaseConfiguration = async () => {
  const questions = [
    {
      name: "dbname",
      type: "input",
      message: chalk.green("Database Name:"),
      validate: function (value) {
        if (value.length) {
          return true;
        } else {
          return "Please enter database name.";
        }
      },
    },
    {
      name: "dbuser",
      type: "input",
      message: chalk.green("Database User:"),
      validate: function (value) {
        if (value.length) {
          return true;
        } else {
          return "Please enter database username.";
        }
      },
    },
    {
      name: "dbpass",
      type: "password",
      message: chalk.green("Database Password:"),
      validate: function (value) {
        if (value.length) {
          return true;
        } else {
          return "Please enter database password.";
        }
      },
    },
  ];

  const data = await inquirer.prompt(questions);

  await execShellCommand("rm wp-config-sample.php");

  return await execShellCommand(
    `wp config create --dbname=${data.dbname} --dbuser=${data.dbuser} --dbpass=${data.dbpass} --force`
  );
};

const wordpressInstallation = async () => {
  const questions = [
    {
      name: "address",
      type: "input",
      message: chalk.green("Website Address:"),
      validate: function (value) {
        if (/^[a-z0-9-]+$/.test(value)) {
          return true;
        } else {
          return "Please enter valid address, without domain.";
        }
      },
    },
    {
      name: "email",
      type: "input",
      message: chalk.green("Admin Email:"),
      validate: function (value) {
        if (value.length) {
          return true;
        } else {
          return "Please enter email.";
        }
      },
    },
    {
      name: "password",
      type: "password",
      message: chalk.green("Admin Password:"),
      validate: function (value) {
        if (value.length) {
          return true;
        } else {
          return "Please enter database password.";
        }
      },
    },
  ];

  const data = await inquirer.prompt(questions);

  //TODO: validate valet installed corectly

  await execShellCommand(`valet link ${data.address}`);

  var output = await execShellCommand(
    `wp core install --url=${data.address}.test --title=${data.address} --admin_user=${data.email} --admin_email=${data.email} --admin_password=${data.password} --skip-email`
  );
  console.log(output);

  var output = await execShellCommand(`wp theme delete --all --force`);
  console.log(output);

  var output = await execShellCommand(`wp plugin delete --all`);
  console.log(output);

  var output = await execShellCommand(
    `wp plugin install https://github.com/Hube2/acf-medium-editor/archive/master.zip --force --activate`
  );
  console.log(output);

  var output = await execShellCommand(
    `wp plugin install admin-columns-for-acf-fields --force --activate`
  );
  console.log(output);

  var output = await execShellCommand(
    `wp plugin install https://connect.advancedcustomfields.com/v2/plugins/download?p=pro&k=NWVmZDdlZjhlMzdjNmI1NmE5ZDFlODQxMzIzOGViYjQzOTkyMGUwMTQxMzFjMDBlMTUwY2Yy --force --activate`
  );
  console.log(output);

  var output = await execShellCommand(`wp plugin install classic-editor --force --activate`);
  console.log(output);

  var output = await execShellCommand(`wp plugin install disable-comments --force --activate`);
  console.log(output);

  var output = await execShellCommand(`wp plugin install wp-bcrypt --force --activate`);
  console.log(output);

  var output = await execShellCommand(
    `wp plugin install https://github.com/wp-graphql/wp-graphiql/archive/master.zip --force --activate`
  );
  console.log(output);

  var output = await execShellCommand(
    `wp plugin install https://github.com/wp-graphql/wp-graphql/archive/master.zip --force --activate`
  );
  console.log(output);

  var output = await execShellCommand(
    `wp plugin install https://github.com/wp-graphql/wp-graphql-acf/archive/master.zip --force --activate`
  );
  console.log(output);

  var output = await execShellCommand(
    `wp plugin install https://github.com/wp-graphql/wp-graphql-meta-query/archive/master.zip --force --activate`
  );
  console.log(output);

  var output = await execShellCommand(`wp plugin install wp-headless --force --activate`);
  console.log(output);

  var output = await execShellCommand(`wp plugin activate --all`);
  console.log(output);

  await execShellCommand(`mkdir -p wp-content/themes/${data.address}`);

  await execShellCommand(`touch wp-content/themes/${data.address}/style.css`);

  await execShellCommand(`touch wp-content/themes/${data.address}/index.php`);

  await execShellCommand(`touch wp-content/themes/${data.address}/functions.php`);

  await execShellCommand(
    `echo '/*\nTheme Name: ${data.address}\nAuthor: BRAINZ DISRUPTIVE\nAuthor URI: distruptuve.cz\nDescription:\nVersion: 1.0\nLicense: commercial\n*/' > wp-content/themes/${data.address}/style.css`
  );

  var output = await execShellCommand(`wp theme activate ${data.address}`);
  console.log(output);
};

const run = async () => {
  clear();

  console.log(
    chalk.blueBright(
      figlet.textSync("WP Headless", { horizontalLayout: "full" })
    )
  );

  console.log(chalk.blue("Wordpress downloading"));
  var output = await execShellCommand(
    "wp core download --skip-content --force"
  );
  console.log(output);

  console.log(chalk.blue("Database configurations"));
  var output = await databaseConfiguration();
  console.log(output);

  console.log(chalk.blue("Wordpress instalation"));

  await wordpressInstallation();
};

run();
