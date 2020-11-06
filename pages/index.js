import Head from 'next/head'
import styles from '../styles/Home.module.css'
import React from 'react'

export default function Home() {
  const [queryVal, setQueryVal] = React.useState('')
  const [result, setResult] = React.useState({
    length: -1,
    articles: null,
    error: "",
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    fetch('/api/newspapers', {
      method: 'post',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({ query: queryVal }),
    })
      .then((res) => res.json())
      .then((data) => {
        setResult(data);
      })
  }

  const articlesWrapper = () => {
    if (result) {
      if (result.length > 0) {
        const displayArticles = result.articles.map((article) => {
          return (
            <li key={article.id}>
              <div>
                <a href={article.link}>
                  <h2>{article.title}</h2>
                </a>
              </div>
            </li>
          )
        });
        return (<ul>{displayArticles}</ul>);
      }
      else {
        return (<p>{result.error}</p>);
      }
    }
  };


  return (
    <div className={styles.container}>
      <Head>
        <title>Fetch Newspapers</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1>Fetch Newspapers</h1>
        <form className={styles.searchContainer} onSubmit={handleSubmit}>
          <label>
            Enter a query
            <input
              className={styles.input}
              value={queryVal}
              onChange={(e) => setQueryVal(e.target.value)}
            />
          </label>
          <button className={styles.button}>Search</button>
        </form>
        {articlesWrapper()}
      </main>
    </div>
  )
}