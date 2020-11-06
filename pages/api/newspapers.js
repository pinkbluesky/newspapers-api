// https://www.google.com/search?q=hurricane+diana+site%3Anews.google.com%2Fnewspapers&oq=hurricane+diana+site%3Anews.google.com%2Fnewspapers

const cheerio = require('cheerio') // 1

export default async (req, res) => { // 2
  if (req.method === 'POST') { // 3
    const query = req.body.query;
    const newQuery = query.replace(/ /g, "+");

    const cutoff = " - Google News";

    // const url = `https://www.google.com/search?q=${newQuery}+site%3Anews.google.com%2Fnewspapers&oq=hurricane+diana+site%3Anews.google.com%2Fnewspapers`;

    try {
      const response = await fetch(`https://www.google.com/search?q=${newQuery}+site%3Anews.google.com%2Fnewspapers&oq=${newQuery}+site%3Anews.google.com%2Fnewspapers`);
      const htmlString = await response.text();
      const $ = cheerio.load(htmlString);

      const articles = [];
      $('#main div h3').each(function (index) {

        let title = $("div", this).text();
        let link = $(this).parent().attr('href');

        if (title.includes(cutoff)) {
          title = title.substring(0, title.length - cutoff.length);
        }

        articles.push({
          id: index,
          title: title,
          link: `https://www.google.com${link}`,
        });
      });

      res.statusCode = 200;
      // query -- the query
      // articles -- null if none found
      //    title: title of the article
      //    link: link to the article
      // length -- negative if none found, or # of articles found
      // error -- if error occured
      return res.json({
        query: query,
        articles: articles,
        length: articles.length,
        error: null,
      })
    } catch (e) { // 5
      res.statusCode = 404;
      return res.json({
        query: query,
        articles: null,
        length: -1,
        error: `No results for ${query} found.`,
      })
    }
  }
}
