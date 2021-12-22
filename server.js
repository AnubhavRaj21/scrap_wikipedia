import express from "express";
import axios from "axios";
const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.set("view engine", "ejs");

app.get("/", async (req, res) => {
  res.render("index", {
    source: "",
  });
});

app.post("/", (req, res) => {
  let name = req.body.fname;
  let key = name[0];

  let url = `https://en.wikipedia.org/wiki/${key}`;

  async function getWiki(url) {
    try {
      const response = await axios.get(url);

      let source = response.data;

      let patt = /\<h2\>.*?class\=\"mw-headline\".*?\<\/h2\>/gi;

      let patt2 =
        /(?<=(\<h2\>.*?class\=\"mw-headline\".*?\<\/h2\>)).*?(?=(\<h2\>.*?class\=\"mw-headline\".*?\<\/h2\>))/gims;

      let match = source.match(patt);
      let match2 = source.match(patt2);

      return {
        heading: match,
        body: match2,
      };
    } catch (error) {
      console.error(error);
    }
  }

  getWiki(url).then((data) => {
    let head = data.heading;
    let sou = data.body;

    res.render("results", {
      heading: head,
      source: sou,
    });
  });
});

app.listen(port, () => {
  console.log(`server is listening at port ${port}`);
});
