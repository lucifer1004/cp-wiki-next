import React from 'react'

export default function Utterances(): JSX.Element {
  React.useEffect(() => {
    const utterances = document.createElement('script')
    utterances.type = 'text/javascript'
    utterances.async = true
    utterances.setAttribute('issue-term', 'og:title')
    utterances.setAttribute('theme', 'github-light')
    utterances.setAttribute('repo', `lucifer1004/cp-wiki-next`)
    utterances.crossOrigin = 'anonymous'
    utterances.src = 'https://utteranc.es/client.js'
    window.document.getElementById('comment').appendChild(utterances)
  })

  return <div id="comment" />
}
