
const fetch = require("node-fetch");
const config = require("./site.json");

module.exports = async function () {
    const response = await fetch(`https://api.github.com/orgs/${config.github.org}/repos`, {
        headers: {
            Accept: "application/vnd.github.v3+json"
        }
    });

    let output = [];
    if (response.ok) {
        const data = await response.json();
        output = data;
    }
    else {
        output = [{ name: 'Could not load projects at this time...', description: JSON.stringify(response) }];
    }
    return output;

};