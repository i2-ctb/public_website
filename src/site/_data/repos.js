
const fetch = require("node-fetch");
const config = require("./site.json");
const md = require('markdown-it')();
const contentBaseUrl = 'https://raw.githubusercontent.com';


async function loadRepoDetails(data) {
    const repo = { ...data };
    repo.homepage = repo.homepage ?? repo.html_url;

    let filename = config.github.projectSummaryFilename;
    const response = await fetch(`${contentBaseUrl}/${config.github.org}/${repo.name}/${repo.default_branch}/${filename}`);

    if (response.ok) {
        const text = await response.text();
        repo.readme = md.render(text);
    }

    return repo;
}


async function loadRepos() {
    const response = await fetch(`https://api.github.com/orgs/${config.github.org}/repos`, {
        headers: {
            Accept: "application/vnd.github.v3+json"
        }
    });

    let output = [];
    if (response.ok) {
        const data = await response.json();
        const repos = data.filter(d => config.github.excludedRepos.indexOf(d.id) < 0);

        for (let index = 0; index < repos.length; index++) {
            const repo = await loadRepoDetails(repos[index]);
            output.push(repo);
        }
    }
    else {
        output = [{
            name: 'Could not load projects at this time...',
            description: JSON.stringify({ response, text: await response.text() })
        }];
    }

    return output;
};

module.exports = loadRepos;