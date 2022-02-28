const ask = require('../ask');
const fs = require('fs');

module.exports = async () => {
  let vars = {};

  const currentPackageJson = JSON.parse(fs.readFileSync('package.json'));

  vars = {
    ...vars,
    ...(await ask([
      {
        type: 'toggle',
        name: 'delete',
        message: 'Delete current automations?',
        hint: `Remove all traces of previous automations ready for updated ones.`,
        enabled: 'Yes',
        disabled: 'No',
        initial: true,
      },
      {
        type: 'select',
        name: 'type',
        message: 'Project Type?',
        initial: 1,
        required: true,
        choices: [
          {
            message: 'Netlify',
            value: 'netlify',
            hint: 'For a website that will be deployed to Netlify',
          },
          {
            message: 'Microservice',
            value: 'microservice',
            hint: 'For a Microservice that will be deployed to Google Cloud',
          },
          {
            message: 'NPM Package',
            value: 'npmPackage',
            hint: 'For a standard NPM package where no extra build steps are required',
          },
          {
            message: 'Expo Application',
            value: 'expo',
            hint: 'A mobile phone application built using Expo',
          },
        ],
      },
    ])),
  };

  if (vars.type === 'netlify') {
    vars = {
      ...vars,
      ...(await ask([
        {
          type: 'input',
          name: 'baseUrl',
          message: 'Domain name?',
          hint: `Should be just a base domain name, e.g. google.com`,
          required: true,
        },
      ])),
    };
  }

  if (vars.type === 'expo') {
    vars = {
      ...vars,
      ...(await ask([
        {
          type: 'input',
          name: 'appleAppId',
          message: 'Apple App ID?',
          hint: `The ID given for the app in the apple app store`,
          required: true,
        },
      ])),
    };
  }

  if (vars.type === 'microservice') {
    vars = {
      ...vars,
      ...(await ask([
        {
          type: 'input',
          name: 'serviceName',
          message: 'Service name?',
          hint: `The name that will be used for the deployed microservice`,
          required: false,
          initial: currentPackageJson?.name ?? undefined,
        },
      ])),
    };
  }

  vars = {
    ...vars,
    ...(await ask([
      {
        type: 'toggle',
        name: 'gitpod',
        message: 'Use Tech3k Gitpod?',
        hint: `Ensure that commands for committing etc are installed`,
        enabled: 'Yes',
        disabled: 'No',
        initial: true,
      },
      {
        type: 'toggle',
        name: 'codeStandards',
        message: 'Enforce Code Standards?',
        hint: `Ensure that all coding standards are followed while developing`,
        enabled: 'Yes',
        disabled: 'No',
        initial: true,
      },
    ])),
  };

  return vars;
};
