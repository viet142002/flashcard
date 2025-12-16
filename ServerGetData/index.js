const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");

const URL =
  "https://vn.elsaspeak.com/tu-vung-tieng-anh-giao-tiep-co-ban-theo-chu-de/?srsltid=AfmBOopwtw1Jrr0laNL9-mBFGJozxNEl-d34i1xgDIF3peInQblZDXGe";

async function crawl() {
  try {
    const { data: html } = await axios.get(URL);
    const $ = cheerio.load(html);

    const result = [];

    $("figure.wp-block-table table tbody tr").each((index, tr) => {
      // bỏ dòng header (tr đầu tiên)
      if (index === 0) return;

      const tds = $(tr).find("td");

      const item = {
        word: $(tds[0]).text().trim(),
        phonetic: $(tds[1]).text().trim(),
        meaning: $(tds[2]).text().trim(),
        example: $(tds[3]).text().trim(),
      };

      // tránh dòng rỗng
      if (item.word) {
        result.push(item);
      }
    });

    fs.writeFileSync(
      "elsa_vocab.json",
      JSON.stringify(result, null, 2),
      "utf-8"
    );

    console.log(`✅ Crawl xong: ${result.length} từ vựng`);
  } catch (error) {
    console.error("❌ Lỗi crawl:", error.message);
  }
}

crawl();
