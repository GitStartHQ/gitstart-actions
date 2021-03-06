import * as core from '@actions/core'
import {context} from '@actions/github'
import axios from 'axios'

process.on('unhandledRejection', handleError)
main().catch(handleError)

async function main(): Promise<void> {
  const token = core.getInput('token', {required: true})
  const upstream_owner = core.getInput('upstream_owner', {required: true})
  const upstream_repo = core.getInput('upstream_repo', {required: true})
  const upstream_branch = core.getInput('upstream_branch', {required: true})
  const forked_branch = core.getInput('forked_branch', {required: true})

  try {
    const object = {
      token,
      upstream_owner,
      upstream_repo,
      forked_owner: context.repo.owner,
      upstream_branch,
      forked_repo: context.repo.repo,
      forked_branch
    }
    const queryString = new URLSearchParams(object).toString()
    await axios.get(
      `https://hooks.gitstart.dev/api/github/actions/open_source/sync_pull_requests?${queryString}`
    )
    core.setOutput('result', 'Success')
  } catch (e) {
    console.error(e)
    core.error(JSON.stringify(e))
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function handleError(err: any): void {
  console.error(err)
  core.setFailed(`Unhandled error: ${err}`)
}
