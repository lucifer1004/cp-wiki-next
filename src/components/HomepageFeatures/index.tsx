import React from 'react'
import clsx from 'clsx'
import styles from './styles.module.css'
import {translate} from '@docusaurus/Translate'

type FeatureItem = {
  title: string
  Svg: React.ComponentType<React.ComponentProps<'svg'>>
  description: JSX.Element
}

const FeatureList: FeatureItem[] = [
  {
    title: translate({
      message: '什么是 CP？',
      id: 'homepage.feature.what-is-cp',
    }),
    Svg: require('@site/static/img/undraw_questions.svg').default,
    description: (
      <>
        {translate({
          message:
            'CP是Competitive Programming（竞赛性编程）的缩写。与面向工程的程序设计不同，CP追求的是在一定的时间内，实现一定的算法和数据结构，以解决某一特定的、可能并不具有现实意义的问题。',
          id: 'homepage.feature.what-is-cp.description',
        })}
      </>
    ),
  },
  {
    title: translate({
      message: '为什么参加 CP？',
      id: 'homepage.feature.why-cp',
    }),
    Svg: require('@site/static/img/undraw_problem_solving.svg').default,
    description: (
      <>
        {translate({
          message: '每个人都有参加CP的不同理由。我个人把CP当做一种思维体操。',
          id: 'homepage.feature.why-cp.description',
        })}
      </>
    ),
  },
  {
    title: translate({
      message: '如何参加 CP？',
      id: 'homepage.feature.how-to-cp',
    }),
    Svg: require('@site/static/img/undraw_solution_mindset.svg').default,
    description: (
      <>
        {translate({
          message:
            '有许多在线的CP平台，知名的如Codeforces、AtCoder、USACO、Leetcode、洛谷等。还有许多平台提供了OJ（Online Judge）功能，可以用于在线练习，比如POJ、HDOJ、Kattis、UVA、SPOJ、LibreOJ等。',
          id: 'homepage.feature.how-to-cp.description',
        })}
      </>
    ),
  },
]

function Feature({title, Svg, description}: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  )
}

export default function HomepageFeatures(): JSX.Element {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  )
}
