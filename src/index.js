import * as core from '@actions/core'
import * as github from '@actions/github'
import {format} from 'date-fns'
import {version} from '../package.json'
import {basename} from 'path'

const sleep = (ms) =>  new Promise((resolve) => setTimeout(ms, resolve))

const GITHUB_TOKEN = core.getInput('github_token')
const WORKFLOW_FILENAME = core.getInput('workflow_filename')
const ENABLE_OR_DISABLE = core.getInput('enable_or_disable')
const ENABLE_MILISECOND_DELAY = 5000

const ENDPOINT = {
  DISABLE: 'PUT /repos/{owner}/{repo}/actions/workflows/{workflow_filename}/disable',
  ENABLE: 'PUT /repos/{owner}/{repo}/actions/workflows/{workflow_filename}/enable',
}

export const main = async () => {
  const octokit = github.getOctokit(GITHUB_TOKEN)
  const {payload} = github.context

  const endpoint = ENABLE_OR_DISABLE == 'enable' ? ENDPOINT.ENABLE : ENDPOINT.DISABLE

  if (endpoint == 'enable') await sleep(ENABLE_MILISECOND_DELAY)

  await octokit.request(endpoint, {
    owner: payload.organization.login,
    repo: payload.repository.name,
    workflow_filename: WORKFLOW_FILENAME || github.context.workflow,
  })

  core.setOutput('version', `v${version.split('.')[2]}`)
}
