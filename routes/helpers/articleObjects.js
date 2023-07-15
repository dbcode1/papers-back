module.exports = function (arr1, arr2, arr3) {
  const filteredNews = [];
  // map through all three arrays mapping data to new objects
  arr1.map((item) => {
    if (
      item.webTitle &&
      item.webPublicationDate &&
      item.fields !== undefined &&
      item.webUrl
    ) {
      filteredNews.push({
        title: item.webTitle,
        pub_date: item.webPublicationDate,
        img: item.fields.thumbnail,
        url: item.webUrl,
      });
    } else {
      return;
    }
  });

  arr2.map((item) => {
    if (!item.multimedia.length > 0) {
      return;
    }

    filteredNews.push({
      title: item.headline.main,
      pub_date: item.pub_date,
      img: "https://www.nytimes.com/" + item.multimedia[0].url,
      url: item.web_url,
    });
  });

  arr3.map((item) => {
    if (item.urlToImage == null) {
      return;
    }
<<<<<<< HEAD
    console.log(item);
=======
    console.log(item)
>>>>>>> 3bfc958af97aab186e0a794352cd6f6e70817868
    filteredNews.push({
      title: item.title,
      pub_date: item.publishedAt,
      img: item.urlToImage,
      url: item.url,
      abstract: item.content,
    });
  });

  return filteredNews;
};
